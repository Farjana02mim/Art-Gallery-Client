import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const Payment = () => {
  const { artId } = useParams()
  const axiosSecure = useAxiosSecure()

  const { data: art, isLoading } = useQuery({
    queryKey: ['art', artId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/listing/${artId}`)
      return res.data
    },
  })

  const handlePayment = async () => {
    const paymentInfo = {
      cost: art.cost,
      artId: art._id,
      senderEmail: art.email,
      artName: art.title,
    }

    const res = await axiosSecure.post('/create-checkout-session', paymentInfo)

    window.location.replace(res.data.url)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    )
  }

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl mb-4">
        Please Pay ${art.cost} for {art.title}
      </h2>

      <button
        onClick={handlePayment}
        className="btn btn-primary text-black"
      >
        Pay Now
      </button>
    </div>
  )
}

export default Payment