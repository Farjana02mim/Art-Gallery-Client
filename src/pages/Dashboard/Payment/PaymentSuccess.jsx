import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();

  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    if (sessionId) {
      axiosSecure
        .patch(`/payment-success?session_id=${sessionId}`)
        .then((res) => {
          if (res.data.success) setMessage("Payment Successful 🎉");
          else setMessage("Payment verification failed");
        })
        .catch(() => setMessage("Something went wrong"));
    }
  }, [sessionId, axiosSecure]);

  return (
    <div className="flex flex-col items-center justify-center mt-20 space-y-6">
      <h2 className="text-4xl text-green-600 font-bold">{message}</h2>
      <Link to="/dashboard/my-arts">
        <button className="btn btn-primary text-black">Go to My Arts</button>
      </Link>
    </div>
  );
};

export default PaymentSuccess;