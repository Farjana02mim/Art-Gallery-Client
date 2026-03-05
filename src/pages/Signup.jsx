import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyContainer from "../components/MyContainer";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";

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

  const validatePassword = (password) => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must include at least 1 uppercase letter.");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Password must include at least 1 lowercase letter.");
      return false;
    }
    if (!/\d/.test(password)) {
      toast.error("Password must include at least 1 number.");
      return false;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      toast.error("Password must include at least 1 special character.");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoadingBtn(true);

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const photoURL =
      e.target.photo.value.trim() || "https://i.pravatar.cc/150?img=3";

    if (!validatePassword(password)) {
      setLoadingBtn(false);
      return;
    }

    try {
      const res = await createUserWithEmailAndPasswordFunc(email, password);
      await updateProfileFunc(name, photoURL);
      setUser(res.user);
      toast.success("Signup successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Signup failed!");
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoadingBtn(true);
    try {
      const res = await signInWithGoogleFunc();
      setUser(res.user);
      toast.success("Signed in with Google!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Google sign-in failed!");
    } finally {
      setLoadingBtn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 relative overflow-hidden">

      <ToastContainer position="top-right" autoClose={3000} />

      {/* Decorative Blur */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-gray-300/40 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-gray-400/40 rounded-full blur-3xl bottom-10 right-10"></div>
      </div>

      <MyContainer>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 p-6 lg:p-10 text-gray-800">

          {/* Left Section */}
          <div className="max-w-lg text-center lg:text-left">
            <h1 className="text-5xl font-bold text-gray-800">
              Join the Art Gallery
            </h1>

            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Create your account to explore beautiful artworks and showcase your creativity to the world 🎨
            </p>
          </div>

          {/* Form Section */}
          <div className="w-full max-w-md backdrop-blur-xl bg-white/60 border border-white/40 shadow-2xl rounded-3xl p-8">

            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
              Create Account
            </h2>

            <form onSubmit={handleSignup} className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-sm mb-1 text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Artist Name"
                  className="input input-bordered w-full bg-white/80 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm mb-1 text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full bg-white/80 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm mb-1 text-gray-700">Password</label>

                <input
                  type={show ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full bg-white/80 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 pr-12"
                  required
                />

                <span
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                >
                  {show ? <FaEye size={20} /> : <IoEyeOff size={20} />}
                </span>

              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-sm mb-1 text-gray-700">Photo URL</label>

                <input
                  type="text"
                  name="photo"
                  placeholder="https://example.com/photo.jpg"
                  className="input input-bordered w-full bg-white/80 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loadingBtn}
                className={`w-full text-white py-2 rounded-xl font-semibold ${
                  loadingBtn
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-gray-900"
                }`}
              >
                {loadingBtn ? "Processing..." : "Register"}
              </button>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2 my-2">
                <div className="h-px w-16 bg-gray-300"></div>
                <span className="text-sm text-gray-600">or</span>
                <div className="h-px w-16 bg-gray-300"></div>
              </div>

              {/* Google Signup */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loadingBtn}
                className="flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-800 px-5 py-2 rounded-xl w-full font-semibold hover:bg-gray-50"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5"
                  alt="Google"
                />

                Continue with Google
              </button>

              <p className="text-center text-sm text-gray-700 mt-3">
                Already have an account?{" "}
                <Link to="/signin" className="text-gray-800 underline hover:text-black">
                  Login
                </Link>
              </p>

            </form>
          </div>
        </div>
      </MyContainer>
    </div>
  );
};

export default Signup;