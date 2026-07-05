import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { FiShieldOff } from "react-icons/fi";
import { FaUserShield, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const UsersManagement = () => {
  const axiosSecure = useAxiosSecure();
  const [searchText, setSearchText] = useState("");

  const { data: users = [], refetch } = useQuery({
    queryKey: ["users", searchText],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?searchText=${searchText}`);
      return res.data;
    },
  });

  // MAKE ADMIN
  const handleMakeAdmin = (user) => {
    Swal.fire({
      title: "Make Admin?",
      text: `${user.name} will become Admin`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Make Admin",
    }).then((result) => {
      if (result.isConfirmed) {
        const roleInfo = { role: "admin" };
        axiosSecure
          .patch(`/users/${user._id}/role`, roleInfo)
          .then((res) => {
            if (res.data.modifiedCount) {
              refetch();
              Swal.fire({
                position: "top-end",
                title: `${user.name} marked as Admin`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              });
            }
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              icon: "error",
              title: "Failed",
              text: err.response?.data?.message || err.message,
            });
          });
      }
    });
  };

  // REMOVE ADMIN
  const handleRemoveAdmin = (user) => {
    Swal.fire({
      title: "Remove Admin?",
      text: `${user.name} will become User again`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove Admin",
    }).then((result) => {
      if (result.isConfirmed) {
        const roleInfo = { role: "user" };
        axiosSecure
          .patch(`/users/${user._id}/role`, roleInfo)
          .then((res) => {
            if (res.data.modifiedCount) {
              refetch();
              Swal.fire({
                position: "top-end",
                title: `${user.name} removed from Admin`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              });
            }
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              icon: "error",
              title: "Failed",
              text: err.response?.data?.message || err.message,
            });
          });
      }
    });
  };

  // DELETE USER
  const handleDeleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "User will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/users/${id}/role`);
        if (res.data.deletedCount) {
          refetch();
          Swal.fire({
            icon: "success",
            title: "User Deleted",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
        Manage Users: {users.length}
      </h2>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <input
          type="search"
          placeholder="Search Users"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <svg
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.3-4.3"
          ></path>
        </svg>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800 transition-colors duration-300">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 border-b border-gray-300 dark:border-gray-600">
                #
              </th>
              <th className="px-4 py-3 border-b border-gray-300 dark:border-gray-600">
                Name
              </th>
              <th className="px-4 py-3 border-b border-gray-300 dark:border-gray-600">
                Email
              </th>
              <th className="px-4 py-3 border-b border-gray-300 dark:border-gray-600">
                Role
              </th>
              <th className="px-4 py-3 border-b border-gray-300 dark:border-gray-600">
                Admin Action
              </th>
              <th className="px-4 py-3 border-b border-gray-300 dark:border-gray-600">
                Delete
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {users.map((user, index) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img
                      src={user.photoURL}
                      alt="avatar"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="font-medium text-gray-800 dark:text-gray-100">
                    {user.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  {user.email}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${user.role === "admin" ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"}`}
                  >
                    {user.role || "user"}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  {user.role === "admin" ? (
                    <button
                      onClick={() => handleRemoveAdmin(user)}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-400 text-white rounded-lg transition"
                    >
                      <FiShieldOff />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMakeAdmin(user)}
                      className="px-3 py-1 bg-green-500 hover:bg-green-400 text-white rounded-lg transition"
                    >
                      <FaUserShield />
                    </button>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-400 text-white rounded-lg transition"
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
  );
};

export default UsersManagement;
