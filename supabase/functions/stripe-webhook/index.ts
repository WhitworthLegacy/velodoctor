// supabase/functions/stripe-webhook/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe";
import { createClient } from "npm:@supabase/supabase-js";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  // service role is OK ONLY on server/edge (never in client)
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  try {
    const sig = req.headers.get("stripe-signature");
    if (!sig) return json({ error: "Missing Stripe signature" }, 400);

    const rawBody = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err: any) {
      return json({ error: `Invalid signature: ${err.message}` }, 400);
    }

    // Idempotence
    const { data: existing } = await supabaseAdmin
      .from("stripe_events")
      .select("id, processed")
      .eq("event_id", event.id)
      .maybeSingle();

    if (existing?.processed) {
      return json({ received: true, duplicate: true });
    }

    if (!existing) {
      const { error: insErr } = await supabaseAdmin.from("stripe_events").insert({
        event_id: event.id,
        event_type: event.type,
        processed: false,
      });
      if (insErr) throw insErr;
    }

    // Handle checkout session completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const cartRaw = (session.metadata?.cart ?? "[]") as string;
      let cart: { inventory_item_id: string; qty: number }[] = [];
      try {
        cart = JSON.parse(cartRaw);
      } catch {
        cart = [];
      }

      const email = session.customer_details?.email ?? session.customer_email ?? null;
      const total = session.amount_total ? session.amount_total / 100 : 0;

      // Create order
      const { data: order, error: orderErr } = await supabaseAdmin
        .from("orders")
        .insert({
          status: "paid",
          currency: "EUR",
          total,
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent?.toString() ?? null,
          email,
          shipping_address: session.customer_details?.address
            ? JSON.stringify(session.customer_details.address)
            : null,
        })
        .select("*")
        .single();

      if (orderErr) throw orderErr;

      // Fetch inventory_items for pricing validation
      const ids = cart.map((c) => c.inventory_item_id);
      const { data: invItems, error: invErr } = await supabaseAdmin
        .from("inventory_items")
        .select("id, name, price_sell, quantity")
        .in("id", ids);

      if (invErr) throw invErr;

      // Create order_items + stock movements
      for (const c of cart) {
        const it = invItems?.find((x) => x.id === c.inventory_item_id);
        if (!it) continue;

        const unitPrice = Number(it.price_sell ?? 0);
        const qty = Math.max(1, Number(c.qty ?? 1));
        const lineTotal = unitPrice * qty;

        const { error: oiErr } = await supabaseAdmin.from("order_items").insert({
          order_id: order.id,
          inventory_item_id: it.id,
          qty,
          unit_price: unitPrice,
          line_total: lineTotal,
        });
        if (oiErr) throw oiErr;

        // Stock OUT movement
        const { error: smErr } = await supabaseAdmin.from("stock_movements").insert({
          type: "OUT",
          quantity: qty,
          inventory_item_id: it.id,
          notes: `E-COM order ${order.id}`,
        });
        if (smErr) throw smErr;

        // Decrease current stock
        const newQty = Number(it.quantity ?? 0) - qty;
        const { error: upErr } = await supabaseAdmin
          .from("inventory_items")
          .update({ quantity: newQty })
          .eq("id", it.id);
        if (upErr) throw upErr;
      }

      // Mark stripe event processed
      await supabaseAdmin
        .from("stripe_events")
        .update({ processed: true })
        .eq("event_id", event.id);

      return json({ received: true });
    }

    // For other events, just mark processed to avoid repeats (optional)
    await supabaseAdmin
      .from("stripe_events")
      .update({ processed: true })
      .eq("event_id", event.id);

    return json({ received: true });
  } catch (e: any) {
    return json({ error: e?.message ?? "Webhook error" }, 500);
  }
});