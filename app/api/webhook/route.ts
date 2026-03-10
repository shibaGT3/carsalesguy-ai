import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;

      console.log("Checkout completed:", {
        sessionId: session.id,
        metadata,
      });

      // TODO: Trigger email generation or unlock content here
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Webhook handler failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
