import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    if (!sessionId) return;

    let mounted = true;

    axiosSecure
      .patch(`/payment-success?session_id=${sessionId}`)
      .then((res) => {
        if (!mounted) return;

        if (res.data.success) setMessage("Payment Successful 🎉");
        else setMessage(res.data.message || "Payment verification failed");

        // Remove session_id from URL to prevent duplicate request on refresh
        navigate("/dashboard/payment-success", { replace: true });
      })
      .catch(() => {
        if (!mounted) return;
        setMessage("Something went wrong");
      });

    return () => {
      mounted = false;
    };
  }, [sessionId, axiosSecure, navigate]);

  return (
    <div className="flex flex-col items-center justify-center mt-20 space-y-6">
      <h2 className="text-4xl text-green-600 font-bold">{message}</h2>
      <Link to="/dashboard/my-purchases">
        <button className="btn btn-primary text-black">Go to My Purchases</button>
      </Link>
    </div>
  );
};

export default PaymentSuccess;