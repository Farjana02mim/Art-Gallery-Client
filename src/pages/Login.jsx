import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MyContainer from "../components/MyContainer";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(""); // ✅ FIX: controlled email state

  const {
    signInWithEmailAndPasswordFunc,
    signInWithGoogleFunc,
    setUser,
    user,
    sendPassResetEmailFunc,
  } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  // ERROR HANDLER
  const getAuthError = (code) => {
    switch (code) {
      case "auth/user-not-found":
        return "No account found with this email";
      case "auth/wrong-password":
        return "Wrong password";
      case "auth/invalid-email":
        return "Invalid email format";
      case "auth/too-many-requests":
        return "Too many attempts. Try later";
      case "auth/invalid-credential":
        return "Wrong email or password";
      default:
        return "Login failed. Try again";
    }
  };

  // EMAIL LOGIN
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    const password = e.target.password.value;

    setLoading(true);

    try {
      const res = await signInWithEmailAndPasswordFunc(email, password);

      if (!res.user.emailVerified) {
        toast.error("Please verify your email first!");
        setLoading(false);
        return;
      }

      setUser(res.user);
      toast.success("Login successful!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getAuthError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const res = await signInWithGoogleFunc();

      setUser(res.user);
      toast.success("Logged in with Google!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getAuthError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // 🔑 FORGOT PASSWORD (FIXED)
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first!");
      return;
    }

    try {
      await sendPassResetEmailFunc(email);
      toast.success("Password reset email sent!");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-300 relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Decorative Blurs */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-gray-300/30 dark:bg-gray-700/30 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-gray-400/30 dark:bg-gray-600/30 rounded-full blur-3xl bottom-10 right-10"></div>
      </div>

      <MyContainer>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 p-6 lg:p-10">
          {/* LEFT TEXT */}
          <div className="max-w-lg text-center lg:text-left">
            <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100">
              Art Gallery
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Discover beautiful artworks from talented artists around the
              world. Login to explore the gallery 🎨
            </p>
          </div>

          {/* LOGIN BOX */}
          <div className="w-full max-w-md backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/30 dark:border-gray-600/30 shadow-2xl rounded-3xl p-8">
            <form onSubmit={handleEmailLogin} className="space-y-5">
              <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
                Login
              </h2>

              {/* EMAIL */}
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // ✅ FIX
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 pr-12"
                  required
                />

                <span
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-10 cursor-pointer text-gray-500"
                >
                  {show ? <FaEye /> : <IoEyeOff />}
                </span>
              </div>

              {/* FORGOT PASSWORD */}
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-red-500 hover:underline"
              >
                Forgot Password?
              </button>

              {/* LOGIN */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gray-800 text-white"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* GOOGLE */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 flex items-center justify-center gap-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5"
                  alt="Google"
                />
                Continue with Google
              </button>

              {/* SIGNUP */}
              <p className="text-center text-sm">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-blue-500">
                  Register
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
