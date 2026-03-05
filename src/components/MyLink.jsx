import { NavLink } from "react-router-dom";

const MyLink = ({ to, className, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "text-yellow-300 font-bold underline" // active link
          : `${className || ""} text-yellow-400 hover:text-yellow-300 font-semibold transition`
      }
    >
      {children}
    </NavLink>
  );
};

export default MyLink;