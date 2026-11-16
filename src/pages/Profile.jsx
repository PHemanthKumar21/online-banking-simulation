import { useState } from "react";
import { useBank } from "../context/BankContext";
import { showToast } from "../components/Toast";

export default function Profile() {
  const { data, money, maskAccount, updateProfile, logout } = useBank();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [message, setMessage] = useState("");

  if (!data) return null;
  const { user, balance } = data;
  const completed = Boolean(user.profileCompleted);

  const startEdit = () => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      city: user.city || "",
    });
    setEditing(true);
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMessage("Full name is required.");
      return;
    }
    updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
    });
    setEditing(false);
    setMessage("");
    showToast("Profile updated successfully", "success");
  };

  return (
    <div className="profile-page py-4">
      <div className="container">
        <div className="row g-4">
          {/* Left card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 text-center p-4">
              <div className="profile-avatar mx-auto mb-3">
                {(user.name || "U").trim().charAt(0).toUpperCase()}
              </div>
              <h4 className="fw-bold mb-0">{user.name || "Demo User"}</h4>
              <p className="text-muted">@{user.username}</p>
              <div className="d-flex justify-content-center gap-2 mb-3">
                <span className="badge bg-primary-subtle text-primary">
                  {user.accountType}
                </span>
              </div>
              <div className="text-start small">
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Account</span>
                  <span className="font-monospace">
                    {maskAccount(user.accountNumber)}
                  </span>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">IFSC</span>
                  <span>{user.ifsc}</span>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <span className="text-muted">Balance</span>
                  <span className="fw-semibold text-success">
                    {money(balance)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold mb-0">
                    <i className="bi bi-person-lines-fill me-2 text-primary"></i>
                    Personal Information
                  </h5>
                  {!editing && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={startEdit}
                    >
                      <i className="bi bi-pencil me-1"></i> Edit Details
                    </button>
                  )}
                </div>

                {message && (
                  <div className="alert alert-danger py-2">{message}</div>
                )}

                {editing || !completed ? (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.name}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={form.email}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, email: e.target.value }))
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={form.phone}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, phone: e.target.value }))
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">City</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.city}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, city: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-4 d-flex gap-2">
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                      {completed && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setEditing(false)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="row g-3">
                    {[
                      { label: "Full Name", value: user.name },
                      { label: "Email", value: user.email || "Not provided" },
                      { label: "Phone", value: user.phone || "Not provided" },
                      { label: "City", value: user.city || "Not provided" },
                      { label: "Account Type", value: user.accountType },
                      { label: "Branch", value: user.branch },
                    ].map((item) => (
                      <div className="col-md-6" key={item.label}>
                        <div className="p-3 bg-light rounded-3">
                          <div className="small text-muted">{item.label}</div>
                          <div className="fw-medium">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mt-4">
              <div className="card-body p-4 d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-semibold mb-1">Session</h6>
                  <p className="text-muted small mb-0">
                    Sign out of this demo session on this device.
                  </p>
                </div>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => {
                    logout();
                    window.location.href = "/login";
                  }}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
