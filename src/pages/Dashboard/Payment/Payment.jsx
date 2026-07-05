import { useLocation } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Payment = () => {
  const location = useLocation();
  const listing = location.state?.listing;
  const axiosSecure = useAxiosSecure();

  if (!listing) {
    return <p className="text-center mt-10">Listing data not found!</p>;
  }

  const handlePayment = async () => {
    try {
      const paymentInfo = {
        price: listing.price,
        artId: listing._id,
        email: listing.email,
        name: listing.name,
      };

      const res = await axiosSecure.post(
        "/create-checkout-session",
        paymentInfo,
      );

      if (res.data?.url) {
        window.location.replace(res.data.url);
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl mb-4">
        Please Pay ${listing.price} for {listing.name}
      </h2>

      <button onClick={handlePayment} className="btn btn-primary text-black">
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
