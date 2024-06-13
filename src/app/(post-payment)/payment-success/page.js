import Link from "next/link";

export default function success() {
    return (
      <div>
        <h1>Payment successful!</h1>
        <p><Link className="link link-primary" href="/">Home</Link></p>
      </div>
    )
  }