import { Checkout } from "checkout-sdk-node";
import { NextResponse } from "next/server";

// Documentation: https://github.com/checkout/frames-react
// Get Started: https://www.checkout.com/docs/get-started
export async function POST(request, response) {
  const body = await request.json();
  console.log(body);
  const { token, preferred_scheme } = body; // Get the token from the request body

  const cko = new Checkout(process.env.SECRET_KEY);

  try {
    let paymentRequest = {
      source: {
        type: "token",
        token, // The token received from the client-side Frames
      },
      processing_channel_id: process.env.PROCESSING_CHANNEL_ID,
      "3ds": {
        enabled: true, // doesn't work with 'true' (works only when providing 'eci', 'cryptogram', etc.). Error code: 'no_processor_configured_for_card_scheme'. 
      },
      currency: "EUR",
      amount: 3399,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
      failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failure`,
    };

    // Conditionally add the processing field if preferred_scheme exists and is not empty
    if (preferred_scheme && preferred_scheme.trim() !== "") {
      paymentRequest.processing = {
        preferred_scheme,
      };
    }

    const paymentResponse = await cko.payments.request(paymentRequest);
    console.log(paymentResponse);
    // Send the payment response back to the client
    return NextResponse.json(paymentResponse);
  } catch (error) {
    console.log(error.body);
    return NextResponse.json({ error: error.body }, { status: 500 });
  }
}