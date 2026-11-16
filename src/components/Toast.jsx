import { useEffect, useState } from "react";

let toastId = 0;
const listeners = new Set();

export function showToast(message, type = "success") {
  const id = ++toastId;
  listeners.forEach((fn) => fn({ id, message, type }));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (t) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 3500);
    };
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast show align-items-center text-bg-${t.type === "error" ? "danger" : t.type} border-0 mb-2`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">{t.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
}
