import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaPaintBrush,
  FaUserCheck,
  FaHome,
  FaCog,
  FaUsers,
  FaUser,
  FaShoppingCart,
  FaHeart,
  FaPlus,
  FaChartBar,
} from "react-icons/fa";
import useRole from "../hooks/useRole";

const DashboardLayout = () => {
  const { role } = useRole();

  const menuItems = [
    { to: "/", label: "Homepage", icon: <FaHome /> },

    { to: "/dashboard/profile", label: "My Profile", icon: <FaUser /> },

    ...(role === "user"
      ? [
          {
            to: "/dashboard/my-purchases",
            label: "My Purchases",
            icon: <FaShoppingCart />,
          },
          {
            to: "/dashboard/favorites",
            label: "My Favorites",
            icon: <FaHeart />,
          },
        ]
      : []),

    ...(role === "artist"
      ? [
          { to: "/dashboard/add-listing", label: "Add Art", icon: <FaPlus /> },
          {
            to: "/dashboard/my-arts",
            label: "My Arts",
            icon: <FaPaintBrush />,
          },
          {
            to: "/dashboard/my-sales",
            label: "My Sales",
            icon: <FaChartBar />,
          },
        ]
      : []),

    ...(role === "admin"
      ? [
          {
            to: "/dashboard/approve-artists",
            label: "Approve Artists",
            icon: <FaUserCheck />,
          },
          {
            to: "/dashboard/users-management",
            label: "Users Management",
            icon: <FaUsers />,
          },
          {
            to: "/dashboard/manage-artists",
            label: "Manage Artists",
            icon: <FaPaintBrush />,
          },
          {
            to: "/dashboard/statistics",
            label: "Statistics",
            icon: <FaChartBar />,
          },
        ]
      : []),

    { to: "/dashboard/settings", label: "Settings", icon: <FaCog /> },
  ];

  const closeDrawer = () => {
    const drawer = document.getElementById("my-drawer-4");
    if (drawer) drawer.checked = false;
  };

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT */}
      <div className="drawer-content flex flex-col">
        {/* TOP NAVBAR */}
        <nav
          className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 
          bg-white/70 dark:bg-gray-800/70 backdrop-blur-md 
          border-b border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <label htmlFor="my-drawer-4" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>

            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Dashboard
            </h2>
          </div>

          {/* Right Side (optional future: profile, notifications) */}
          <div className="text-sm text-gray-500 dark:text-gray-300">
            Welcome 👋
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 text-gray-800 dark:text-gray-200">
          <Outlet />
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

        <div
          className="w-64 min-h-full p-4 
          bg-white dark:bg-gray-900 
          border-r border-gray-200 dark:border-gray-700 
          shadow-lg"
        >
          {/* Logo / Title */}
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            ArtSphere
          </h2>

          {/* MENU */}
          <ul className="space-y-1">
            {menuItems.map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={closeDrawer}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 
                    ${
                      isActive
                        ? "bg-yellow-400 text-gray-900 font-semibold shadow"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  <span className="text-lg">{icon}</span>
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
