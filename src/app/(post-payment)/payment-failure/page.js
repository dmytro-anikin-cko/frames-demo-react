// app/(post-payment)/payment-success/page.js
"use client"

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Loader from '@/UI/Loader';
import Link from 'next/link';

function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('cko-session-id');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchPaymentDetails(sessionId) {
    const response = await fetch(`/api/getPaymentDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch payment details');
    }
    return response.json();
  }

  useEffect(() => {
    if (sessionId) {
      fetchPaymentDetails(sessionId)
        .then(setPaymentDetails)
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    } else {
      setError('Session ID not provided');
      setLoading(false);
    }
  }, [sessionId]);

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

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PaymentFailurePage />
    </Suspense>
  );
}