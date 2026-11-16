import { Link, NavLink, useNavigate } from "react-router-dom";
import { useBank } from "../context/BankContext";

export default function Navbar() {
  const { data, isLoggedIn, logout } = useBank();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const name = data?.user?.name || "User";
  const initial = (name || "U").trim().charAt(0).toUpperCase();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bank-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to={isLoggedIn ? "/dashboard" : "/"}>
          <span className="brand-icon">
            <i className="bi bi-bank2"></i>
          </span>
          <span className="fw-bold">NovaBank</span>
          <span className="badge bg-warning text-dark ms-1 small">Demo</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          {isLoggedIn ? (
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i> Overview
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/transfer">
                    <i className="bi bi-send me-1"></i> Transfer
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/transactions">
                    <i className="bi bi-clock-history me-1"></i> Transactions
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">
                    <i className="bi bi-person-circle me-1"></i> Profile
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/help">
                    <i className="bi bi-question-circle me-1"></i> Help
                  </NavLink>
                </li>
              </ul>
              <div className="d-flex align-items-center gap-3">
                <div className="d-none d-md-flex align-items-center gap-2 text-white-50">
                  <div className="avatar-circle">{initial}</div>
                  <span className="small">{name}</span>
                </div>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </div>
            </>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
