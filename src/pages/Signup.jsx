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
    setUser
  } = useContext(AuthContext);

  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // password validation
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


  // ============================
  // Email Password Signup
  // ============================

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

      // image upload
      const formData = new FormData();
      formData.append("image", image);

      const image_API_URL =
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`;

      const imgRes = await axios.post(image_API_URL, formData);
      const photoURL = imgRes.data.data.url;

      // create firebase user
      const res = await createUserWithEmailAndPasswordFunc(email, password);

      // update profile
      await updateProfileFunc(name, photoURL);

      const user = res.user;

      // save user in database
      const userInfo = {
        email: user.email,
        name: name,
        photoURL: photoURL
      };

      const dbRes = await axiosSecure.post("/users", userInfo);

      if (dbRes.data.insertedId) {
        console.log("User saved in DB");
      }

      setUser(user);

      toast.success("Signup Successful 🎉");

      navigate("/");

    } catch (error) {

      toast.error(error.message || "Signup failed");

    } finally {

      setLoadingBtn(false);

    }

  };


  // ============================
  // Google Signup
  // ============================

  const handleGoogleSignup = async () => {

    setLoadingBtn(true);

    try {

      const res = await signInWithGoogleFunc();
      const user = res.user;

      const userInfo = {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL
      };

      // save user to DB
      const dbRes = await axiosSecure.post("/users", userInfo);

      if (dbRes.data.insertedId) {
        console.log("Google user saved");
      }

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

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <ToastContainer position="top-right" autoClose={3000} />

      <MyContainer>

        <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl p-8">

          <h2 className="text-2xl font-bold text-center mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">

            {/* Name */}

            <div>
              <label className="text-sm">Name</label>
              <input
                type="text"
                name="name"
                required
                className="input input-bordered w-full"
                placeholder="Artist Name"
              />
            </div>


            {/* Email */}

            <div>
              <label className="text-sm">Email</label>
              <input
                type="email"
                name="email"
                required
                className="input input-bordered w-full"
                placeholder="you@example.com"
              />
            </div>


            {/* Password */}

            <div className="relative">
              <label className="text-sm">Password</label>

              <input
                type={show ? "text" : "password"}
                name="password"
                required
                className="input input-bordered w-full pr-12"
                placeholder="••••••••"
              />

              <span
                onClick={() => setShow(!show)}
                className="absolute right-3 top-9 cursor-pointer"
              >
                {show ? <FaEye size={18} /> : <IoEyeOff size={18} />}
              </span>

            </div>


            {/* Photo */}

            <div>
              <label className="text-sm">Photo</label>
              <input
                type="file"
                name="photo"
                required
                className="file-input w-full"
              />
            </div>


            {/* Signup Button */}

            <button
              type="submit"
              disabled={loadingBtn}
              className={`w-full py-2 rounded-xl text-white font-semibold ${
                loadingBtn
                  ? "bg-gray-400"
                  : "bg-gray-800 hover:bg-gray-900"
              }`}
            >

              {loadingBtn ? "Processing..." : "Register"}

            </button>


            {/* Divider */}

            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-16 bg-gray-300"></div>
              <span className="text-sm text-gray-500">or</span>
              <div className="h-px w-16 bg-gray-300"></div>
            </div>


            {/* Google */}

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full border rounded-xl py-2 flex items-center justify-center gap-3"
            >

              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5"
              />

              Continue with Google

            </button>


            <p className="text-center text-sm">

              Already have an account?

              <Link
                to="/signin"
                className="text-blue-600 underline ml-1"
              >

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