import { NextResponse } from "next/server";

export async function POST(request, response) {
  try {
    const paymentResponse = await fetch(
      "https://api.sandbox.checkout.com/payments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SECRET_KEY}`, // Replace YOUR_SECRET_KEY with your actual Checkout.com secret key
        },
        body: JSON.stringify({
          amount: 1000,
          currency: "EUR",
          source: {
            type: "mbway",
          },
          reference: "ORD-5023-4E89",
          customer: {
            phone: {
              country_code: "777",
              number: "12345678",
            },
          },
          processing_channel_id: process.env.PROCESSING_CHANNEL_ID
        }),
      }
    );

    const paymentData = await paymentResponse.json();

    // Send the payment response back to the client
    return NextResponse.json(paymentData);
  } catch (error) {
    console.log("Error on the server:", error);
    return NextResponse.json({ error: error.body }, { status: 500 });
  }
}
