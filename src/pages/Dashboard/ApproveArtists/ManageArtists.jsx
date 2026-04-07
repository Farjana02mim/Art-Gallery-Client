import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageArtists = () => {
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
      <div className="text-center mt-10 text-xl font-semibold text-gray-700">
        Loading Artists...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-900">
        Manage Artists
      </h2>

      {artists.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No artists found.
        </p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <div
              key={artist._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              {/* Artist Image */}
              <div className="h-56 w-full overflow-hidden">
                <img
                  src={artist.image || "/default-avatar.png"}
                  alt={artist.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Artist Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1 text-gray-800">
                    {artist.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{artist.email}</p>

                  <div className="space-y-1 text-gray-700 text-sm">
                    <p>
                      <span className="font-semibold">Title:</span> {artist.title}
                    </p>
                    <p>
                      <span className="font-semibold">Experience:</span>{" "}
                      {artist.experience || "-"} years
                    </p>
                    <p>
                      <span className="font-semibold">Portfolio:</span>{" "}
                      {artist.portfolio ? (
                        <a
                          href={artist.portfolio}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </p>
                  </div>

                  {artist.bio && (
                    <p className="mt-3 text-gray-600 text-sm line-clamp-3">
                      {artist.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageArtists;