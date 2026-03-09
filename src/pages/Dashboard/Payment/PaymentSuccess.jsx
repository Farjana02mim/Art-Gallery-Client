import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState({});
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();

  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    if (!sessionId) return;

    let mounted = true;

    const verifyPayment = async () => {
      try {
        const res = await axiosSecure.patch(`/payment-success?session_id=${sessionId}`);
        if (!mounted) return;

        if (res.data.success) {
          setMessage("Payment Successful 🎉");
        } else {
          setMessage(res.data.message || "Payment verification failed");
        }

        setPaymentInfo({
          transactionId: res.data.transactionId,
        });

        // ✅ Remove session_id from URL to prevent duplicate request on refresh
        const cleanUrl = window.location.pathname; // removes query params
        window.history.replaceState({}, document.title, cleanUrl);

      } catch (err) {
        if (!mounted) return;
        setMessage("Something went wrong");
      }
    };

    verifyPayment();

    return () => {
      mounted = false;
    };
  }, [sessionId, axiosSecure]);

  return (
    <div className="flex flex-col items-center justify-center mt-20 space-y-6">
      <h2 className="text-4xl text-green-600 font-bold">{message}</h2>
      {paymentInfo.transactionId && (
        <p>Your Transaction ID: {paymentInfo.transactionId}</p>
      )}
      <Link to="/dashboard/my-purchases">
        <button className="btn btn-primary text-black">
          Go to My Purchases
        </button>
      </Link>
    </div>
  );
};

export default PaymentSuccess;