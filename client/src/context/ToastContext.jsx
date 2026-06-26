import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};

const COLORS = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-600",
  warning: "bg-yellow-500",
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast stack — always rendered, position fixed so it floats above everything */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-72">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start justify-between gap-3 ${COLORS[t.type] ?? "bg-gray-700"} text-white text-sm px-4 py-3 rounded shadow-lg`}
          >
            <span>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 leading-none opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
