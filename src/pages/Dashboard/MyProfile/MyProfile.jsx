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

  // fetch profile
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

  // Image preview
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

      // update user
      const userUpdate = { name: formData.name, photoURL: updatedPhotoURL };
      if (formData.bio) userUpdate.bio = formData.bio;
      await axiosSecure.patch(`/users/update/${profile._id}`, userUpdate);

      // update artist if role=artist
      if (profile.role === "artist") {
        const artistUpdate = {};
        if (formData.title) artistUpdate.title = formData.title;
        if (formData.bio) artistUpdate.bio = formData.bio;
        if (formData.portfolio) artistUpdate.portfolio = formData.portfolio;
        if (formData.experience) artistUpdate.experience = formData.experience;

        await axiosSecure.patch(`/artists/update/${profile._id}`, artistUpdate);
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
    return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-6">My Profile</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src={preview || "/default-avatar.png"}
            alt={profile.name}
            className="w-40 h-40 rounded-full object-cover shadow"
          />

          {editing && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="mt-3"
            />
          )}

          <span className="mt-3 text-sm text-gray-500 font-semibold">
            {profile.role?.toUpperCase()}
          </span>
        </div>

        {/* Profile info */}
        <div className="flex-1 space-y-4">
          {profile.name && (
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
                <span>{profile.name}</span>
              )}
            </div>
          )}

          {profile.email && (
            <div>
              <span className="font-semibold">Email: </span>
              <span>{profile.email}</span>
            </div>
          )}

          {/* Artist-only fields */}
          {profile.role === "artist" && profile.title && (
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
                <span>{profile.title}</span>
              )}
            </div>
          )}

          {profile.role === "artist" && profile.experience && (
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
                <span>{profile.experience} years</span>
              )}
            </div>
          )}

          {profile.role === "artist" && profile.portfolio && (
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
                  href={profile.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  {profile.portfolio}
                </a>
              )}
            </div>
          )}

          {profile.bio && (
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
                <p className="text-gray-600">{profile.bio}</p>
              )}
            </div>
          )}

          {profile.created_at && (
            <div>
              <span className="font-semibold">Joined: </span>
              <span>
                {new Date(profile.created_at).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {editing ? (
              <>
                <button onClick={handleUpdate} className="btn btn-success">
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
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;