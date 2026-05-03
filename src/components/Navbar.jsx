import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import MyContainer from "./MyContainer";
import MyLink from "./MyLink";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ClockLoader } from "react-spinners";

//https://art-gallery-85d90.web.app/

const Navbar = () => {
  const { user, signoutUserFunc, setUser, loading } = useContext(AuthContext);

  const [avatarMenu, setAvatarMenu] = useState(false);
  const avatarRef = useRef();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Theme sync
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

  // Avatar menu close (outside click)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 Mobile menu close (outside click + touch)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Common Links (with auto close)
  const commonLinks = (
    <>
      <li onClick={() => setMenuOpen(false)}>
        <MyLink to="/">Home</MyLink>
      </li>
      <li onClick={() => setMenuOpen(false)}>
        <MyLink to="/gallery">Gallery</MyLink>
      </li>
      <li onClick={() => setMenuOpen(false)}>
        <MyLink to="/coverage">Coverage</MyLink>
      </li>

      {user && (
        <>
          <li onClick={() => setMenuOpen(false)}>
            <MyLink to="/artists">Artists</MyLink>
          </li>
          <li onClick={() => setMenuOpen(false)}>
            <MyLink to="/dashboard/my-purchases">
              My Purchases
            </MyLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-lg pr-7">
      <MyContainer className="flex items-center justify-between py-3 relative">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-[40px] md:w-[45px]" />
          <h1 className="text-yellow-400 text-xl md:text-2xl font-semibold">
            ArtSphere
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-6 text-yellow-400 font-medium">
          {commonLinks}
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Loader */}
          {loading ? (
            <ClockLoader color="#FBBF24" size={25} />
          ) : user ? (
            <div className="relative flex items-center gap-2" ref={avatarRef}>
              <img
                onClick={() => setAvatarMenu(!avatarMenu)}
                src={user.photoURL || "https://via.placeholder.com/100"}
                alt="User"
                className="h-[40px] w-[40px] md:h-[45px] md:w-[45px] rounded-full ring-2 ring-yellow-400 cursor-pointer"
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
            <div className="hidden lg:flex gap-2">
              <Link to="/signin" className="btn-yellow">Login</Link>
              <Link to="/signup" className="btn-yellow">Register</Link>
            </div>
          )}

          {/* Mobile Button */}
          <div className="lg:hidden pr-9">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-yellow-400"
            >
              ☰
            </button>
          </div>
        </div>

        {/* 🔥 Overlay */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black/40 z-10"></div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <ul
            ref={menuRef}
            className="absolute top-full left-0 w-full bg-gray-900 text-yellow-400 flex flex-col gap-3 p-4 lg:hidden z-20 transition-all duration-300"
          >
            {commonLinks}

            {!user && (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/signin" onClick={() => setMenuOpen(false)} className="btn-yellow">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-yellow">
                  Register
                </Link>
              </div>
            )}
          </ul>
        )}
      </MyContainer>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-3">
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