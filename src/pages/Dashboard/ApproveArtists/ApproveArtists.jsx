import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";

const ApproveArtists = () => {
  const [artists, setArtists] = useState([]);

  // Fetch pending artists
  const fetchArtists = () => {
    axios
      .get("http://localhost:3000/artists?status=pending")
      .then((res) => setArtists(res.data))
      .catch((err) => console.error("Failed to fetch artists:", err));
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  // Approve artist
const handleApproval = (artist) => {
  axios
    .patch(`http://localhost:3000/artists/approve/${artist._id}`, {
      email: artist.email,
    })
    .then((res) => {
      Swal.fire({
        position: "top-end",
        title: "Artist approved successfully ✅",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchArtists();
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Approval failed",
        text: err.response?.data?.message || err.message,
      });
    });
};

  // Reject artist
  const handleRejection = (artist) => {
    axios
      .patch(`http://localhost:3000/artists/reject/${artist._id}`)
      .then((res) => {
        Swal.fire({
          position: "top-end",
          title: "Artist rejected ❌",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchArtists();
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Rejection failed",
          text: err.response?.data?.message || err.message,
        });
      });
  };

  // Delete artist
  const handleDeletion = (artist) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/artists/${artist._id}`)
          .then((res) => {
            Swal.fire("Deleted!", "Artist has been deleted.", "success");
            fetchArtists();
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("Error", "Failed to delete artist", "error");
          });
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
              <th>Artist Name</th>
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
                <td className="flex gap-3">
                  <button
                    onClick={() => handleApproval(artist)}
                    className="btn btn-success btn-sm hover:bg-green-700 transition-colors"
                    title="Approve"
                  >
                    <FaCheckCircle />
                  </button>

                  <button
                    onClick={() => handleRejection(artist)}
                    className="btn btn-warning btn-sm hover:bg-yellow-600 transition-colors"
                    title="Reject"
                  >
                    <FaTimesCircle />
                  </button>

                  <button
                    onClick={() => handleDeletion(artist)}
                    className="btn btn-error btn-sm hover:bg-red-700 transition-colors"
                    title="Delete"
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

export default ApproveArtists;