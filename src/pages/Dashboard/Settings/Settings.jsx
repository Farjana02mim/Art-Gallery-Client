import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const Settings = () => {
  const { user, token } = useContext(AuthContext); // assume token is stored here for FB auth
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
  });
  const [artist, setArtist] = useState({
    title: "",
    experience: "",
    portfolio: "",
    bio: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch profile from backend
  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:3000/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile({ ...profile, ...data.user });
        if (data.artist) setArtist(data.artist);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  const handleUserUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/users/update/${profile._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        }
      );
      const data = await res.json();
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  const handleArtistUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/artists/update/${artist._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(artist),
        }
      );
      const data = await res.json();
      setMessage("Artist profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update artist profile.");
    }
  };

  if (loading) return <p className="text-center mt-10 text-xl">Loading...</p>;

  return (
    <div className="w-11/12 mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Settings</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      {/* User Profile */}
      <div className="mb-8 p-6 border rounded-lg bg-white shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Profile Settings</h3>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="email"
            value={profile.email}
            disabled
            className="border p-2 rounded bg-gray-100 cursor-not-allowed"
          />
          <textarea
            placeholder="Bio"
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            onClick={handleUserUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update Profile
          </button>
        </div>
      </div>

      {/* Artist Profile */}
      {user?.role === "artist" && (
        <div className="mb-8 p-6 border rounded-lg bg-white shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Artist Profile</h3>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Title"
              value={artist.title || ""}
              onChange={(e) => setArtist({ ...artist, title: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Experience"
              value={artist.experience || ""}
              onChange={(e) =>
                setArtist({ ...artist, experience: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Portfolio Link"
              value={artist.portfolio || ""}
              onChange={(e) =>
                setArtist({ ...artist, portfolio: e.target.value })
              }
              className="border p-2 rounded"
            />
            <textarea
              placeholder="Bio"
              value={artist.bio || ""}
              onChange={(e) => setArtist({ ...artist, bio: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={artist.image || ""}
              onChange={(e) => setArtist({ ...artist, image: e.target.value })}
              className="border p-2 rounded"
            />
            <button
              onClick={handleArtistUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Update Artist Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;