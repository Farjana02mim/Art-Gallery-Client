import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import confetti from "canvas-confetti"; // ✅ import

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    if (!sessionId) return;

    let mounted = true;

    // 🎉 Confetti function
    const fireConfetti = () => {
      const duration = 2 * 1000;
      const end = Date.now() + duration;

      const run = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });

        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(run);
        }
      };

      run();
    };

    const verifyPayment = async () => {
      try {
        const res = await axiosSecure.patch(
          `/payment-success?session_id=${sessionId}`
        );

        if (!mounted) return;

        if (res.data.success) {
          setMessage("Payment Successful 🎉");

          setPaymentInfo({
            transactionId: res.data.transactionId,
          });

          // 🎉 trigger confetti
          setTimeout(() => {
            fireConfetti();
          }, 300);

        } else {
          setMessage(res.data.message || "Payment verification failed");
        }

        // clean URL
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

      } catch (err) {
        if (!mounted) return;
        setMessage("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();

    return () => {
      mounted = false;
    };
  }, [sessionId, axiosSecure]);

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-green-50 to-gray-100 
      dark:from-gray-900 dark:to-black px-4">

      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 max-w-md w-full text-center space-y-6">

        {/* Icon */}
        <div className="text-6xl">
          {loading ? "⏳" : "🎉"}
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {message}
        </h2>

        {/* Transaction Info */}
        {paymentInfo?.transactionId && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300">
            <p className="font-semibold">Transaction ID:</p>
            <p className="break-all">{paymentInfo.transactionId}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">

          <Link to="/dashboard/my-purchases">
            <button className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
              🛒 View My Purchases
            </button>
          </Link>

          <Link to="/gallery">
            <button className="w-full py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg">
              🎨 Continue Shopping
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;