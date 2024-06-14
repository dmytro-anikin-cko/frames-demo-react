import Link from "next/link"

export default function verified() {
    return (
      <div>
        <h1>Card Verified!</h1>
        <p><Link className="link link-primary" href="/">Home</Link></p>
      </div>
    )
  }