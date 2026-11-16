import { Link } from "react-router-dom";
import { useBank } from "../context/BankContext";

export default function Home() {
  const { isLoggedIn } = useBank();

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section text-white">
        <div className="container py-5">
          <div className="row align-items-center min-vh-60">
            <div className="col-lg-6">
              <span className="badge bg-warning text-dark mb-3 px-3 py-2">
                Frontend Simulation · Not a real bank
              </span>
              <h1 className="display-4 fw-bold mb-3">
                Banking made simple,{" "}
                <span className="text-warning">secure &amp; modern</span>
              </h1>
              <p className="lead text-white-50 mb-4">
                Experience a complete online banking flow — login, overview,
                transfers, transaction history and profile — all running
                locally in your browser with demo data.
              </p>
              <div className="d-flex flex-wrap gap-3">
                {isLoggedIn ? (
                  <Link to="/dashboard" className="btn btn-warning btn-lg px-4">
                    Go to Dashboard <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-warning btn-lg px-4">
                      Login to Demo <i className="bi bi-box-arrow-in-right ms-1"></i>
                    </Link>
                    <Link to="/login?demo=1" className="btn btn-outline-light btn-lg px-4">
                      Try demo_user
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="hero-card glass-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <div className="text-white-50 small">Available Balance</div>
                    <div className="fs-3 fw-bold text-white">₹25,000.00</div>
                  </div>
                  <div className="hero-avatar">
                    <i className="bi bi-person-fill"></i>
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="stat-pill">
                      <i className="bi bi-arrow-down-circle text-success"></i>
                      <div>
                        <div className="small text-white-50">Credits</div>
                        <div className="fw-semibold">₹15,000</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-pill">
                      <i className="bi bi-arrow-up-circle text-danger"></i>
                      <div>
                        <div className="small text-white-50">Debits</div>
                        <div className="fw-semibold">₹2,000</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-top border-white-10">
                  <div className="d-flex justify-content-between small text-white-50">
                    <span>Account •••• 9012</span>
                    <span>Savings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Everything you need in one place</h2>
            <p className="text-muted">
              Fully functional demo with persistent local data per username
            </p>
          </div>
          <div className="row g-4">
            {[
              {
                icon: "bi-shield-lock",
                title: "Demo Login",
                desc: "Any username creates its own isolated balance and history. Returning users keep their data.",
              },
              {
                icon: "bi-send-check",
                title: "Instant Transfers",
                desc: "Send money with validation. Balance updates live and a debit transaction is recorded.",
              },
              {
                icon: "bi-clock-history",
                title: "Transaction History",
                desc: "Search, filter by type/date and export CSV of your filtered records.",
              },
              {
                icon: "bi-person-gear",
                title: "Editable Profile",
                desc: "Update name, email, phone and city. Account number stays masked for privacy.",
              },
            ].map((f) => (
              <div className="col-md-6 col-lg-3" key={f.title}>
                <div className="feature-card h-100 p-4 bg-white rounded-4 shadow-sm">
                  <div className="feature-icon mb-3">
                    <i className={`bi ${f.icon}`}></i>
                  </div>
                  <h5 className="fw-semibold">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container">
          <div className="cta-banner rounded-4 p-5 text-center text-white">
            <h3 className="fw-bold mb-2">Ready to explore?</h3>
            <p className="mb-4 opacity-75">
              No real money. No backend. Just a polished frontend banking simulation.
            </p>
            <Link to="/login" className="btn btn-light btn-lg px-4">
              Start Demo Session
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
