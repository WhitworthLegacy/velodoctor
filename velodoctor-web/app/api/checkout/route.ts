import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // IMPORTANT: for server-side use, prefer a server key with RLS-safe approach.
  // For now we use anon + RLS staff? If RLS blocks public, move this to an Edge Function.
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type CartItem = { inventory_item_id: string; qty: number };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cart: CartItem[] = body?.cart ?? [];

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Fetch items from inventory_items
    const ids = cart.map((c) => c.inventory_item_id);
    const { data: items, error } = await supabase
      .from("inventory_items")
      .select("id,name,price_sell,quantity")
      .in("id", ids);

    if (error) throw error;
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Items not found" }, { status: 404 });
    }

    // Build line items for Stripe
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.map(
      (c) => {
        const it = items.find((x) => x.id === c.inventory_item_id);
        if (!it) throw new Error(`Item not found: ${c.inventory_item_id}`);
        if (c.qty <= 0) throw new Error("Invalid qty");

        const unitAmount = Math.round(Number(it.price_sell ?? 0) * 100);
        if (!unitAmount || unitAmount < 1) {
          throw new Error(`Invalid price for item ${it.name}`);
        }

        return {
          quantity: c.qty,
          price_data: {
            currency: "eur",
            unit_amount: unitAmount,
            product_data: { name: it.name },
          },
        };
      }
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      // We'll rely on webhook to create orders
      metadata: {
        // Store cart as JSON string for webhook use
        cart: JSON.stringify(cart),
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Checkout error" },
      { status: 500 }
    );
  }
}