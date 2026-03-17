import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageArts = () => {
  const axiosSecure = useAxiosSecure();

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/artists?status=approved");
      setArtists(res.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Failed to load artists" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-10 text-xl font-semibold">
        Loading Artists...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Manage Artists</h2>

      {artists.length === 0 ? (
        <p className="text-center text-gray-500">No artists found.</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <div
              key={artist._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
            >
              {/* Artist Image */}
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={artist.image || "/default-avatar.png"}
                  alt={artist.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Artist Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{artist.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{artist.email}</p>
                  <p className="text-sm">
                    <span className="font-medium">Title:</span> {artist.title}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Experience:</span>{" "}
                    {artist.experience || "-"} years
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Portfolio:</span>{" "}
                    {artist.portfolio ? (
                      <a
                        href={artist.portfolio}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 underline"
                      >
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">{artist.bio || "-"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageArts;