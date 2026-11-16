import { Link } from "react-router-dom";
import { useBank } from "../context/BankContext";

export default function Dashboard() {
  const { data, money, shortMoney, maskAccount } = useBank();
  if (!data) return null;

  const { user, balance, transactions } = data;
  const credits = transactions
    .filter((t) => t.type === "credit")
    .reduce((s, t) => s + Number(t.amount), 0);
  const debits = transactions
    .filter((t) => t.type === "debit")
    .reduce((s, t) => s + Number(t.amount), 0);
  const recent = transactions.slice(0, 5);

  return (
    <div className="dashboard-page py-4">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Welcome, {user.name}</h2>
            <p className="text-muted mb-0">
              Account overview · {maskAccount(user.accountNumber)}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/transfer" className="btn btn-primary">
              <i className="bi bi-send me-1"></i> Transfer Money
            </Link>
            <Link to="/transactions" className="btn btn-outline-primary">
              View All
            </Link>
          </div>
        </div>

        {/* Balance cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="stat-card balance-card h-100 p-4 rounded-4 text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="opacity-75 small">Available Balance</div>
                  <div className="display-6 fw-bold mt-1">{money(balance)}</div>
                </div>
                <div className="stat-icon">
                  <i className="bi bi-wallet2"></i>
                </div>
              </div>
              <div className="mt-3 small opacity-75">
                {user.accountType} · {user.branch}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card credit-card h-100 p-4 rounded-4 bg-white shadow-sm">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="text-muted small">Total Credits</div>
                  <div className="fs-3 fw-bold text-success mt-1">
                    {shortMoney(credits)}
                  </div>
                </div>
                <div className="stat-icon text-success">
                  <i className="bi bi-arrow-down-circle"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card debit-card h-100 p-4 rounded-4 bg-white shadow-sm">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="text-muted small">Total Debits</div>
                  <div className="fs-3 fw-bold text-danger mt-1">
                    {shortMoney(debits)}
                  </div>
                </div>
                <div className="stat-icon text-danger">
                  <i className="bi bi-arrow-up-circle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account details + recent */}
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <h5 className="fw-semibold mb-3">
                  <i className="bi bi-credit-card-2-front me-2 text-primary"></i>
                  Account Details
                </h5>
                <ul className="list-unstyled mb-0 detail-list">
                  <li>
                    <span className="label">Account Holder</span>
                    <span className="value">{user.name}</span>
                  </li>
                  <li>
                    <span className="label">Account Number</span>
                    <span className="value font-monospace">
                      {maskAccount(user.accountNumber)}
                    </span>
                  </li>
                  <li>
                    <span className="label">IFSC</span>
                    <span className="value">{user.ifsc}</span>
                  </li>
                  <li>
                    <span className="label">Type</span>
                    <span className="value">{user.accountType}</span>
                  </li>
                  <li>
                    <span className="label">Branch</span>
                    <span className="value">{user.branch}</span>
                  </li>
                </ul>
                <Link to="/profile" className="btn btn-sm btn-outline-primary mt-3">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-semibold mb-0">
                    <i className="bi bi-clock-history me-2 text-primary"></i>
                    Recent Transactions
                  </h5>
                  <Link to="/transactions" className="small">
                    See all →
                  </Link>
                </div>
                {recent.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    No transactions yet. Make a transfer to see activity.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Date</th>
                          <th>Description</th>
                          <th>Type</th>
                          <th className="text-end">Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recent.map((tx) => (
                          <tr key={tx.id}>
                            <td className="text-muted small">{tx.date}</td>
                            <td>
                              <div className="fw-medium">{tx.name}</div>
                              {tx.note && (
                                <div className="small text-muted">{tx.note}</div>
                              )}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  tx.type === "credit"
                                    ? "bg-success-subtle text-success"
                                    : "bg-danger-subtle text-danger"
                                }`}
                              >
                                {tx.type}
                              </span>
                            </td>
                            <td
                              className={`text-end fw-semibold ${
                                tx.type === "credit" ? "text-success" : "text-danger"
                              }`}
                            >
                              {tx.type === "credit" ? "+" : "-"}
                              {money(tx.amount)}
                            </td>
                            <td>
                              <span className="badge bg-success-subtle text-success">
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
