import { NextResponse } from "next/server";

export async function POST(request, response) {
  const body = await request.json();

  const { customer_id } = body;

  console.log(customer_id);

  try {
    const response = await fetch(
      `https://api.sandbox.checkout.com/customers/${customer_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SECRET_KEY}`, // Replace YOUR_SECRET_KEY with your actual Checkout.com secret key
        },
      }
    );
    const data = await response.json();

    return NextResponse.json({ sourceId: data.default });
  } catch (error) {
    console.log(error.body);
    return NextResponse.json({ error: error.body }, { status: 500 });
  }
}
