import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyProfile = () => {
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await axiosSecure.get("/profile");
      const user = res.data.user || {};
      const artist = res.data.artist || {};
      const mergedProfile = { ...user, ...artist };

      setProfile(mergedProfile);

      setFormData({
        name: mergedProfile.name || "",
        bio: mergedProfile.bio || "",
        title: mergedProfile.title || "",
        portfolio: mergedProfile.portfolio || "",
        experience: mergedProfile.experience || "",
      });

      setPreview(mergedProfile.photoURL || "");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!imageFile) return;
    const objectUrl = URL.createObjectURL(imageFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      let updatedPhotoURL = profile.photoURL;

      if (imageFile) {
        const formDataImg = new FormData();
        formDataImg.append("image", imageFile);

        const res = await axiosSecure.post(
          `/upload/profile-image`,
          formDataImg,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        updatedPhotoURL = res.data.url;
      }

      const userUpdate = {
        name: formData.name,
        photoURL: updatedPhotoURL,
      };
      if (formData.bio) userUpdate.bio = formData.bio;

      await axiosSecure.patch(`/users/update/${profile._id}`, userUpdate);

      if (profile.role === "artist") {
        const artistUpdate = {};
        if (formData.title) artistUpdate.title = formData.title;
        if (formData.bio) artistUpdate.bio = formData.bio;
        if (formData.portfolio) artistUpdate.portfolio = formData.portfolio;
        if (formData.experience) artistUpdate.experience = formData.experience;

        await axiosSecure.patch(
          `/artists/update/${profile._id}`,
          artistUpdate
        );
      }

      Swal.fire({
        icon: "success",
        title: "Profile updated!",
        timer: 2000,
        showConfirmButton: false,
      });

      setEditing(false);
      setImageFile(null);
      fetchProfile();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Update failed" });
    }
  };

  if (!profile)
    return (
      <div className="text-center mt-10 text-gray-600 dark:text-gray-400">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen py-10 px-4 
      bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 
      dark:from-gray-900 dark:via-gray-950 dark:to-black">

      <div className="max-w-4xl mx-auto p-8 
        bg-white dark:bg-gray-900 
        rounded-2xl shadow-xl">

        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white text-center">
          👤 My Profile
        </h2>

        <div className="flex flex-col md:flex-row gap-10">

          {/* Avatar */}
          <div className="flex flex-col items-center">
            <img
              src={preview || "/default-avatar.png"}
              alt={profile.name}
              className="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-gray-300 dark:border-gray-700"
            />

            {editing && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="mt-4 text-sm text-gray-600 dark:text-gray-300"
              />
            )}

            <span className="mt-4 px-3 py-1 text-xs rounded-full 
              bg-indigo-100 text-indigo-600 
              dark:bg-indigo-900 dark:text-indigo-300 font-semibold">
              {profile.role?.toUpperCase()}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-5">

            {/* Name */}
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                Name
              </label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-1 dark:bg-gray-800 dark:text-white"
                />
              ) : (
                <p className="text-gray-800 dark:text-gray-200">
                  {profile.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                Email
              </label>
              <p className="text-gray-600 dark:text-gray-400">
                {profile.email}
              </p>
            </div>

            {/* Artist Fields */}
            {profile.role === "artist" && (
              <>
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    Title
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="input input-bordered w-full mt-1 dark:bg-gray-800 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200">
                      {profile.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    Experience
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="input input-bordered w-full mt-1 dark:bg-gray-800 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200">
                      {profile.experience} years
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    Portfolio
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      className="input input-bordered w-full mt-1 dark:bg-gray-800 dark:text-white"
                    />
                  ) : (
                    <a
                      href={profile.portfolio}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-500 hover:underline"
                    >
                      {profile.portfolio}
                    </a>
                  )}
                </div>
              </>
            )}

            {/* Bio */}
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                Bio
              </label>
              {editing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full mt-1 dark:bg-gray-800 dark:text-white"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Joined */}
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                Joined
              </label>
              <p className="text-gray-600 dark:text-gray-400">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              {editing ? (
                <>
                  <button onClick={handleUpdate} className="btn btn-success">
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;