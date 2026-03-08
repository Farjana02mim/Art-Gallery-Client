import { useLocation } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Payment = () => {
  const location = useLocation();
  const listing = location.state?.listing;
  const axiosSecure = useAxiosSecure();

  if (!listing) return <p className="text-center mt-10">Listing data not found!</p>;

  const handlePayment = async () => {
    const paymentInfo = {
      price: listing.price,
      artId: listing._id,
      senderEmail: listing.email,
      name: listing.name,
    };

    const res = await axiosSecure.post("/create-checkout-session", paymentInfo);
    window.location.replace(res.data.url);
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