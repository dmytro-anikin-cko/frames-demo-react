import { NextResponse } from "next/server";

export async function POST(request, response) {

  try {
    let paymentContextRequest = {
        currency: "EUR",
        amount: 1000,
        source: {
          type: "klarna",
          account_holder: {
            billing_address: {
              country: "DE"
            }
          }
        },
        items: [
          {
            name: "Battery Power Pack",
            quantity: 1,
            unit_price: 1000,
            total_amount: 1000,
            reference: "BA67A"
          }
        ],
        processing: {
          locale: "en-GB"
        },
        processing_channel_id: process.env.PROCESSING_CHANNEL_ID
    };


    const paymentResponse = await fetch('https://api.sandbox.checkout.com/payment-contexts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SECRET_KEY}`, // Replace YOUR_SECRET_KEY with your actual Checkout.com secret key
      },
      body: JSON.stringify(paymentContextRequest),
    });

    const paymentData = await paymentResponse.json();



    // Send the payment response back to the client
    return NextResponse.json(paymentData);
  } catch (error) {
    console.log("Error on the server:", error.body);
    return NextResponse.json({ error: error.body }, { status: 500 });
  }
}
