import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TicketLookupWidget({ className = "" }) {
  const [ticketIdInput, setTicketIdInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const clean = ticketIdInput.replace(/\D/g, ""); // Extract numeric ticket ID
    if (!clean) {
      setError("Please enter a valid numeric Ticket ID (e.g. 1, 501).");
      return;
    }

    navigate(`/tickets/${clean}`);
  }

  return (
    <div className={`w-full max-w-xl mx-auto rounded-2xl border border-hairline bg-canvas p-5 sm:p-6 shadow-md ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <h3 className="text-title-md font-bold text-ink">Find Ticket / Boarding Pass</h3>
      </div>

      <p className="text-caption text-muted mb-4">
        Enter your Ticket ID to look up seat details, route timings, and print your boarding pass.
      </p>

      {error && (
        <div role="alert" className="mb-3 rounded-md border border-error/20 bg-error/5 p-2.5 text-caption text-error font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={ticketIdInput}
            onChange={(e) => setTicketIdInput(e.target.value)}
            placeholder="Enter Ticket ID (e.g. 1, 501)…"
            className="h-12 w-full rounded-sm border border-hairline bg-canvas pl-10 pr-4 text-body-md text-ink placeholder:text-muted focus:border-ink focus:outline-none"
          />
          <svg
            className="absolute left-3.5 top-3.5 h-5 w-5 text-muted pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="2" />
            <line x1="7" y1="8" x2="17" y2="8" strokeWidth="2" />
            <line x1="7" y1="12" x2="17" y2="12" strokeWidth="2" />
            <line x1="7" y1="16" x2="12" y2="16" strokeWidth="2" />
          </svg>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-ink px-6 text-button-sm font-bold text-white shadow-sm hover:bg-black transition-colors cursor-pointer"
        >
          <span>Find Ticket</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  );
}
