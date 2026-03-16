import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyProfile = () => {
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    portfolio: "",
    experience: "",
  });

  // fetch profile
  const fetchProfile = async () => {
    try {
      const res = await axiosSecure.get("/profile");

      const user = res.data.user;
      const artist = res.data.artist;

      const mergedProfile = {
        ...user,
        ...artist,
      };

      setProfile(mergedProfile);

      setFormData({
        name: user?.name || "",
        title: artist?.title || "",
        bio: artist?.bio || "",
        portfolio: artist?.portfolio || "",
        experience: artist?.experience || "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // update profile
  const handleUpdate = async () => {
    try {
      await axiosSecure.patch(`/users/update/${profile._id}`, {
        name: formData.name,
        bio: formData.bio,
      });

      if (profile.role === "artist") {
        await axiosSecure.patch(`/artists/update/${profile._id}`, {
          title: formData.title,
          bio: formData.bio,
          portfolio: formData.portfolio,
          experience: formData.experience,
        });
      }

      Swal.fire({
        icon: "success",
        title: "Profile updated!",
        timer: 2000,
        showConfirmButton: false,
      });

      setEditing(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Update failed",
      });
    }
  };

  if (!profile) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-6">My Profile</h2>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src={profile?.photoURL || "/default-avatar.png"}
            alt={profile?.name}
            className="w-40 h-40 rounded-full object-cover shadow"
          />

          <span className="mt-3 text-sm text-gray-500 font-semibold">
            {profile?.role?.toUpperCase()}
          </span>
        </div>

        {/* Profile info */}
        <div className="flex-1 space-y-4">

          {/* Name */}
          <div>
            <span className="font-semibold">Name: </span>

            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full mt-1"
              />
            ) : (
              <span>{profile?.name}</span>
            )}
          </div>

          {/* Email */}
          <div>
            <span className="font-semibold">Email: </span>
            <span>{profile?.email}</span>
          </div>

          {/* Title (artist only) */}
          {profile?.role === "artist" && (
            <div>
              <span className="font-semibold">Title: </span>

              {editing ? (
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-1"
                />
              ) : (
                <span>{profile?.title || "-"}</span>
              )}
            </div>
          )}

          {/* Experience */}
          {profile?.role === "artist" && (
            <div>
              <span className="font-semibold">Experience: </span>

              {editing ? (
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-1"
                />
              ) : (
                <span>{profile?.experience || "0"} years</span>
              )}
            </div>
          )}

          {/* Portfolio */}
          {profile?.role === "artist" && (
            <div>
              <span className="font-semibold">Portfolio: </span>

              {editing ? (
                <input
                  type="text"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-1"
                />
              ) : (
                <a
                  href={profile?.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  {profile?.portfolio || "-"}
                </a>
              )}
            </div>
          )}

          {/* Bio */}
          <div>
            <span className="font-semibold">Bio: </span>

            {editing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="textarea textarea-bordered w-full mt-1"
              />
            ) : (
              <p className="text-gray-600">{profile?.bio || "-"}</p>
            )}
          </div>

          {/* Joined */}
          <div>
            <span className="font-semibold">Joined: </span>
            <span>
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : "-"}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">

            {editing ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="btn btn-success"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditing(false)}
                  className="btn btn-warning"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <FaEdit />
                Edit Profile
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;