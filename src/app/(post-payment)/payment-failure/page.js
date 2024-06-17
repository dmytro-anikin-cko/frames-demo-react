"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Loader from '@/UI/Loader';
import Link from 'next/link';

export default function PaymentSuccess() {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPaymentDetails = async (sessionId) => {
      try {
        const response = await fetch(`/api/getPaymentDetails?cko-session-id=${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch payment details');
        }
        const data = await response.json();
        console.log(data);
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
      <h1>Payment Failed ❌</h1>
      {paymentDetails && (
        <div>
          <p>Status: {paymentDetails.status}.</p>
          <p>Code: {paymentDetails.actions[0].response_code}.</p>
          <p>Summary: {paymentDetails.actions[0].response_summary}.</p>
          <p><Link className="link link-primary" href="/">Home</Link></p>
        </div>
      )}
    </div>
  );
}
