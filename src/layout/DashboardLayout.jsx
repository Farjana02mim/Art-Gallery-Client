import React from 'react';
import { NavLink, Outlet } from 'react-router';
import { FaPaintBrush, FaUserCheck, FaHome, FaCog } from "react-icons/fa";

const DashboardLayout = () => {

  const closeDrawer = () => {
    const drawer = document.getElementById("my-drawer-4");
    if (drawer) drawer.checked = false;
  };

  const menuItems = [
    { to: "/", label: "Homepage", icon: <FaHome />, tooltip: "Homepage" },
    { to: "/dashboard/my-arts", label: "My Arts", icon: <FaPaintBrush />, tooltip: "My Arts" },
    { to: "/dashboard/approve-artists", label: "Approve Artists", icon: <FaUserCheck />, tooltip: "Approve Artists" },
    { to: "/dashboard/settings", label: "Settings", icon: <FaCog />, tooltip: "Settings" },
  ];

  return (
    <div className="drawer lg:drawer-open h-screen bg-gray-50">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col h-screen">
        {/* Navbar */}
        <nav className="navbar w-full shadow px-4 flex-shrink-0 bg-white text-gray-800">
          <label htmlFor="my-drawer-4" aria-label="Open sidebar" className="btn btn-square btn-ghost lg:hidden text-gray-800">
            {/* Hamburger Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <div className="text-lg font-semibold">Zap Shift Dashboard</div>
        </nav>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6 text-gray-800">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side h-screen">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
        <div className="flex flex-col h-full w-64 p-4 space-y-2 bg-gray-50 text-gray-800">
          <ul className="menu w-full">
            {menuItems.map(({ to, label, icon, tooltip }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={closeDrawer}
                  className={({ isActive }) =>
                    `flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors text-gray-800 ${
                      isActive ? "bg-gray-200 font-semibold" : ""
                    }`
                  }
                  data-tip={tooltip} // Optional: works if you add react-tooltip
                >
                  {icon}
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