"use client";
import { useEffect, useState } from "react";

export default function KlarnaPayBtn() {
  const [klarnaClientToken, setKlarnaClientToken] = useState(null);
  const [paymentContext, setPaymentContext] = useState(null);

  const getPaymentContext = async () => {
    try {
      const response = await fetch("/api/getPaymentContext", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment context");
      }

      const paymentContextData = await response.json();
      console.log("Payment Context received:", paymentContextData);

      // Store context in state
      setPaymentContext(paymentContextData);
    } catch (error) {
      console.error("Error getting Payment Context:", error);
      alert("Getting Payment Context failed💥", error);
    }
  };

  useEffect(() => {
    getPaymentContext();
  }, []);

  const loadKlarna = () => {
    if (!paymentContext || !paymentContext.partner_metadata) {
      console.error("Payment context or client token not available");
      return;
    }

    const { client_token } = paymentContext.partner_metadata;

    // Check if Klarna is available in the global scope
    if (typeof Klarna === "undefined") {
      console.error("Klarna SDK not loaded");
      return;
    }

    try {
      Klarna.Payments.init({
        client_token: client_token,
      });

      Klarna.Payments.load(
        {
          container: "#klarna-payments-container",
          instance_id: "klarna-payments-instance", // Same as instance_id set in Klarna.Payments.authorize().
          // payment_method_category: 'pay_later'
        },
        {
          // purchase_country: "GB",
          // purchase_currency: "GBP",
          // locale: "en-GB",
          // billing_address: {
          //   given_name: "John",
          //   family_name: "Doe",
          //   email: "john@doe.com",
          //   title: "Mr",
          //   street_address: "13 New Burlington St",
          //   street_address2: "Apt 214",
          //   postal_code: "W13 3BG",
          //   city: "London",
          //   region: "",
          //   phone: "01895808221",
          //   country: "GB",
          // },
          // shipping_address: {
          //   given_name: "John",
          //   family_name: "Doe",
          //   email: "john@doe.com",
          //   title: "Mr",
          //   street_address: "13 New Burlington St",
          //   street_address2: "Apt 214",
          //   postal_code: "W13 3BG",
          //   city: "London",
          //   region: "",
          //   phone: "01895808221",
          //   country: "GB",
          // },
          // order_amount: 10,
          // order_tax_amount: 0,
          // order_lines: [
          //   {
          //     type: "physical",
          //     reference: "19-402",
          //     name: "Battery Power Pack",
          //     quantity: 1,
          //     unit_price: 10,
          //     tax_rate: 0,
          //     total_amount: 10,
          //     total_discount_amount: 0,
          //     total_tax_amount: 0,
          //     product_url: "https://www.estore.com/products/f2a8d7e34",
          //     image_url: "https://www.exampleobjects.com/logo.png",
          //   },
          // ],
          // customer: {
          //   date_of_birth: "1970-01-01",
          //   gender: "male",
          // },
        },
        function (res) {
          console.debug("Klarna Payment Widget loaded:", res);
        }
      );
    } catch (error) {
      console.error("Error loading Klarna:", error);
      alert("Klarna failed to load💥", error);
    }
  };

  useEffect(() => {
    if (paymentContext) {
      loadKlarna();
    }
  }, [paymentContext]);

  const requestPayment = async () => {
    const { id } = paymentContext;

    try {
      const response = await fetch("/api/requestKlarnaPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to request Klarna payment");
      }

      const paymentData = await response.json();

      console.log(paymentData);
      
    } catch (error) {
      console.error("Error getting requesting Klarna payment:", error);
      alert("Requesting Klarna payment failed💥", error);
    }
  };

  const authorizeKlarna = () => {
    try {
      Klarna.Payments.authorize(
        {
          instance_id: "klarna-payments-instance", // Same as instance_id set in Klarna.Payments.load().
        },
        {
          // NOTE: the field name are for Klarna
          // CKO docs: https://www.checkout.com/docs/payments/add-payment-methods/klarna#Authorize_the_session
          // Klarna Docs: https://docs.klarna.com/payments/web-payments/integrate-with-klarna-payments/step-2-checkout/#get-authorization-authorize-call
          billing_address: {
            given_name: "Random",
            family_name: "Test",
            email: "random@email.com",
            street_address: "Osdorpplein 137",
            postal_code: "1068 SR",
            city: "Amsterdam",
            country: "NL",
          },
        },
        function (res) {
          console.log("Authorize outcome:", res);

          if(res.approved){
            requestPayment()
          }
        }
      );
    } catch (error) {
      console.error("Error authorizing Klarna:", error);
      alert("Klarna failed to authorize💥", error);
    }
  };

  return (
    <div>
      <button
        className="btn btn-primary my-4"
        onClick={() => authorizeKlarna()}
      >
        Pay with Klarna
      </button>
      {/* Placeholder for Klarna Payment Widget */}
      <div id="klarna-payments-container"></div>
    </div>
  );
}
