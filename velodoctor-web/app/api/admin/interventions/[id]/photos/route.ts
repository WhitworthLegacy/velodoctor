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
    console.error("[admin] photo upload form parse failed:", error);
    return applyCors(NextResponse.json({ error: "Invalid form data" }, { status: 400 }));
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return applyCors(NextResponse.json({ error: "Missing file" }, { status: 400 }));
  }

  const fileName = sanitizeFileName(file.name || "upload");
  const storagePath = `interventions/${id}/${Date.now()}-${fileName}`;

  const { error: uploadError } = await auth.supabase.storage
    .from("photos")
    .upload(storagePath, file, {
      contentType: file.type || undefined,
    });

  if (uploadError) {
    console.error("[admin] photo upload failed:", uploadError);
    return applyCors(NextResponse.json({ error: "Failed to upload photo" }, { status: 500 }));
  }

  const { data: publicUrlData } = auth.supabase.storage
    .from("photos")
    .getPublicUrl(storagePath);

  const photoUrl = publicUrlData?.publicUrl;
  if (!photoUrl) {
    return applyCors(NextResponse.json({ error: "Failed to read photo URL" }, { status: 500 }));
  }

  const { data: intervention, error: fetchError } = await auth.supabase
    .from("interventions")
    .select("photos_before")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    console.error("[admin] intervention lookup failed:", fetchError);
    return applyCors(NextResponse.json({ error: "Failed to load intervention" }, { status: 500 }));
  }

  if (!intervention) {
    return applyCors(NextResponse.json({ error: "Intervention not found" }, { status: 404 }));
  }

  const existingPhotos = Array.isArray(intervention.photos_before)
    ? intervention.photos_before
    : [];
  const updatedPhotos = [...existingPhotos, photoUrl];

  const { data: updated, error: updateError } = await auth.supabase
    .from("interventions")
    .update({ photos_before: updatedPhotos })
    .eq("id", id)
    .select("photos_before")
    .single();

  if (updateError) {
    console.error("[admin] intervention photo update failed:", updateError);
    return applyCors(NextResponse.json({ error: "Failed to update intervention" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ photos: updated.photos_before, photoUrl }));
}
