import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const Payment = () => {
  const { parcelId } = useParams()
  const axiosSecure = useAxiosSecure()

  const { data: parcel, isLoading } = useQuery({
    queryKey: ['parcel', parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`)
      return res.data
    },
  })

  const handlePayment = async () => {
    const paymentInfo = {
      cost: parcel.cost,
      parcelId: parcel._id,
      senderEmail: parcel.senderEmail,
      parcelName: parcel.parcelName,
    }

    const res = await axiosSecure.post('/create-checkout-session', paymentInfo)
    window.location.replace(res.data.url)
  }

  if (isLoading) {
    return <span className="loading loading-infinity loading-xl"></span>
  }

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl mb-4">
        Please Pay ${parcel.cost} for {parcel.parcelName}
      </h2>
      <button onClick={handlePayment} className="btn btn-primary text-black">
        Pay Now
      </button>
    </div>
  )
}

export default Payment
