import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle, FaTrash, FaSearch } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ApproveArtists = () => {
  const axiosSecure = useAxiosSecure();
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);

  // Fetch pending artists
  const fetchArtists = () => {
    axiosSecure
      .get("/artists?status=pending")
      .then((res) => setArtists(res.data))
      .catch((err) => console.error("Fetch error:", err.response?.data || err));
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  // Approve artist
  const handleApproval = (artist) => {
    axiosSecure
      .patch(`/artists/approve/${artist._id}`, { email: artist.email })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Artist Approved",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchArtists();
      })
      .catch((err) => {
        console.error("Approval error:", err.response?.data || err);
        Swal.fire({
          icon: "error",
          title: "Approval Failed",
          text: err.response?.data?.message || "Unauthorized",
        });
      });
  };

  // Reject artist
  const handleRejection = (artist) => {
    axiosSecure
      .patch(`/artists/reject/${artist._id}`)
      .then(() => {
        Swal.fire({
          icon: "warning",
          title: "Artist Rejected",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchArtists();
      })
      .catch((err) => console.error("Rejection error:", err.response?.data || err));
  };

  // Delete artist
  const handleDeletion = (artist) => {
    Swal.fire({
      title: "Delete Artist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/artists/${artist._id}`)
          .then(() => {
            Swal.fire("Deleted!", "", "success");
            fetchArtists();
          })
          .catch((err) => console.error("Deletion error:", err.response?.data || err));
      }
    });
  };

  return (
    <div>
      <h2 className="text-4xl font-bold mb-6">
        Artists Pending Approval: {artists.length}
      </h2>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="text-black">
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist, index) => (
              <tr key={artist._id}>
                <td>{index + 1}</td>
                <td>{artist.name}</td>
                <td>{artist.email}</td>
                <td className="flex gap-2">
                  {/* View Details */}
                  <button
                    onClick={() => {
                      setSelectedArtist(artist);
                      document.getElementById("artist_modal").showModal();
                    }}
                    className="btn btn-info btn-sm"
                  >
                    <FaSearch />
                  </button>

                  {/* Approve */}
                  <button
                    onClick={() => handleApproval(artist)}
                    className="btn btn-success btn-sm"
                  >
                    <FaCheckCircle />
                  </button>

                  {/* Reject */}
                  <button
                    onClick={() => handleRejection(artist)}
                    className="btn btn-warning btn-sm"
                  >
                    <FaTimesCircle />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeletion(artist)}
                    className="btn btn-error btn-sm"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Artist Details Modal */}
      <dialog id="artist_modal" className="modal">
        <div className="modal-box max-w-3xl">
          <h3 className="font-bold text-2xl text-center mb-6">Artist Profile</h3>

          {selectedArtist && (
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* Left: Artist Image */}
              <div className="flex justify-center">
                <img
                  src={selectedArtist.image}
                  alt={selectedArtist.name}
                  className="w-60 h-60 object-cover rounded-xl shadow-lg border"
                />
              </div>

              {/* Right: Artist Info */}
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold">Name:</span> {selectedArtist.name}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> {selectedArtist.email}
                </div>
                <div>
                  <span className="font-semibold">Title:</span> {selectedArtist.title}
                </div>
                <div>
                  <span className="font-semibold">Experience:</span>{" "}
                  {selectedArtist.experience} Years
                </div>
                <div>
                  <span className="font-semibold">Portfolio:</span>{" "}
                  <a
                    href={`https://${selectedArtist.portfolio}`}
                    target="_blank"
                    className="text-blue-500 underline"
                  >
                    Visit Website
                  </a>
                </div>
                <div>
                  <span className="font-semibold">Bio:</span>
                  <p className="text-gray-600 mt-1">{selectedArtist.bio}</p>
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  <span className="badge badge-warning">{selectedArtist.status}</span>
                </div>
                <div>
                  <span className="font-semibold">Joined:</span>{" "}
                  {new Date(selectedArtist.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ApproveArtists;