import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBank } from "../context/BankContext";
import { showToast } from "../components/Toast";

export default function Transfer() {
  const { data, money, transfer } = useBank();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    beneficiary: "",
    toAccount: "",
    amount: "",
    note: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [validated, setValidated] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!data) return null;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.beneficiary.trim()) return "Beneficiary name is required.";
    if (!form.toAccount.trim() || form.toAccount.replace(/\s/g, "").length < 8)
      return "Enter a valid account number (min 8 digits).";
    const amt = Number(form.amount);
    if (!amt || amt <= 0) return "Enter a valid amount greater than zero.";
    if (amt > data.balance) return "Insufficient balance for this transfer.";
    return null;
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setValidated(true);
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setConfirming(true);
  };

  const handleConfirm = () => {
    try {
      const result = transfer({
        beneficiary: form.beneficiary.trim(),
        toAccount: form.toAccount.trim(),
        amount: form.amount,
        note: form.note.trim() || "Fund transfer",
      });
      setSuccess(result.transaction);
      setConfirming(false);
      setForm({ beneficiary: "", toAccount: "", amount: "", note: "" });
      setValidated(false);
      showToast(
        `₹${Number(result.transaction.amount).toLocaleString("en-IN")} sent successfully`,
        "success"
      );
    } catch (err) {
      setError(err.message);
      setConfirming(false);
    }
  };

  return (
    <div className="transfer-page py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold mb-1">Transfer Money</h2>
                <p className="text-muted mb-0">
                  Available balance:{" "}
                  <strong className="text-success">{money(data.balance)}</strong>
                </p>
              </div>
            </div>

            {success && (
              <div className="alert alert-success border-0 shadow-sm rounded-4 mb-4">
                <div className="d-flex align-items-start gap-3">
                  <i className="bi bi-check-circle-fill fs-3"></i>
                  <div>
                    <h5 className="alert-heading mb-1">Transfer Successful</h5>
                    <p className="mb-2">
                      <strong>{money(success.amount)}</strong> sent to{" "}
                      <strong>{success.name}</strong>
                    </p>
                    <ul className="small mb-2">
                      <li>Transaction ID: {success.id}</li>
                      <li>Date: {success.date}</li>
                      <li>Status: {success.status}</li>
                    </ul>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => setSuccess(null)}
                      >
                        Make another transfer
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => navigate("/transactions")}
                      >
                        View transactions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!success && (
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 p-md-5">
                  {error && (
                    <div className="alert alert-danger py-2">{error}</div>
                  )}

                  <form
                    onSubmit={handlePreview}
                    className={validated ? "was-validated" : ""}
                    noValidate
                  >
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Beneficiary Name
                      </label>
                      <input
                        type="text"
                        name="beneficiary"
                        className="form-control form-control-lg"
                        placeholder="Full name of recipient"
                        value={form.beneficiary}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Account Number
                      </label>
                      <input
                        type="text"
                        name="toAccount"
                        className="form-control form-control-lg font-monospace"
                        placeholder="Recipient account number"
                        value={form.toAccount}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Amount (₹)</label>
                      <input
                        type="number"
                        name="amount"
                        className="form-control form-control-lg"
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                        value={form.amount}
                        onChange={handleChange}
                        required
                      />
                      <div className="form-text">
                        Max: {money(data.balance)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Note / Remarks (optional)
                      </label>
                      <input
                        type="text"
                        name="note"
                        className="form-control"
                        placeholder="e.g. Rent payment"
                        value={form.note}
                        onChange={handleChange}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100"
                    >
                      <i className="bi bi-eye me-2"></i>
                      Review Transfer
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Confirm Modal */}
            {confirming && (
              <div
                className="modal fade show d-block"
                style={{ background: "rgba(0,0,0,0.5)" }}
                tabIndex={-1}
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content rounded-4 border-0">
                    <div className="modal-header border-0">
                      <h5 className="modal-title fw-bold">Confirm Transfer</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setConfirming(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <p className="mb-3">Please confirm the details below:</p>
                      <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item d-flex justify-content-between">
                          <span className="text-muted">To</span>
                          <strong>{form.beneficiary}</strong>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <span className="text-muted">Account</span>
                          <strong className="font-monospace">
                            {form.toAccount}
                          </strong>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <span className="text-muted">Amount</span>
                          <strong className="text-primary fs-5">
                            {money(form.amount)}
                          </strong>
                        </li>
                        {form.note && (
                          <li className="list-group-item d-flex justify-content-between">
                            <span className="text-muted">Note</span>
                            <span>{form.note}</span>
                          </li>
                        )}
                      </ul>
                      <div className="alert alert-warning small mb-0">
                        After confirmation, ₹{Number(form.amount).toLocaleString("en-IN")} will be
                        deducted from your available balance.
                      </div>
                    </div>
                    <div className="modal-footer border-0">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setConfirming(false)}
                      >
                        Cancel
                      </button>
                      <button className="btn btn-primary" onClick={handleConfirm}>
                        <i className="bi bi-check2-circle me-1"></i>
                        Confirm &amp; Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
