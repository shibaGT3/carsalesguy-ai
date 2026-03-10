import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/generate`,
      metadata: {
        formData: JSON.stringify(body.formData),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Failed to create checkout session";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
