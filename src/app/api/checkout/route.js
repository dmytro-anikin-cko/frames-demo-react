import { Checkout } from "checkout-sdk-node";
import { NextResponse } from "next/server";

const generateRandomAmount = () => {
  return Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
};

// Documentation: https://github.com/checkout/frames-react
// Get Started: https://www.checkout.com/docs/get-started
export async function POST(request, response) {
  console.log("Processing Channel ID:", process.env.PROCESSING_CHANNEL_ID);
  console.log("Secret Key:", process.env.SECRET_KEY);
  try {

    const body = await request.json();
    console.log(body);
    const { source, amount, preferred_scheme, name } = body; // Get the token from the request body
  
    const cko = new Checkout(process.env.SECRET_KEY);

    let paymentRequest = {
      source,
      processing_channel_id: process.env.PROCESSING_CHANNEL_ID,
      "3ds": {
        enabled: true, // For Cartes Bancaires, doesn't work with 'true' (works only when providing 'eci', 'cryptogram', etc.). Error code: 'no_processor_configured_for_card_scheme'. 
      },
      currency: "EUR",
      amount: amount || 0,
      reference: `ORD-${generateRandomAmount()}`,
      customer: {
        name: name
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
      failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failure`,
    };
    console.log(paymentRequest);

    // Conditionally add the processing field if preferred_scheme exists and is not empty
    if (preferred_scheme && preferred_scheme.trim() !== "") {
      paymentRequest.processing = {
        preferred_scheme,
      };
    }

    // ------------------------------------ Method 1: SDK (START) ------------------------------------
    const paymentResponse = await cko.payments.request(paymentRequest);
    console.log(paymentResponse);
    
    // ------------------------------------ Method 1: SDK (END) ------------------------------------


    // ------------------------------------ Method 2: Fetch (START) ------------------------------------

    // const paymentResponse = await fetch('https://api.sandbox.checkout.com/payments', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${process.env.SECRET_KEY}`, // Replace YOUR_SECRET_KEY with your actual Checkout.com secret key
    //   },
    //   body: JSON.stringify(paymentRequest),
    // });

    // const paymentData = await paymentResponse.json();
    // ------------------------------------ Method 2: Fetch (END) ------------------------------------


    // Send the payment response back to the client
    return NextResponse.json(paymentResponse);
  } catch (error) {
    console.log("Error on the server:", error.body);
    return NextResponse.json({ error: error.body }, { status: 500 });
  }
}
