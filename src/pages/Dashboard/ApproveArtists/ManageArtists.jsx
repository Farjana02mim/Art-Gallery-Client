import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaTrash, FaEye } from "react-icons/fa";

const ManageArtists = () => {
  const axiosSecure = useAxiosSecure();

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/artists?status=approved");
      setArtists(res.data || []);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed to load artists" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleDelete = (artist) => {
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

  if (loading)
    return (
      <div className="text-center mt-10 text-xl font-semibold text-gray-700 dark:text-gray-300">
        Loading Artists...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
          Manage Artists
        </h2>

        <span className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-white text-sm font-medium">
          Total: {artists.length}
        </span>
      </div>

      {/* Empty */}
      {artists.length === 0 ? (
        <p className="text-center text-gray-500 text-lg dark:text-gray-400">
          No artists found.
        </p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <div
              key={artist._id}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={artist.image || "/default-avatar.png"}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setSelectedArtist(artist);
                      document.getElementById("artist_modal").showModal();
                    }}
                    className="bg-white p-3 rounded-full text-gray-800 hover:bg-gray-200"
                  >
                    <FaEye />
                  </button>

                  <button
                    onClick={() => handleDelete(artist)}
                    className="bg-red-500 p-3 rounded-full text-white hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {artist.name}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {artist.email}
                  </p>

                  <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <p><span className="font-semibold">Title:</span> {artist.title}</p>
                    <p><span className="font-semibold">Experience:</span> {artist.experience || "-"} years</p>
                  </div>

                  {artist.bio && (
                    <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      {artist.bio}
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-between items-center">
                  <a
                    href={artist.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  >
                    Portfolio →
                  </a>

                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-700 dark:text-white">
                    Approved
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <dialog id="artist_modal" className="modal">
        <div className="modal-box max-w-4xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">

          <h3 className="text-2xl font-bold text-center mb-6">
            Artist Details
          </h3>

          {selectedArtist && (
            <div className="grid md:grid-cols-2 gap-8">

              <img
                src={selectedArtist.image}
                alt={selectedArtist.name}
                className="w-full h-64 object-cover rounded-xl shadow"
              />

              <div className="space-y-3 text-sm">
                <p><strong>Name:</strong> {selectedArtist.name}</p>
                <p><strong>Email:</strong> {selectedArtist.email}</p>
                <p><strong>Title:</strong> {selectedArtist.title}</p>
                <p><strong>Experience:</strong> {selectedArtist.experience} years</p>

                <p>
                  <strong>Portfolio:</strong>{" "}
                  <a
                    href={selectedArtist.portfolio}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    Visit
                  </a>
                </p>

                <p className="text-gray-600 dark:text-gray-400">
                  {selectedArtist.bio}
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

export default ManageArtists;