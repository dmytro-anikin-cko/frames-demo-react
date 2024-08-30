export default function MBWayPayBtn() {
  const requestMBWayPayment = async () => {
    try {
      const response = await fetch("/api/requestMBWayPayment", {
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("Failed to request Klarna payment");
      }

      const paymentData = await response.json();

      console.log(paymentData);
    } catch (error) {
      console.error("Error sending MBWay payment:", error);
      alert("MBWay payment failed💥", error);
    }
  };

  return (
    <div>
      <button
        className="btn btn-primary my-4"
        onClick={() => requestMBWayPayment()}
      >
        Pay with MBWay
      </button>
    </div>
  );
}
