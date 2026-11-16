import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useBank } from "../context/BankContext";
import { showToast } from "../components/Toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const { login, isLoggedIn } = useBank();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (isLoggedIn) navigate("/dashboard", { replace: true });
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (searchParams.get("demo")) {
      setUsername("demo_user");
      setPassword("Demo@123");
    }
  }, [searchParams]);

  const fillDemo = () => {
    setUsername("demo_user");
    setPassword("Demo@123");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidated(true);
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    login(username.trim());
    showToast(`Welcome back, ${username.trim()}!`, "success");
    navigate("/dashboard");
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card login-card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="login-header text-white text-center p-4">
                <div className="login-logo mb-2">
                  <i className="bi bi-bank2"></i>
                </div>
                <h3 className="fw-bold mb-1">NovaBank</h3>
                <p className="mb-0 opacity-75 small">Secure demo login</p>
              </div>
              <div className="card-body p-4 p-md-5">
                <div className="alert alert-info small mb-4">
                  <i className="bi bi-info-circle me-1"></i>
                  Enter any non-empty username &amp; password. Each username
                  keeps its own balance and transactions.
                </div>

                {error && (
                  <div className="alert alert-danger py-2 small">{error}</div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className={validated ? "was-validated" : ""}
                  noValidate
                >
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. demo_user"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type={showPass ? "text" : "password"}
                        className="form-control"
                        placeholder="Any password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPass(!showPass)}
                        tabIndex={-1}
                      >
                        <i className={`bi bi-eye${showPass ? "-slash" : ""}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="d-grid gap-2 mb-3">
                    <button type="submit" className="btn btn-primary btn-lg">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Sign In
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={fillDemo}
                    >
                      Fill demo credentials
                    </button>
                  </div>
                </form>

                <p className="text-center text-muted small mb-0">
                  <Link to="/" className="text-decoration-none">
                    ← Back to home
                  </Link>
                </p>
              </div>
            </div>
            <p className="text-center text-muted small mt-3">
              This is a frontend simulation only. Never enter real banking credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
