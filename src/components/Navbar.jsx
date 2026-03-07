import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import MyContainer from "./MyContainer";
import MyLink from "./MyLink";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ClockLoader } from "react-spinners";

const Navbar = () => {
  const { user, signoutUserFunc, setUser, loading } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const html = document.querySelector("html");
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleTheme = (checked) => {
    setTheme(checked ? "dark" : "light");
  };

  const handleSignout = () => {
    signoutUserFunc()
      .then(() => {
        toast.success("Sign out successful");
        setUser(null);
      })
      .catch((e) => toast.error(e.message));
  };

  return (
    <div className="bg-gray-400 dark:bg-gray-800 shadow-lg relative">
      <MyContainer className="flex items-center justify-between py-3 relative">
        {/* Logo & Site Name */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-[45px]" />
          <h1 className="text-yellow-400 text-2xl font-semibold tracking-wide">
            ArtSphere
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-4 text-yellow-400 font-medium">
          <li>
            <MyLink to="/">Home</MyLink>
          </li>
          <li>
            <MyLink to="/gallery">Gallery</MyLink>
          </li>
          <li><MyLink to="/artists">Artists</MyLink></li>
          <li><MyLink to="/coverage">Coverage</MyLink></li>
          {user && (
            <>
              <li>
                <MyLink to="/add-listing">Add Artwork</MyLink>
              </li>
              <li><MyLink to="/dashboard/my-arts">My Arts</MyLink></li>
              <li>
                <MyLink to="/my-orders">My Orders</MyLink>
              </li>
            </>
          )}
        </ul>

        {/* Right Side: User Info / Login / Menu */}
        <div className="flex items-center gap-3">
          {loading ? (
            <ClockLoader color="#FBBF24" size={25} />
          ) : user ? (
            <div className="flex items-center gap-2">
              <img
                src={user.photoURL || "https://via.placeholder.com/100"}
                alt={user.displayName || "User Avatar"}
                title={user.displayName || "User"}
                className="h-[45px] w-[45px] rounded-full ring-2 ring-yellow-400"
              />
              <button
                onClick={handleSignout}
                className="px-3 mr-6 py-1 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:text-white hover:bg-yellow-500 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex gap-2">
              <Link
                to="/signin"
                className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 mr-6 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition"
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
            <li>
              <MyLink to="/" onClick={() => setMenuOpen(false)}>
                Home
              </MyLink>
            </li>
          <li>
            <MyLink to="/gallery">Gallery</MyLink>
          </li>
          <li><MyLink to="/artists">Artists</MyLink></li>
            {user && (
              <>
                <li>
                  <MyLink to="/add-listing" onClick={() => setMenuOpen(false)}>
                    Add Artwork
                  </MyLink>
                </li>
                <li>
                  <MyLink to="/my-orders" onClick={() => setMenuOpen(false)}>
                    My Orders
                  </MyLink>
                </li>
              </>
            )}
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
                  className="px-4 mr-6 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition"
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
          onChange={(e) => handleTheme(e.target.checked)}
          type="checkbox"
          defaultChecked={localStorage.getItem("theme") === "dark"}
          className="toggle"
        />
      </div>
    </div>
  );
};

export default Navbar;