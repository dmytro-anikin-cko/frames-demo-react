"use client";

import { useState } from "react";

export default function OneClickPayment() {
  const [loading, setLoading] = useState(false);

  const getSource = async () => {
    const response = await fetch("api/getsource", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customer_id: "cus_xm53tl3snqpupal24w524qrnzi" }), // Hardcoded. But, usually, has to be retrieved from the app's session
    });

    // If 500
    if (!response.ok) {
      alert(`Something went wrong💥`);
      return;
    }

    const data = await response.json();
    const { sourceId } = data;

    requestPayment(sourceId);
  };

  const requestPayment = async (sourceId) => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Not passing the amount, will be zero by default
        body: JSON.stringify({ source: { type: "id", id: sourceId } }),
      });

      const paymentResult = await response.json();

      // If 500
      if (!response.ok) {
        alert(
          `Payment failed💥 ${paymentResult.error.error_codes[0]}`
        );
        return;
      }

      console.log(paymentResult);

      if (paymentResult.requiresRedirect && paymentResult.redirectLink) {
        // Redirect the user to the 3D Secure page
        window.location.href = paymentResult.redirectLink;

        // Check if the window was blocked by a popup blocker
        if (newWindow) {
            newWindow.focus();
        } else {
            alert('Please allow popups for this website to complete the payment.');
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed💥");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    await getSource();
    setLoading(false);
  };

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "One-Click Payment"}
      </button>
    </div>
  );
}
