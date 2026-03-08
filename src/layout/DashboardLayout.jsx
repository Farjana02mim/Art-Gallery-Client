import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import { FaPaintBrush } from "react-icons/fa";

const DashboardLayout = () => {
  return (
    <div className="drawer lg:drawer-open h-screen bg-gray-50">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col h-screen">
        {/* Navbar */}
        <nav className="navbar w-full shadow px-4 flex-shrink-0 bg-gray-50 text-gray-800">
          <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost lg:hidden text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="text-lg font-semibold">Zap Shift Dashboard</div>
        </nav>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-6 text-gray-800">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side h-screen">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
        <div className="flex flex-col h-full w-64 p-4 space-y-2 bg-gray-50 text-gray-800">
          <ul className="menu w-full">
            {/* Homepage */}
            <li>
              <Link
                to="/"
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors text-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <span>Homepage</span>
              </Link>
            </li>

            {/* My Arts */}
            <li>
              <NavLink
                to="/dashboard/my-arts"
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors text-gray-800"
              >
                <FaPaintBrush className="w-5 h-5"/>
                <span>My Arts</span>
              </NavLink>
            </li>

            {/* Settings */}
            <li>
              <button className="flex items-center gap-2 p-2 w-full rounded hover:bg-gray-100 transition-colors text-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;