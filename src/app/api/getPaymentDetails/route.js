import { Checkout } from "checkout-sdk-node";
import { NextResponse } from "next/server";

export async function POST(request, response) {
  // const { searchParams } = new URL(request.url);
  // const sessionId = searchParams.get("cko-session-id");

  const body = await request.json();
  console.log(body);
  const { sessionId } = body; 

  const cko = new Checkout(process.env.SECRET_KEY);

  try {
    const paymentDetails = await cko.payments.get(sessionId);

    return NextResponse.json(paymentDetails);
  } catch (error) {
    console.error("Error fetching payment details:", error.body);
    return NextResponse.json({ error: error.body }, { status: 500 });
  }
}
