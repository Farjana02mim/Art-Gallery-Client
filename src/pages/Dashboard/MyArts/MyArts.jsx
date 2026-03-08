import React, { useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";

const MyArts = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: arts = [], isLoading } = useQuery({
    queryKey: ["my-arts", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:3000/listing?email=${user.email}`
      );
      return res.json();
    },
  });

  // Delete Function
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
          const res = await fetch(
            `http://localhost:3000/listing/${id}`,
            { method: "DELETE" }
          );

          const data = await res.json();

          if (data.deletedCount > 0) {
            queryClient.invalidateQueries({
              queryKey: ["my-arts", user?.email],
            });

            Swal.fire(
              "Deleted!",
              "Your art has been deleted.",
              "success"
            );
          }
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error!",
            "Something went wrong.",
            "error"
          );
        }
      }
    });
  };

  if (isLoading) {
    return (
      <p className="text-center text-xl mt-10">
        Loading...
      </p>
    );
  }

  if (arts.length === 0) {
    return (
      <p className="text-center text-xl mt-10">
        No Art Found
      </p>
    );
  }

  return (
    <div className="w-11/12 mx-auto py-10">

      <h2 className="text-3xl font-bold mb-6 text-center">
        My Arts
      </h2>

      <div className="overflow-x-auto">

        <table className="table w-full">

          <thead className="bg-gray-200 text-gray-800">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Price</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {arts.map((art) => (

              <tr
                key={art._id}
                className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
              >

                <td>
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>

                <td className="font-semibold">
                  {art.title || art.name}
                </td>

                <td>{art.category}</td>

                <td>{art.location}</td>

                <td className="text-green-600 font-bold">
                  ${art.price}
                </td>

                <td className="text-center">

                  <div className="flex justify-center items-center gap-4">

                    {/* Edit Icon */}
                    <Link
                      to={`/dashboard/update-art/${art._id}`}
                      className="text-blue-600 text-lg hover:scale-110 hover:text-blue-800 transition"
                    >
                      <FaEdit />
                    </Link>

                    {/* Delete Icon */}
                    <button
                      onClick={() => handleDelete(art._id)}
                      className="text-red-600 text-lg hover:scale-110 hover:text-red-800 transition"
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