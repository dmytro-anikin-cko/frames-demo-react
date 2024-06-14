"use client"
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Loader from '@/UI/Loader';

export default function PaymentSuccess() {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchPaymentDetails = async (sessionId) => {
      try {
        const response = await fetch(`/api/getPaymentDetails?cko-session-id=${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch payment details');
        }
        const data = await response.json();
        setPaymentDetails(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const sessionId = searchParams.get('cko-session-id');
    if (sessionId) {
      fetchPaymentDetails(sessionId);
    }
  }, [searchParams]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Payment Success🎉</h1>
      {paymentDetails && (
        <div>
          <p>Thank you for your order number {paymentDetails.reference}, you paid with your {paymentDetails.source.scheme} ending in {paymentDetails.source.last4}.</p>
        </div>
      )}
    </div>
  );
}
