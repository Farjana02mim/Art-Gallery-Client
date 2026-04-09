import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MyContainer from "../components/MyContainer";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const {
    createUserWithEmailAndPasswordFunc,
    updateProfileFunc,
    signInWithGoogleFunc,
    setUser,
  } = useContext(AuthContext);

  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const validatePassword = (password) => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Must contain 1 uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Must contain 1 lowercase letter");
      return false;
    }
    if (!/\d/.test(password)) {
      toast.error("Must contain 1 number");
      return false;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      toast.error("Must contain 1 special character");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoadingBtn(true);

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const image = form.photo.files[0];

    if (!validatePassword(password)) {
      setLoadingBtn(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`;
      const imgRes = await axios.post(image_API_URL, formData);
      const photoURL = imgRes.data.data.url;

      const res = await createUserWithEmailAndPasswordFunc(email, password);
      await updateProfileFunc(name, photoURL);
      const user = res.user;

      const userInfo = { email: user.email, name, photoURL };
      const dbRes = await axiosSecure.post("/users", userInfo);
      if (dbRes.data.insertedId) console.log("User saved in DB");

      setUser(user);
      toast.success("Signup Successful 🎉");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Signup failed");
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoadingBtn(true);
    try {
      const res = await signInWithGoogleFunc();
      const user = res.user;
      const userInfo = {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
      };
      const dbRes = await axiosSecure.post("/users", userInfo);
      if (dbRes.data.insertedId) console.log("Google user saved");

      setUser(user);
      toast.success("Signed in with Google");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingBtn(false);
    }
  };

  return (
    <div className="min-h-screen p-5 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
      <ToastContainer position="top-right" autoClose={3000} />
      <MyContainer>
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-10 transition-colors">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-8">
            Create Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Artist Name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Password
              </label>
              <input
                type={show ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <span
                onClick={() => setShow(!show)}
                className="absolute right-3 pt-6 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition"
              >
                {show ? <FaEye size={20} /> : <IoEyeOff size={20} />}
              </span>
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Photo
              </label>
              <input
                type="file"
                name="photo"
                required
                className="w-full text-gray-800 dark:text-gray-100 file:border-0 file:bg-blue-100 dark:file:bg-blue-700 file:px-3 file:py-2 file:rounded-lg file:font-medium file:text-blue-700 dark:file:text-blue-100 cursor-pointer transition"
              />
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loadingBtn}
              className={`w-full py-3 rounded-xl font-semibold text-white transition ${
                loadingBtn
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              }`}
            >
              {loadingBtn ? "Processing..." : "Register"}
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 my-2">
              <div className="h-px w-16 bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
              <div className="h-px w-16 bg-gray-300 dark:bg-gray-600"></div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 flex items-center justify-center gap-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5"
                alt="Google"
              />
              Continue with Google
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              Already have an account?
              <Link to="/signin" className="text-blue-600 dark:text-blue-400 underline ml-1">
                Login
              </Link>
            </p>
          </form>
        </div>
      </MyContainer>
    </div>
  );
};

export default Signup;