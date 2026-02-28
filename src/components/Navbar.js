import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../WorkGrid.png";

export default function Navbar({ title = "Dashboard" }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm px-4 wg-navbar">
      <div className="d-flex align-items-center gap-2">
        <img src={logo} alt="WorkGrid logo" className="wg-logo-sm" />
        <span className="navbar-brand fw-bold mb-0">{title}</span>
      </div>

      <div className="ms-auto d-flex align-items-center gap-3">
        <span className="text-muted">
          Welcome, <b>{user?.full_name}</b>
        </span>

        <button className="btn btn-primary btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
