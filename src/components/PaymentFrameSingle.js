"use client";

import { Frames, CardFrame } from "frames-react";
import { useEffect, useState, useRef } from "react";

// Documentation: https://github.com/checkout/frames-react
// Get Started: https://www.checkout.com/docs/get-started
export default function PaymentFrameSingle() {
  const [isCardValid, setIsCardValid] = useState(null);
  const [cardholder, setCardholder] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(null);
  const amountRef = useRef(null);

  const checkCardValid = () => {
    const valid = Frames.isCardValid();
    setIsCardValid(valid);
  };

  const handleEnable = () => {
    Frames.enableSubmitForm();
    console.log("Form re-enabled for submission");
  };

  // Function to handle tokenization success
  const requestPayment = async (event, amountValue) => {
    console.log("Triggered");
    // Cannot get any state here --> returns null
    try {
      console.log(event);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: { type: "token", token: event.token },
          amount: amountValue,
          preferred_scheme: event.preferred_scheme,
          name: event.name,
        }),
      });

      const paymentResult = await response.json();

      // If 500
      if (!response.ok) {
        alert(
          `Payment processing failed💥 ${paymentResult.error.error_codes[0]}`
        );
        // handleEnable(); // Re-enable form for resubmission (Otherwise the PAY button wouldn't work)
        return;
      }

      console.log(paymentResult);

      if (paymentResult.requiresRedirect && paymentResult.redirectLink) {
        // Redirect the user to the 3D Secure page
        window.location.href = paymentResult.redirectLink;
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      alert("Payment processing failed💥");
      handleEnable();
    }
  };

  useEffect(() => {
    console.log("Amount updated:", paymentAmount);
    amountRef.current = paymentAmount; // Update the ref whenever the state changes
  }, [paymentAmount]);

  return (
    <div className="w-full h-auto">
      <Frames
        config={{
          publicKey: "pk_sbox_ffrilzleqqiso6zphoa6dmpr7eo", // Use your own public key
          localization: "EN-GB",
          frameSelector: ".card-frame",
          schemeChoice: true,
          acceptedPaymentMethods: ["Visa", "Mastercard", "Cartes Bancaires"],
          cardholder: {
            name: cardholder,
          },
          // debug: true
        }}
        // Triggered after a card is tokenized.
        cardTokenized={(event) => {
          console.log("cardTokenized", event, amountRef.current);
          requestPayment(event, amountRef.current);
        }}
        // Triggered when Frames is registered on the global namespace and safe to use.
        ready={() => {
          console.log("Frame is ready");
        }}
        // Triggered when the form is rendered.
        frameActivated={(e) => {
          console.log("frameActivated", e);
        }}
        // Triggered when an input field receives focus. Use it to check the validation status and apply the wanted UI changes.
        frameFocus={(e) => {
          console.log("frameFocus", e);
        }}
        // Triggered after an input field loses focus. Use it to check the validation status and apply the wanted UI changes.
        frameBlur={(e) => {
          console.log("frameBlur", e);
        }}
        // Triggered when a field's validation status has changed. Use it to show error messages or update the UI.
        frameValidationChanged={(e) => {
          console.log("frameValidationChanged", e);
        }}
        // Triggered when a valid payment method is detected based on the card number being entered. Use this event to change the card icon.
        paymentMethodChanged={(e) => {
          console.log("paymentMethodChanged", e);
        }}
        // Triggered when the state of the card validation changes.
        cardValidationChanged={(e) => {
          console.log("cardValidationChanged", e);
        }}
        // Triggered when the card form has been submitted.
        cardSubmitted={() => {
          console.log("cardSubmitted");
        }}
        // Triggered if card tokenization failed.
        cardTokenizationFailed={(e) => {
          console.log("cardTokenizationFailed", e);

          handleEnable(); // Enable the form for resubmission
        }}
        // Triggered when the user inputs or changes the first 8 digits of a card.
        cardBinChanged={(e) => {
          console.log("cardBinChanged", e);
        }}
      >
        <div className="w-full flex flex-col">
          <input
            type="text"
            placeholder="Amount to Charge"
            className="input input-bordered w-full mb-4"
            onChange={(e) => setPaymentAmount(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col">
          <input
            type="text"
            placeholder="Cardholder Name"
            className="input input-bordered w-full mb-4"
            onChange={(e) => setCardholder(e.target.value)}
          />
        </div>

        <CardFrame />

        <div className="flex flex-col">
          <button
            className="btn btn-primary my-4"
            onClick={() => {
              console.log("submitCard");
              Frames.submitCard();
            }}
          >
            PAY
          </button>

          <button className="btn btn-neutral mb-4" onClick={checkCardValid}>
            Is card valid?
          </button>
          <div>
            {isCardValid === null
              ? ""
              : isCardValid
              ? "Card is valid"
              : "Card is invalid"}
          </div>

          <button
            className="btn btn-neutral mb-4"
            onClick={handleEnable}
          >
            Re-enable Form
          </button>
        </div>
      </Frames>
    </div>
  );
}
