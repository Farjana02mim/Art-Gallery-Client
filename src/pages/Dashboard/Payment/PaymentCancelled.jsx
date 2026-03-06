import React from 'react'
import { Link } from 'react-router'

const PaymentCancelled = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 space-y-6">

      <h2 className="text-2xl font-semibold text-red-500">
        Payment Cancelled ❌
      </h2>

      <p className="text-gray-500">
        Your payment was cancelled. You can try again anytime.
      </p>

      <Link to="/dashboard/my-arts">
        <button className="btn btn-primary text-black">
          Try Again
        </button>
      </Link>

    </div>
  )
}

export default PaymentCancelled