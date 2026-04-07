import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MyContainer from "../components/MyContainer";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [show, setShow] = useState(false);
  const { 
    signInWithEmailAndPasswordFunc, 
    signInWithGoogleFunc, 
    setUser, 
    user,
    sendPassResetEmailFunc
  } = useContext(AuthContext);

  const emailRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  // Email Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setLoading(true);

    try {
      const res = await signInWithEmailAndPasswordFunc(email, password);
      setUser(res.user);
      toast.success("Login successful!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await signInWithGoogleFunc();
      setUser(res.user);
      toast.success("Logged in with Google!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password
  const handleForgotPassword = async () => {
    const email = emailRef.current.value;
    if (!email) {
      toast.error("Please enter your email first!");
      return;
    }

    try {
      await sendPassResetEmailFunc(email);
      toast.success("Password reset email sent!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-300 relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Decorative Blurs */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-gray-300/30 dark:bg-gray-700/30 rounded-full blur-3xl top-10 left-10 animate-pulse-slow"></div>
        <div className="absolute w-96 h-96 bg-gray-400/30 dark:bg-gray-600/30 rounded-full blur-3xl bottom-10 right-10 animate-pulse-slow"></div>
      </div>

      <MyContainer>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 p-6 lg:p-10">

          {/* Left Side Text */}
          <div className="max-w-lg text-center lg:text-left">
            <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100">
              Art Gallery
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Discover beautiful artworks from talented artists around the world.
              Login to explore the gallery and showcase your creativity 🎨
            </p>
          </div>

          {/* Login Form */}
          <div className="w-full max-w-md backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/30 dark:border-gray-600/30 shadow-2xl rounded-3xl p-8 transition-colors duration-300">
            <form onSubmit={handleEmailLogin} className="space-y-5">

              <h2 className="text-2xl font-semibold mb-3 text-center text-gray-800 dark:text-gray-100">
                Login
              </h2>

              {/* Email */}
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  ref={emailRef}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Password</label>
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 transition"
                  required
                />
                <span
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-300"
                >
                  {show ? <FaEye size={20} /> : <IoEyeOff size={20} />}
                </span>
              </div>

              {/* Forgot Password */}
              <div className="text-right mt-1">
                <span
                  onClick={handleForgotPassword}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:underline cursor-pointer transition-colors duration-200"
                >
                  Forgot Password?
                </span>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2 my-2">
                <div className="h-px w-16 bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">or</span>
                <div className="h-px w-16 bg-gray-300 dark:bg-gray-600"></div>
              </div>

              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 px-5 py-2 rounded-xl w-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5"
                  alt="Google"
                />
                Continue with Google
              </button>

              {/* Signup */}
              <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-3">
                Don’t have an account?{" "}
                <Link
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  to="/signup"
                >
                  Register here
                </Link>
              </p>

            </form>
          </div>

        </div>
      </MyContainer>
    </div>
  );
};

export default Login;