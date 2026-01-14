import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireStaff } from '@/lib/adminAuth';
import { applyCors } from '@/lib/cors';

const LOGISTICS_STAGE = 'missions';
const WORKSHOP_STAGE = 'atelier';

function normalizeStage(value?: string | null) {
  return (value || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

function isLogisticsStage(value?: string | null) {
  const normalized = normalizeStage(value);
  return normalized === LOGISTICS_STAGE || (normalized.includes('mission') && normalized.includes('logist'));
}

function isWorkshopStage(value?: string | null) {
  const normalized = normalizeStage(value);
  return normalized === WORKSHOP_STAGE || normalized.includes('atelier') || normalized.includes('workshop');
}

function normalizeVehicleInfo(value?: string | null) {
  const raw = (value || '').trim();
  if (!raw) return { brand: null, model: null };
  const parts = raw.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { brand: 'Inconnu', model: raw };
  }
  return {
    brand: parts[0],
    model: parts.slice(1).join(' ') || null,
  };
}

async function ensureLogisticsAppointment(supabase: any, clientId: string, client: any) {
  const { data: existing, error: existingError } = await supabase
    .from('appointments')
    .select('id, status')
    .eq('client_id', clientId)
    .neq('status', 'cancelled')
    .limit(1)
    .maybeSingle();

  if (existingError) {
    console.error('[admin] appointment lookup failed:', existingError);
    return;
  }

  if (existing) return;

  const scheduledAt = new Date();
  scheduledAt.setHours(scheduledAt.getHours() + 1);

  const { error: createError } = await supabase
    .from('appointments')
    .insert([
      {
        client_id: clientId,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: 90,
        service_type: 'collecte',
        type: 'pickup',
        status: 'pending',
        address: client?.address || null,
        message: 'Créé automatiquement depuis le CRM.',
      },
    ]);

  if (createError) {
    console.error('[admin] appointment auto-create failed:', createError);
  }
}

async function ensureWorkshopIntervention(supabase: any, clientId: string, client: any) {
  const { data: existing, error: existingError } = await supabase
    .from('interventions')
    .select('id, vehicles!inner(id, client_id)')
    .eq('vehicles.client_id', clientId)
    .limit(1)
    .maybeSingle();

  if (existingError) {
    console.error('[admin] intervention lookup failed:', existingError);
    return;
  }

  if (existing) return;

  const { data: vehicle, error: vehicleError } = await supabase
    .from('vehicles')
    .select('id')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (vehicleError) {
    console.error('[admin] vehicle lookup failed:', vehicleError);
  }

  let vehicleId = vehicle?.id || null;

  if (!vehicleId) {
    const { brand, model } = normalizeVehicleInfo(client?.vehicle_info);
    const { data: createdVehicle, error: createVehicleError } = await supabase
      .from('vehicles')
      .insert([
        {
          client_id: clientId,
          brand: brand || 'Inconnu',
          model: model || 'Non renseigne',
          type: 'unknown',
        },
      ])
      .select('id')
      .single();

    if (createVehicleError) {
      console.error('[admin] vehicle auto-create failed:', createVehicleError);
      return;
    }

    vehicleId = createdVehicle?.id || null;
  }

  if (!vehicleId) return;

  const { error: createInterventionError } = await supabase
    .from('interventions')
    .insert([
      {
        vehicle_id: vehicleId,
        status: 'diagnosing',
        diagnosis_note: client?.notes || null,
      },
    ]);

  if (createInterventionError) {
    console.error('[admin] intervention auto-create failed:', createInterventionError);
  }
}

export async function OPTIONS() {
  return applyCors(new NextResponse(null, { status: 204 }));
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const auth = await requireStaff(request);
  if ('error' in auth) {
    return auth.error;
  }

  const { data, error } = await auth.supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[admin] client fetch failed:', error);
    return applyCors(NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ client: data }));
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const auth = await requireStaff(request);
  if ('error' in auth) {
    return auth.error;
  }

  const payload = await request.json().catch(() => ({}));

  const { data: existingClient, error: existingError } = await auth.supabase
    .from('clients')
    .select('id, crm_stage, address, vehicle_info, notes')
    .eq('id', id)
    .single();

  if (existingError) {
    console.error('[admin] client lookup failed:', existingError);
  }

  const { data, error } = await auth.supabase
    .from('clients')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('[admin] client update failed:', error);
    return applyCors(NextResponse.json({ error: 'Failed to update client' }, { status: 500 }));
  }

  const updatedStage = payload?.crm_stage;
  const previousStage = existingClient?.crm_stage;
  const stageChanged = Boolean(updatedStage) && updatedStage !== previousStage;
  const clientSnapshot = data || existingClient;

  if (stageChanged && isLogisticsStage(updatedStage)) {
    await ensureLogisticsAppointment(auth.supabase, id, clientSnapshot);
  }

  if (stageChanged && isWorkshopStage(updatedStage)) {
    await ensureWorkshopIntervention(auth.supabase, id, clientSnapshot);
  }

  return applyCors(NextResponse.json({ client: data }));
}

export async function DELETE(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const auth = await requireAdmin(request);
  if ('error' in auth) {
    return auth.error;
  }

  const { error } = await auth.supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[admin] client delete failed:', error);
    return applyCors(NextResponse.json({ error: 'Failed to delete client' }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ success: true }));
}
