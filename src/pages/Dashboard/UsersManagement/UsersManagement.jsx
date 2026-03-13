import React from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query';
import { FiShieldOff } from "react-icons/fi";
import { FaUserShield, FaTrash } from "react-icons/fa";
import Swal from 'sweetalert2';
import { useState } from 'react';

const UsersManagement = () => {

  const axiosSecure = useAxiosSecure();
  const [searchText, setSearchText] = useState('')

  const { data: users = [], refetch } = useQuery({
    queryKey: ['users',searchText],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?searchText=${searchText}`);
      return res.data;
    }
  })


  // ==============================
  // MAKE ADMIN
  // ==============================

  const handleMakeAdmin = (user) => {

    Swal.fire({
      title: "Make Admin?",
      text: `${user.name} will become Admin`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Make Admin"
    }).then((result) => {

      if (result.isConfirmed) {

        const roleInfo = { role: 'admin' }

        axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
          .then(res => {

            if (res.data.modifiedCount) {

              refetch()

              Swal.fire({
                position: "top-end",
                title: `${user.name} marked as Admin`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false
              });

            }

          })
          .catch(err => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: err.response?.data?.message || err.message,
            });
          });

      }

    });

  }


  // ==============================
  // REMOVE ADMIN
  // ==============================

  const handleRemoveAdmin = (user) => {

    Swal.fire({
      title: "Remove Admin?",
      text: `${user.name} will become User again`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove Admin"
    }).then((result) => {

      if (result.isConfirmed) {

        const roleInfo = { role: 'user' }

        axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
          .then(res => {

            if (res.data.modifiedCount) {

              refetch()

              Swal.fire({
                position: "top-end",
                title: `${user.name} removed from Admin`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false
              });

            }

          })
          .catch(err => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: err.response?.data?.message || err.message,
            });
          });

      }

    });

  }


  // ==============================
  // DELETE USER
  // ==============================

  const handleDeleteUser = (id) => {

    Swal.fire({
      title: "Are you sure?",
      text: "User will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete"
    }).then(async (result) => {

      if (result.isConfirmed) {

        const res = await axiosSecure.delete(`/users/${id}/role`)

        if (res.data.deletedCount) {

          refetch()

          Swal.fire({
            icon: "success",
            title: "User Deleted",
            timer: 2000,
            showConfirmButton: false
          });

        }

      }

    });

  }


  return (
    <div>

      <h2 className="text-4xl mb-6">
        Manage Users: {users.length}
      </h2>
            <label className="input">
  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2.5"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </g>
  </svg>
  <input 
  onChange={(e) => setSearchText(e.target.value)}
  type="search" 
  className="grow" 
  placeholder="Search Users" />
</label>

      <div className="overflow-x-auto">

        <table className="table">

          <thead>
            <tr className='text-black'>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Admin Action</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user, index) => (

              <tr key={user._id}>

                <td>{index + 1}</td>

                <td>
                  <div className="flex items-center gap-3">

                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={user.photoURL} alt="avatar" />
                      </div>
                    </div>

                    <div>
                      <div className="font-bold">
                        {user.name}
                      </div>
                    </div>

                  </div>
                </td>

                <td>{user.email}</td>

                <td>
                  <span className={`badge 
                  ${user.role === 'admin' ? 'badge-success' : 'badge-outline'}`}>
                    {user.role || 'user'}
                  </span>
                </td>


                {/* ADMIN ACTION */}

                <td>

                  {user.role === 'admin' ? (

                    <button
                      onClick={() => handleRemoveAdmin(user)}
                      className="btn btn-warning"
                    >
                      <FiShieldOff />
                    </button>

                  ) : (

                    <button
                      onClick={() => handleMakeAdmin(user)}
                      className="btn btn-success"
                    >
                      <FaUserShield />
                    </button>

                  )}

                </td>


                {/* DELETE */}

                <td>

                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="btn btn-error"
                  >
                    <FaTrash />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default UsersManagement