import { Link } from "react-router-dom";
import TicketLookupWidget from "../components/tickets/TicketLookupWidget";

export default function TicketLookupPage() {
  return (
    <div className="flex-1 bg-canvas pb-24">
      {/* Hero Header */}
      <section className="bg-surface-soft border-b border-hairline py-10 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-display-lg sm:text-display-xl text-ink font-bold tracking-tight">
              Find Your Ticket & Boarding Pass
            </h1>
            <p className="text-body-md text-muted mt-1">
              Enter your numeric Ticket ID to view your passenger boarding pass, allocated coach and seat number, and station entry barcode.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area on White Canvas */}
      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-8 space-y-6">
        <div className="max-w-xl mx-auto space-y-6">
          <TicketLookupWidget />

          <div className="rounded-xl border border-hairline bg-surface-soft p-5 text-caption text-ink space-y-3">
            <div className="flex items-center gap-2 font-bold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Where can I find my Ticket ID?</span>
            </div>
            <p className="text-muted text-[13px] leading-relaxed">
              Your Ticket ID is assigned when your train booking is created. You can find all your Ticket IDs listed inside your orders on the{" "}
              <Link to="/my-bookings" className="text-primary hover:underline font-semibold">
                My Bookings
              </Link>{" "}
              page.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
