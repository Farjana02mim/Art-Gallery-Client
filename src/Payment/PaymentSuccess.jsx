import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    if (sessionId) {
      axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
      .then(res=>{
        console.log(res.data)
      })
    }
  }, [sessionId, axiosSecure])

  return (
    <div className="text-center mt-20">
      <h2 className="text-4xl text-green-600 font-bold">
        Payment Successful 🎉
      </h2>
    </div>
  )
}

export default PaymentSuccess
