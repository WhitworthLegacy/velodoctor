import { NextResponse } from "next/server";

/**
 * Checkout temporairement désactivé
 * Stripe sera réactivé plus tard
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Checkout temporarily disabled",
      message: "Stripe is not configured yet"
    },
    { status: 503 }
  );
}