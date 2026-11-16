import { useState } from "react";
import { useBank } from "../context/BankContext";
import { showToast } from "../components/Toast";

export default function Help() {
  const { reset } = useBank();
  const [resetMsg, setResetMsg] = useState("");

  const handleReset = () => {
    if (
      window.confirm(
        "Reset all demo data for the current user? Balance and transactions will return to the starting state."
      )
    ) {
      reset();
      setResetMsg("Demo data has been reset successfully.");
      showToast("Demo data reset", "success");
    }
  };

  const faqs = [
    {
      q: "Is this a real bank?",
      a: "No. NovaBank is a frontend simulation built for learning. No real money, authentication or backend is involved.",
    },
    {
      q: "How does login work?",
      a: "Any non-empty username and password works. Each username gets its own isolated balance, profile and transaction list stored in your browser’s localStorage.",
    },
    {
      q: "What happens when I transfer money?",
      a: "The amount is deducted from the current user’s available balance and a debit transaction is added. The change is saved immediately.",
    },
    {
      q: "Can I export my transactions?",
      a: "Yes. On the Transactions page you can filter the list and download a CSV of the currently visible records.",
    },
    {
      q: "How do I reset demo data?",
      a: "Use the button below. It restores the starting balance and sample transactions for the currently logged-in username only.",
    },
  ];

  return (
    <div className="help-page py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="fw-bold mb-2">Help &amp; Support</h2>
            <p className="text-muted mb-4">
              Frequently asked questions about this banking simulation.
            </p>

            <div className="accordion mb-4" id="faqAccordion">
              {faqs.map((f, i) => (
                <div className="accordion-item border-0 shadow-sm mb-2 rounded-3 overflow-hidden" key={i}>
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${i !== 0 ? "collapsed" : ""}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#faq${i}`}
                    >
                      {f.q}
                    </button>
                  </h2>
                  <div
                    id={`faq${i}`}
                    className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body text-muted">{f.a}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h5 className="fw-semibold mb-2">
                  <i className="bi bi-arrow-counterclockwise me-2 text-warning"></i>
                  Reset Demo Data
                </h5>
                <p className="text-muted small">
                  Restore the starting account state for the current username.
                  This cannot be undone.
                </p>
                {resetMsg && (
                  <div className="alert alert-success py-2">{resetMsg}</div>
                )}
                <button className="btn btn-warning" onClick={handleReset}>
                  Reset demo data
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-light rounded-4 small text-muted">
              <strong>Disclaimer:</strong> This application is a learning /
              portfolio project only. It is not affiliated with any bank. Do not
              enter real banking credentials, card numbers, PINs or personal
              financial information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
