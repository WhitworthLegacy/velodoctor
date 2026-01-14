import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/adminAuth";
import { applyCors } from "@/lib/cors";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function OPTIONS() {
  return applyCors(new NextResponse(null, { status: 204 }));
}

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const auth = await requireStaff(request);
  if ("error" in auth) {
    return auth.error;
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error("[admin] crm photo upload failed to parse form:", error);
    return applyCors(NextResponse.json({ error: "Invalid form data" }, { status: 400 }));
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return applyCors(NextResponse.json({ error: "Missing file" }, { status: 400 }));
  }

  const fileName = sanitizeFileName(file.name || "upload");
  const storagePath = `clients/${id}/${Date.now()}-${fileName}`;

  const { error: uploadError } = await auth.supabase.storage
    .from("photos")
    .upload(storagePath, file, {
      contentType: file.type || undefined,
    });

  if (uploadError) {
    console.error("[admin] crm photo upload failed:", uploadError);
    return applyCors(NextResponse.json({ error: "Failed to upload photo" }, { status: 500 }));
  }

  const { data: publicUrlData } = auth.supabase.storage
    .from("photos")
    .getPublicUrl(storagePath);

  const photoUrl = publicUrlData?.publicUrl;
  if (!photoUrl) {
    return applyCors(NextResponse.json({ error: "Failed to read photo URL" }, { status: 500 }));
  }

  const { data: client, error: fetchError } = await auth.supabase
    .from("clients")
    .select("crm_photos")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    console.error("[admin] crm photo upload client lookup failed:", fetchError);
    return applyCors(NextResponse.json({ error: "Failed to load client" }, { status: 500 }));
  }

  if (!client) {
    return applyCors(NextResponse.json({ error: "Client not found" }, { status: 404 }));
  }

  const existingPhotos = Array.isArray(client.crm_photos) ? client.crm_photos : [];
  const updatedPhotos = [...existingPhotos, photoUrl];

  const { data: updated, error: updateError } = await auth.supabase
    .from("clients")
    .update({ crm_photos: updatedPhotos })
    .eq("id", id)
    .select("crm_photos")
    .single();

  if (updateError) {
    console.error("[admin] crm photo update failed:", updateError);
    return applyCors(NextResponse.json({ error: "Failed to update client" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ photos: updated.crm_photos, photoUrl }));
}
