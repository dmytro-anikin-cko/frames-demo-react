import GooglePayButton from "@google-pay/button-react";

export default function GooglePayBtn() {
  return (
    <GooglePayButton
      environment="TEST"
      paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: ["MASTERCARD", "VISA"],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: "checkoutltd",
                gatewayMerchantId: "pk_sbox_guri7tp655hvceb3qaglozm7gee",
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: "12345678901234567890",
          merchantName: "Demo Merchant",
        },
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPriceLabel: "Total",
          totalPrice: "4.00",
          currencyCode: "USD",
          countryCode: "US",
        },
      }}
      onLoadPaymentData={async (paymentRequest) => {
        console.log("load payment data", paymentRequest);

        const paymentToken = JSON.parse(
          paymentRequest.paymentMethodData.tokenizationData.token
        );

        // show returned data in developer console for debugging
        console.log("paymentToken", paymentToken);

        const { signature, protocolVersion, signedMessage } = paymentToken;
        let tokenResponse;

        try {
          let reqBody = {
            type: "googlepay",
            token_data: {
              signature,
              protocolVersion,
              signedMessage,
            },
          };

          const response = await fetch(
            `https://api.sandbox.checkout.com/tokens`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer pk_sbox_guri7tp655hvceb3qaglozm7gee`,
              },
              body: JSON.stringify(reqBody),
            }
          );

          tokenResponse = await response.json();

          console.log("CKO token: ", tokenResponse);
        } catch (error) {
          console.error("Error on creating CKO token", error);
        }

        /* 
          Do the payment request with the CKO token 
        */
        const token = tokenResponse.token;

        try {
          let paymentReq = {
            source: {
              type: "token",
              token: token,
            },
            processing_channel_id: "pc_w2njpb6jbjjujgcz5dgzxdn5mm",
            currency: "GBP",
            amount: 400, // pence
            reference: "GPAY-TEST",
          };

          const response = await fetch(
            `https://api.sandbox.checkout.com/payments`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer sk_sbox_odyoauybjpcfbkzmgsnnbiub4mj`,
              },
              body: JSON.stringify(paymentReq),
            }
          );

          const payment = await response.json();

          console.log("Payment Successful:", payment);
          alert("Payment Success!🎉");
        } catch (error) {
          console.error("Error on making payment", error);
          alert("Payment Fail!❌");
        }
      }}
    />
  );
}
