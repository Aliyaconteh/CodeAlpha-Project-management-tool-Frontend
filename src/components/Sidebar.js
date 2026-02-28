import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../WorkGrid.png";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const adminEmail = (process.env.REACT_APP_ADMIN_EMAIL || "").toLowerCase();
  const isAdmin = user?.email && user.email.toLowerCase() === adminEmail;

  const linkClass = ({ isActive }) =>
    isActive
      ? "btn btn-light w-100 text-start fw-bold mb-2 wg-nav-link"
      : "btn btn-outline-light w-100 text-start mb-2 wg-nav-link";

  return (
    <div className="text-white p-3 wg-sidebar">
      <div className="d-flex align-items-center gap-2 mb-4">
        <img src={logo} alt="WorkGrid logo" className="wg-logo-sm" />
        <h4 className="mb-0 fw-bold">WorkGrid</h4>
      </div>

      <NavLink to="/dashboard" className={linkClass}>
        Dashboard
      </NavLink>

      <NavLink to="/projects" className={linkClass}>
        Projects
      </NavLink>

      <NavLink to="/projects/manage" className={linkClass}>
        Manage Projects
      </NavLink>

      <NavLink to="/tasks" className={linkClass}>
        Tasks
      </NavLink>

      <NavLink to="/notifications" className={linkClass}>
        Notifications
      </NavLink>

      {isAdmin && (
        <NavLink to="/admin/users" className={linkClass}>
          Admin Users
        </NavLink>
      )}
    </div>
  );
}
