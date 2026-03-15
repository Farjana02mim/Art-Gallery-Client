import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import MyContainer from "./MyContainer";
import MyLink from "./MyLink";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ClockLoader } from "react-spinners";

const Navbar = () => {
  const { user, signoutUserFunc, setUser, loading } = useContext(AuthContext);

  const [avatarMenu, setAvatarMenu] = useState(false);
  const avatarRef = useRef();

  const [menuOpen, setMenuOpen] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Sync theme with HTML and localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleTheme = (checked) => setTheme(checked ? "dark" : "light");

  const handleSignout = () => {
    signoutUserFunc()
      .then(() => {
        toast.success("Sign out successful");
        setUser(null);
      })
      .catch((e) => toast.error(e.message));
  };

  // Close avatar menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Common links for both menus
  const commonLinks = (
    <>
      <li><MyLink to="/">Home</MyLink></li>
      <li><MyLink to="/gallery">Gallery</MyLink></li>
      <li><MyLink to="/coverage">Coverage</MyLink></li>
      {user && (
        <>
          <li><MyLink to="/add-listing">Add Artwork</MyLink></li>
          <li><MyLink to="/artists">Artists</MyLink></li>
          <li><MyLink to="/dashboard/my-arts">My Arts</MyLink></li>
          <li><MyLink to="/dashboard/my-purchases">My Purchases</MyLink></li>
        </>
      )}
    </>
  );

  return (
    <div className="bg-gray-400 dark:bg-gray-800 shadow-lg relative">
      <MyContainer className="flex items-center justify-between py-3 relative">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-[45px]" />
          <h1 className="text-yellow-400 text-2xl font-semibold tracking-wide">
            ArtSphere
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-4 text-yellow-400 font-medium">
          {commonLinks}
        </ul>

        {/* Right Side: User Info / Login / Mobile Menu */}
        <div className="flex items-center gap-3">

          {/* Loader */}
          {loading ? (
            <ClockLoader color="#FBBF24" size={25} />
          ) : user ? (
            <div className="relative flex items-center gap-2 pr-7" ref={avatarRef}>
              <img
                onClick={() => setAvatarMenu(!avatarMenu)}
                src={user.photoURL || "https://via.placeholder.com/100"}
                alt={user.displayName || "User Avatar"}
                title={user.displayName || "User"}
                className="h-[45px] w-[45px] rounded-full ring-2 ring-yellow-400 cursor-pointer"
              />
              {avatarMenu && (
                <div className="absolute right-0 mt-3 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/dashboard"
                    onClick={() => setAvatarMenu(false)}
                    className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignout}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex gap-2 pr-6">
              <Link
                to="/signin"
                className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-yellow-400 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <ul className="absolute top-full left-0 w-full bg-gray-900 text-yellow-400 flex flex-col gap-2 p-4 lg:hidden z-20">
            {commonLinks}
            {!user && (
              <div className="flex flex-col gap-2 mt-2">
                <Link
                  to="/signin"
                  className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </ul>
        )}

      </MyContainer>

      {/* Theme Toggle */}
      <div className="absolute top-5 right-3">
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={(e) => handleTheme(e.target.checked)}
          className="toggle"
        />
      </div>
    </div>
  );
};

export default Navbar;