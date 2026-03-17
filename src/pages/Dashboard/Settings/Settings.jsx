import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../../../firebase/firebase.init";

const Settings = () => {
  const { user } = useContext(AuthContext);

  const [tab, setTab] = useState("profile");
  const [role, setRole] = useState("");

  const [profile, setProfile] = useState({ name: "", email: "", bio: "" });
  const [artist, setArtist] = useState({
    title: "",
    experience: "",
    image: "",
    imageFile: null,
  });

  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Admin Users
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

  const getToken = async () => {
    if (!user) return null;
    return await user.getIdToken();
  };

  // =========================
  // Fetch Profile
  // =========================
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:3000/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          setMessage("Unauthorized! Please login again.");
          return;
        }

        const data = await res.json();
        setProfile(data.user || {});
        setArtist(data.artist || {});
        setRole(data.user?.role || "");
      } catch (err) {
        console.error(err);
        setMessage("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // =========================
  // Auto clear message
  // =========================
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(t);
    }
  }, [message]);

  // =========================
  // Image preview cleanup
  // =========================
  useEffect(() => {
    if (!artist.imageFile) return setPreview("");
    const objectUrl = URL.createObjectURL(artist.imageFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [artist.imageFile]);

  // =========================
  // Fetch Users for Admin
  // =========================
  useEffect(() => {
    if (tab !== "admin") return;
    if (role !== "admin") return;

    const fetchUsers = async () => {
      setUserLoading(true);
      try {
        const token = await getToken();
        const res = await fetch("http://localhost:3000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load users");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUsers();
  }, [tab, role]);

  // =========================
  // Update Profile
  // =========================
  const updateProfile = async () => {
    setUpdating(true);
    try {
      const token = await getToken();
      const res = await fetch(
        `http://localhost:3000/users/update/${profile?._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        }
      );

      if (!res.ok) {
        const errMsg = await res.text();
        setMessage(`Error: ${errMsg}`);
        return;
      }

      setMessage("Profile updated!");
    } catch (err) {
      console.error(err);
      setMessage("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // Update Artist
  // =========================
  const updateArtist = async () => {
    setUpdating(true);
    try {
      const token = await getToken();
      let imageURL = artist.image;

      if (artist.imageFile) {
        const formData = new FormData();
        formData.append("image", artist.imageFile);

        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`,
          formData
        );

        imageURL = res.data.data.url;
      }

      const updatedData = { ...artist, image: imageURL };
      delete updatedData.imageFile;

      const res = await fetch(
        `http://localhost:3000/artists/update/${artist?._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!res.ok) {
        const errMsg = await res.text();
        setMessage(`Error: ${errMsg}`);
        return;
      }

      setMessage("Artist updated!");
    } catch (err) {
      console.error(err);
      setMessage("Artist update failed");
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // Update Security (Password)
  // =========================
  const updatePasswordHandler = async () => {
    if (!user) return;
    if (!currentPassword || !newPassword) {
      setMessage("Please fill both fields");
      return;
    }

    setUpdating(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Password update failed");
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // Admin: Delete User
  // =========================
  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:3000/users/delete/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((u) => u._id !== userId));
      setMessage("User deleted!");
    } catch (err) {
      console.error(err);
      setMessage("Delete failed");
    }
  };

  if (loading) return <p className="text-center mt-10 text-xl">Loading...</p>;

  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 text-black p-5 space-y-4">
        <h2 className="text-xl font-bold">Settings</h2>
        <br />
        <button onClick={() => setTab("profile")}>Profile</button>
        <br />
        <button onClick={() => setTab("security")}>Security</button>
        <br />
        <button onClick={() => setTab("billing")}>Billing</button>
        <br />
        {role === "artist" && (
          <button onClick={() => setTab("artist")}>Artist</button>
        )}
        {role === "admin" && <button onClick={() => setTab("admin")}>Admin</button>}
      </div>

      {/* Content */}
      <div className="flex-1 p-10 bg-gray-100">
        {message && <p className="text-green-600 mb-4">{message}</p>}

        {/* PROFILE */}
        {tab === "profile" && (
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl mb-4">Profile</h3>
            <input
              className="border p-2 w-full mb-3"
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Name"
            />
            <input
              className="border p-2 w-full mb-3 bg-gray-100"
              value={profile.email || ""}
              disabled
            />
            <textarea
              className="border p-2 w-full mb-3"
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Bio"
            />
            <button
              onClick={updateProfile}
              className={`px-4 py-2 rounded text-white ${
                updating ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"
              }`}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update"}
            </button>
          </div>
        )}

        {/* SECURITY */}
        {tab === "security" && (
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl mb-4">Security Settings</h3>
            <input
              type="password"
              placeholder="Current Password"
              className="border p-2 w-full mb-3"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="border p-2 w-full mb-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={updatePasswordHandler}
              className={`px-4 py-2 rounded text-white ${
                updating ? "bg-gray-500 cursor-not-allowed" : "bg-red-500"
              }`}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}

        {/* BILLING */}
        {tab === "billing" && (
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl mb-4">Billing Information</h3>
            <p>Manage your payment methods and subscriptions here.</p>
            <input
              type="text"
              placeholder="Card Number"
              className="border p-2 w-full mb-3"
            />
            <input
              type="text"
              placeholder="Expiry Date"
              className="border p-2 w-full mb-3"
            />
            <input
              type="text"
              placeholder="CVV"
              className="border p-2 w-full mb-3"
            />
            <button className="px-4 py-2 bg-green-500 text-white rounded">
              Update Billing
            </button>
          </div>
        )}

        {/* ARTIST */}
        {tab === "artist" && (
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl mb-4">Artist Profile</h3>
            <input
              className="border p-2 w-full mb-3"
              placeholder="Title"
              value={artist.title || ""}
              onChange={(e) => setArtist({ ...artist, title: e.target.value })}
            />
            <input
              className="border p-2 w-full mb-3"
              placeholder="Experience"
              value={artist.experience || ""}
              onChange={(e) =>
                setArtist({ ...artist, experience: e.target.value })
              }
            />
            <input
              type="file"
              onChange={(e) =>
                setArtist({ ...artist, imageFile: e.target.files[0] })
              }
              className="mb-3"
            />
            {preview ? (
              <img src={preview} className="w-24 mb-3" />
            ) : (
              artist.image && <img src={artist.image} className="w-24 mb-3" />
            )}
            <button
              onClick={updateArtist}
              className={`px-4 py-2 rounded text-white ${
                updating ? "bg-gray-500 cursor-not-allowed" : "bg-green-500"
              }`}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Artist"}
            </button>
          </div>
        )}

        {/* ADMIN */}
        {tab === "admin" && role === "admin" && (
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl mb-4">Users Management</h3>
            {userLoading ? (
              <p>Loading users...</p>
            ) : users.length === 0 ? (
              <p>No users found</p>
            ) : (
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-2 py-1">Name</th>
                    <th className="border px-2 py-1">Email</th>
                    <th className="border px-2 py-1">Role</th>
                    <th className="border px-2 py-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="border px-2 py-1">{u.name}</td>
                      <td className="border px-2 py-1">{u.email}</td>
                      <td className="border px-2 py-1">{u.role}</td>
                      <td className="border px-2 py-1 space-x-2">
                        <button
                          onClick={() => alert("Edit functionality can be added")}
                          className="px-2 py-1 bg-blue-500 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;