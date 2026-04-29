import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../../../firebase/firebase.init";

const SERVER = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState("profile");
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState({ name: "", email: "", bio: "" });
  const [artist, setArtist] = useState({ title: "", experience: "", image: "", imageFile: null });
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

  const getToken = async () => user ? await user.getIdToken() : null;

  // Fetch Profile
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const res = await fetch(`${SERVER}/profile`, { headers: { Authorization: `Bearer ${token}` } });
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

  // Auto clear message
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(t);
    }
  }, [message]);

  // Image preview
  useEffect(() => {
    if (!artist.imageFile) return setPreview("");
    const objectUrl = URL.createObjectURL(artist.imageFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [artist.imageFile]);

  // Fetch Users for Admin
  useEffect(() => {
    if (tab !== "admin" || role !== "admin") return;
    const fetchUsers = async () => {
      setUserLoading(true);
      try {
        const token = await getToken();
        const res = await fetch(`${SERVER}/users`, { headers: { Authorization: `Bearer ${token}` } });
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

  // Update Profile
  const updateProfile = async () => {
    setUpdating(true);
    try {
      const token = await getToken();
      const res = await fetch(`${SERVER}/users/update/${profile?._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      });
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

  // Update Artist
  const updateArtist = async () => {
    setUpdating(true);
    try {
      const token = await getToken();
      let imageURL = artist.image;
      if (artist.imageFile) {
        const formData = new FormData();
        formData.append("image", artist.imageFile);
        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`, formData);
        imageURL = res.data.data.url;
      }
      const updatedData = { ...artist, image: imageURL };
      delete updatedData.imageFile;
      const res = await fetch(`${SERVER}/artists/update/${artist?._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedData),
      });
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

  // Update Security
  const updatePasswordHandler = async () => {
    if (!user || !currentPassword || !newPassword) {
      setMessage("Please fill both fields");
      return;
    }
    setUpdating(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
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

  // Admin Delete User
  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`${SERVER}/users/delete/${userId}`, {
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

  if (loading) return <p className="text-center mt-20 text-xl text-gray-500 dark:text-gray-300">Loading...</p>;

  return (
    <div className="flex w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 space-y-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        <nav className="flex flex-col space-y-3">
          <button
            onClick={() => setTab("profile")}
            className={`px-4 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
              tab === "profile" ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setTab("security")}
            className={`px-4 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
              tab === "security" ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
            }`}
          >
            Security
          </button>
          {(role === "artist" || role === "admin") && (
            <button
              onClick={() => setTab("billing")}
              className={`px-4 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                tab === "billing" ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
              }`}
            >
              Billing
            </button>
          )}
          {role === "artist" && (
            <button
              onClick={() => setTab("artist")}
              className={`px-4 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                tab === "artist" ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
              }`}
            >
              Artist
            </button>
          )}
          {role === "admin" && (
            <button
              onClick={() => setTab("admin")}
              className={`px-4 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                tab === "admin" ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
              }`}
            >
              Admin
            </button>
          )}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10 space-y-6">
        {message && <p className="text-green-600 dark:text-green-400 font-medium">{message}</p>}

        {/* PROFILE */}
        {tab === "profile" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-4 transition-colors duration-300">
            <h3 className="text-2xl font-semibold">Profile</h3>
            <input
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Name"
            />
            <input
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-gray-100 dark:bg-gray-700 text-gray-500"
              value={profile.email || ""}
              disabled
            />
            <textarea
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Bio"
            />
            <button
              onClick={updateProfile}
              disabled={updating}
              className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
                updating ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {updating ? "Updating..." : "Update Profile"}
            </button>
          </div>
        )}

        {/* SECURITY */}
        {tab === "security" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-4 transition-colors duration-300">
            <h3 className="text-2xl font-semibold">Security Settings</h3>
            <input
              type="password"
              placeholder="Current Password"
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={updatePasswordHandler}
              disabled={updating}
              className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
                updating ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-500"
              }`}
            >
              {updating ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}

        {/* BILLING */}
        {tab === "billing" && (role === "admin" || role === "artist") && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-4 transition-colors duration-300">
            <h3 className="text-2xl font-semibold">Billing Information</h3>
            <p className="text-gray-600 dark:text-gray-300">Manage your payment methods and subscriptions here.</p>
            <input type="text" placeholder="Card Number" className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
            <input type="text" placeholder="Expiry Date" className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
            <input type="text" placeholder="CVV" className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
            <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition">Update Billing</button>
          </div>
        )}

        {/* ARTIST */}
        {tab === "artist" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-4 transition-colors duration-300">
            <h3 className="text-2xl font-semibold">Artist Profile</h3>
            <input
              placeholder="Title"
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              value={artist.title || ""}
              onChange={(e) => setArtist({ ...artist, title: e.target.value })}
            />
            <input
              placeholder="Experience"
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              value={artist.experience || ""}
              onChange={(e) => setArtist({ ...artist, experience: e.target.value })}
            />
            <input
              type="file"
              onChange={(e) => setArtist({ ...artist, imageFile: e.target.files[0] })}
              className="mb-3"
            />
            {preview ? (
              <img src={preview} className="w-32 h-32 object-cover rounded-lg mb-3" />
            ) : (
              artist.image && <img src={artist.image} className="w-32 h-32 object-cover rounded-lg mb-3" />
            )}
            <button
              onClick={updateArtist}
              disabled={updating}
              className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
                updating ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
              }`}
            >
              {updating ? "Updating..." : "Update Artist"}
            </button>
          </div>
        )}

        {/* ADMIN */}
        {tab === "admin" && role === "admin" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-4 transition-colors duration-300">
            <h3 className="text-2xl font-semibold">Users Management</h3>
            {userLoading ? (
              <p className="text-gray-500 dark:text-gray-300">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-300">No users found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                      <th className="border px-3 py-2 text-left">Name</th>
                      <th className="border px-3 py-2 text-left">Email</th>
                      <th className="border px-3 py-2 text-left">Role</th>
                      <th className="border px-3 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                        <td className="border px-3 py-2">{u.name}</td>
                        <td className="border px-3 py-2">{u.email}</td>
                        <td className="border px-3 py-2">{u.role}</td>
                        <td className="border px-3 py-2 space-x-2">
                          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition" onClick={() => alert("Edit functionality can be added")}>Edit</button>
                          <button className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg transition" onClick={() => deleteUser(u._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Settings;