import React, { useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyArts = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: arts = [], isLoading } = useQuery({
    queryKey: ["my-arts", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-arts?email=${user.email}`);
      return res.data;
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/listing/${id}`);
          if (res.data.deletedCount > 0) {
            queryClient.invalidateQueries({
              queryKey: ["my-arts", user?.email],
            });
            Swal.fire("Deleted!", "Your art has been deleted.", "success");
          }
        } catch (error) {
          console.error(error);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  if (isLoading)
    return <p className="text-center text-xl mt-10 text-gray-700 dark:text-gray-300">Loading...</p>;

  if (arts.length === 0)
    return <p className="text-center text-xl mt-10 text-gray-700 dark:text-gray-300">No Art Found</p>;

  return (
    <div className="w-11/12 mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">My Arts</h2>

      <div className="overflow-x-auto bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-lg">
        <table className="table w-full border-collapse">
          <thead className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {arts.map((art) => (
              <tr
                key={art._id}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <td className="px-4 py-3">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{art.title || art.name}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{art.category}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{art.location}</td>
                <td className="px-4 py-3 text-green-600 dark:text-green-400 font-bold">${art.price}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <Link
                      to={`/dashboard/update-art/${art._id}`}
                      className="text-blue-600 dark:text-blue-400 text-lg hover:scale-110 hover:text-blue-800 dark:hover:text-blue-200 transition"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(art._id)}
                      className="text-red-600 dark:text-red-400 text-lg hover:scale-110 hover:text-red-800 dark:hover:text-red-200 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyArts;