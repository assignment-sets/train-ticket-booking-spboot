import { useParams, Link } from "react-router-dom";
import { useTicketDetails } from "../hooks/useTicketDetails";
import SingleTicketBoardingPass from "../components/tickets/SingleTicketBoardingPass";

export default function SingleTicketPage() {
  const { ticketId } = useParams();
  const { ticket, isLoading, error } = useTicketDetails(ticketId);

  return (
    <div className="flex-1 bg-canvas py-10 px-6 sm:px-8 pb-24">
      {/* Header Breadcrumb */}
      <div className="max-w-3xl mx-auto mb-6 print:hidden">
        <div className="flex items-center gap-2 text-caption-sm text-muted">
          <Link to="/my-bookings" className="hover:text-ink transition-colors">
            My Bookings
          </Link>
          <span>/</span>
          <Link to="/tickets" className="hover:text-ink transition-colors">
            Tickets
          </Link>
          <span>/</span>
          <span className="text-ink font-bold">Ticket #{ticketId}</span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-24 text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-primary border-r-transparent" />
          <p className="text-body-md text-muted font-medium">Loading passenger boarding pass…</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="max-w-2xl mx-auto text-center py-16 border border-hairline rounded-2xl p-8 bg-surface-soft">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-title-md font-bold text-ink">Ticket Not Found</h3>
          <p className="text-body-sm text-error mt-1">{error}</p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              to="/tickets"
              className="inline-flex items-center rounded-sm border border-hairline bg-canvas px-4 py-2 text-caption font-bold text-ink hover:bg-surface-strong transition-colors"
            >
              Search by Ticket ID
            </Link>
            <Link
              to="/my-bookings"
              className="inline-flex items-center rounded-sm bg-primary px-4 py-2 text-caption font-bold text-white hover:bg-primary-active transition-colors"
            >
              Go to My Bookings
            </Link>
          </div>
        </div>
      )}

      {/* Boarding Pass Component */}
      {!isLoading && ticket && (
        <SingleTicketBoardingPass ticket={ticket} />
      )}
    </div>
  );
}
