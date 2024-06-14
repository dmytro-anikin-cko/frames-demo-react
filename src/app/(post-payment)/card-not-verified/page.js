import Link from "next/link"

export default function notVerified() {
    return (
      <div>
        <h1>Card Not Verified :(</h1>
        <p><Link className="link link-primary" href="/">Home</Link></p>
      </div>
    )
  }