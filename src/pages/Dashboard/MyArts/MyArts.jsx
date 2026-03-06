import { useQuery } from '@tanstack/react-query'
import React from 'react'
import useAuth from '../../../hooks/useAuth'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { FiEdit } from 'react-icons/fi'
import { FaSearch, FaTrash } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { Link } from 'react-router'

const MyArts = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()

  // load my arts
  const { data: arts = [], refetch, isLoading } = useQuery({
    queryKey: ['my-arts', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/listing?email=${user.email}`)
      return res.data
    },
  })

  // delete art
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This art will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/listing/${id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            refetch()
            Swal.fire('Deleted!', 'Your art has been deleted.', 'success')
          }
        })
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>#</th>
            <th>Art Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {arts.map((art, index) => (
            <tr key={art._id}>
              <th>{index + 1}</th>

              <td>{art.title}</td>

              <td>{art.category}</td>

              <td>${art.cost}</td>

              {/* PAYMENT STATUS */}
              <td>
                {art.paymentStatus === 'paid' ? (
                  <span className="text-green-500 font-semibold">Paid</span>
                ) : (
                  <Link to={`/dashboard/payment/${art._id}`}>
                    <button className="btn btn-primary btn-sm text-black">
                      Pay
                    </button>
                  </Link>
                )}
              </td>

              {/* ACTIONS */}
              <td className="flex gap-2">
                <Link to={`/art/${art._id}`}>
                  <button className="btn btn-square btn-sm hover:bg-primary">
                    <FaSearch />
                  </button>
                </Link>

                <Link to={`/dashboard/update-art/${art._id}`}>
                  <button
                    disabled={art.paymentStatus === 'paid'}
                    className="btn btn-square btn-sm hover:bg-primary disabled:opacity-40"
                  >
                    <FiEdit />
                  </button>
                </Link>

                <button
                  disabled={art.paymentStatus === 'paid'}
                  onClick={() => handleDelete(art._id)}
                  className="btn btn-square btn-sm hover:bg-primary disabled:opacity-40"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MyArts