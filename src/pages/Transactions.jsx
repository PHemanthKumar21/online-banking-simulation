import { useMemo, useState } from "react";
import { useBank } from "../context/BankContext";

export default function Transactions() {
  const { data, money } = useBank();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  if (!data) return null;

  const filtered = useMemo(() => {
    return data.transactions.filter((tx) => {
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (dateFrom && tx.date < dateFrom) return false;
      if (dateTo && tx.date > dateTo) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${tx.name} ${tx.note || ""} ${tx.id}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [data.transactions, search, typeFilter, dateFrom, dateTo]);

  const exportCsv = () => {
    const headers = ["ID", "Date", "Type", "Name", "Amount", "Status", "Note"];
    const rows = filtered.map((t) =>
      [t.id, t.date, t.type, t.name, t.amount, t.status, t.note || ""]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `novabank-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="transactions-page py-4">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Transactions</h2>
            <p className="text-muted mb-0">
              {filtered.length} of {data.transactions.length} records
            </p>
          </div>
          <button
            className="btn btn-outline-primary"
            onClick={exportCsv}
            disabled={!filtered.length}
          >
            <i className="bi bi-download me-1"></i> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-3">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label small text-muted mb-1">Search</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name, note or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <label className="form-label small text-muted mb-1">Type</label>
                <select
                  className="form-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted mb-1">From</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted mb-1">To</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-0">
            {filtered.length === 0 ? (
              <div className="text-center text-muted py-5">
                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                No transactions match your filters.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th className="text-end">Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((tx) => (
                      <tr key={tx.id}>
                        <td className="font-monospace small text-muted">
                          {tx.id}
                        </td>
                        <td className="small">{tx.date}</td>
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
  );
}
