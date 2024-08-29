import { NextResponse } from "next/server";

export async function POST(request, response) {
  try {
    const body = await request.json();
    console.log(body);
    const { id } = body; // Get the token from the request body

    let paymentRequest = {
      payment_context_id: id,
      processing_channel_id: process.env.PROCESSING_CHANNEL_ID,
    };
    console.log(paymentRequest);

    const paymentResponse = await fetch(
      "https://api.sandbox.checkout.com/payments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SECRET_KEY}`, // Replace YOUR_SECRET_KEY with your actual Checkout.com secret key
        },
        body: JSON.stringify(paymentRequest),
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
