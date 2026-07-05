import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ApproveArtists = () => {
  const axiosSecure = useAxiosSecure();
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const fetchArtists = () => {
    axiosSecure
      .get("/artists?status=pending")
      .then((res) => setArtists(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleApproval = (artist) => {
    axiosSecure
      .patch(`/artists/approve/${artist._id}`, { email: artist.email })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Approved",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchArtists();
      })
      .catch(() => Swal.fire("Error", "Approval failed", "error"));
  };

  const handleRejection = (artist) => {
    axiosSecure.patch(`/artists/reject/${artist._id}`).then(() => {
      Swal.fire({
        icon: "warning",
        title: "Rejected",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchArtists();
    });
  };

  const handleDeletion = (artist) => {
    Swal.fire({
      title: "Delete Artist?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/artists/${artist._id}`).then(() => {
          Swal.fire("Deleted!", "", "success");
          fetchArtists();
        });
      }
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Pending Artists ({artists.length})
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <table className="table w-full">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th>#</th>
              <th>Artist</th>
              <th>Email</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-700 dark:text-gray-300">
            {artists.map((artist, index) => (
              <tr
                key={artist._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                {/* Index */}
                <td>{index + 1}</td>

                {/* Artist Info */}
                <td className="flex items-center gap-3">
                  <img
                    src={artist.image || "/default-avatar.png"}
                    alt={artist.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <span className="font-medium">{artist.name}</span>
                </td>

                <td>{artist.email}</td>

                {/* Actions */}
                <td className="flex justify-center gap-2">
                  {/* View */}
                  <button
                    onClick={() => {
                      setSelectedArtist(artist);
                      document.getElementById("artist_modal").showModal();
                    }}
                    className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <FaSearch />
                  </button>

                  {/* Approve */}
                  <button
                    onClick={() => handleApproval(artist)}
                    className="btn btn-sm bg-green-500 hover:bg-green-600 text-white"
                  >
                    <FaCheckCircle />
                  </button>

                  {/* Reject */}
                  <button
                    onClick={() => handleRejection(artist)}
                    className="btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    <FaTimesCircle />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeletion(artist)}
                    className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {artists.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No pending artists
          </div>
        )}
      </div>

      {/* MODAL */}
      <dialog id="artist_modal" className="modal">
        <div className="modal-box max-w-4xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <h3 className="text-2xl font-bold text-center mb-6">
            Artist Profile
          </h3>

          {selectedArtist && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image */}
              <div className="flex justify-center">
                <img
                  src={selectedArtist.image}
                  alt={selectedArtist.name}
                  className="w-64 h-64 object-cover rounded-xl shadow-lg"
                />
              </div>

              {/* Info */}
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {selectedArtist.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedArtist.email}
                </p>
                <p>
                  <span className="font-semibold">Title:</span>{" "}
                  {selectedArtist.title}
                </p>
                <p>
                  <span className="font-semibold">Experience:</span>{" "}
                  {selectedArtist.experience} years
                </p>

                <p>
                  <span className="font-semibold">Portfolio:</span>{" "}
                  <a
                    href={`https://${selectedArtist.portfolio}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Visit Website
                  </a>
                </p>

                <div>
                  <span className="font-semibold">Bio:</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {selectedArtist.bio}
                  </p>
                </div>

                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span className="px-2 py-1 rounded bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-white text-xs">
                    {selectedArtist.status}
                  </span>
                </p>

                <p>
                  <span className="font-semibold">Joined:</span>{" "}
                  {new Date(selectedArtist.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn bg-gray-800 text-white hover:bg-gray-900">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ApproveArtists;
