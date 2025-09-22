import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "usd", isMonthly } = await request.json()

    // Here you would integrate with Stripe
    // For demonstration purposes, we'll return a mock response
    const paymentIntent = {
      id: "pi_mock_payment_intent",
      client_secret: "pi_mock_payment_intent_secret",
      amount: amount * 100, // Stripe expects amount in cents
      currency,
      status: "requires_payment_method",
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
