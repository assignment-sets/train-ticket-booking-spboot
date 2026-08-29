import { useState } from "react";
import TrainSearchWidget from "../components/booking/TrainSearchWidget";
import TrainResultCard from "../components/booking/TrainResultCard";
import SeatMapPicker from "../components/booking/SeatMapPicker";
import BookingCheckoutDrawer from "../components/booking/BookingCheckoutDrawer";
import { useTrainSearch } from "../hooks/useTrainSearch";
import { useAvailableSeats } from "../hooks/useAvailableSeats";
import { useBookingOrder } from "../hooks/useBookingOrder";
import { useStations } from "../hooks/useStations";

export default function BookingPage() {
  const { getStationById } = useStations();
  const {
    trains,
    isSearching,
    searchError,
    lastSearchParams,
    executeSearch,
  } = useTrainSearch();

  const {
    allSeats,
    totalCoaches,
    currentCoach,
    totalAvailableSeats,
    totalBookedSeats,
    selectedSeatIds,
    selectedSeats,
    isLoadingSeats,
    seatError,
    fetchSeats,
    switchCoach,
    toggleSeat,
    clearSelectedSeats,
  } = useAvailableSeats();

  const {
    isBooking,
    bookingError,
    executeBooking,
  } = useBookingOrder();

  const [selectedTrain, setSelectedTrain] = useState(null);

  const sourceStation = lastSearchParams ? getStationById(lastSearchParams.sourceStationId) : null;
  const destinationStation = lastSearchParams ? getStationById(lastSearchParams.destinationStationId) : null;

  async function handleSearch(searchParams) {
    setSelectedTrain(null);
    clearSelectedSeats();
    await executeSearch(searchParams);
  }

  async function handleSelectTrain(train) {
    setSelectedTrain(train);
    clearSelectedSeats();
    if (lastSearchParams) {
      await fetchSeats({
        journeyId: train.journeyId,
        sourceStationId: lastSearchParams.sourceStationId,
        destinationStationId: lastSearchParams.destinationStationId,
        coachNumber: 1,
      });
    }
  }

  async function handleProceedToPayment() {
    if (!selectedTrain || selectedSeatIds.length === 0 || !lastSearchParams) return;

    const order = await executeBooking({
      journeyId: selectedTrain.journeyId,
      seatIds: selectedSeatIds,
      sourceStationId: lastSearchParams.sourceStationId,
      destinationStationId: lastSearchParams.destinationStationId,
    });

    if (order && order.checkoutUrl) {
      // Redirect to Stripe checkout page
      window.location.href = order.checkoutUrl;
    }
  }

  return (
    <div className="flex-1 bg-canvas pb-32">
      {/* Hero Header */}
      <section className="bg-surface-soft border-b border-hairline py-10 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-display-lg sm:text-display-xl text-ink font-bold tracking-tight">
              Book Train Tickets
            </h1>
            <p className="text-body-md text-muted mt-1">
              Search scheduled routes, pick your preferred seats, and reserve instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area on White Canvas */}
      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {/* Search Widget */}
        <TrainSearchWidget onSearch={handleSearch} isSearching={isSearching} />

        {/* Search Error Alert */}
        {searchError && (
          <div
            role="alert"
            className="rounded-md border border-error/20 bg-error/5 p-4 text-body-sm text-error"
          >
            {searchError}
          </div>
        )}

        {/* Loading Indicator */}
        {isSearching && (
          <div className="py-16 text-center space-y-3">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-primary border-r-transparent" />
            <p className="text-body-md text-muted">Searching for available train journeys…</p>
          </div>
        )}

        {/* Search Results List */}
        {!isSearching && trains.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-title-md text-ink font-semibold">
                  Available Trains ({trains.length})
                </h2>
                {sourceStation && destinationStation && (
                  <p className="text-caption-sm text-muted mt-0.5">
                    Route: {sourceStation.name} ({sourceStation.code}) → {destinationStation.name} ({destinationStation.code})
                  </p>
                )}
              </div>
              {lastSearchParams && (
                <span className="text-caption-sm text-muted">
                  Date: {lastSearchParams.journeyDate}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {trains.map((train) => (
                <TrainResultCard
                  key={train.journeyId}
                  train={train}
                  sourceStation={sourceStation}
                  destinationStation={destinationStation}
                  onSelectSeats={handleSelectTrain}
                  isSelected={selectedTrain?.journeyId === train.journeyId}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty Search Result State */}
        {!isSearching && lastSearchParams && trains.length === 0 && !searchError && (
          <div className="py-16 text-center border border-dashed border-hairline rounded-xl p-8">
            <svg
              className="mx-auto h-12 w-12 text-muted mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
              <path d="M15 9l-6 6M9 9l6 6" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <h3 className="text-title-md text-ink font-semibold">No Trains Found</h3>
            <p className="text-body-sm text-muted mt-1">
              No train schedules match your selected stations and date. Try adjusting your search.
            </p>
          </div>
        )}

        {/* Seat Picker Section */}
        {selectedTrain && (
          <div className="pt-4 scroll-mt-20">
            <SeatMapPicker
              train={selectedTrain}
              allSeats={allSeats}
              totalCoaches={totalCoaches}
              currentCoach={currentCoach}
              totalAvailableSeats={totalAvailableSeats}
              totalBookedSeats={totalBookedSeats}
              selectedSeatIds={selectedSeatIds}
              onToggleSeat={toggleSeat}
              onSwitchCoach={switchCoach}
              isLoading={isLoadingSeats}
              error={seatError}
            />
          </div>
        )}
      </main>

      {/* Persistent Bottom Checkout Summary Drawer */}
      <BookingCheckoutDrawer
        train={selectedTrain}
        selectedSeats={selectedSeats}
        searchParams={lastSearchParams}
        sourceStation={sourceStation}
        destinationStation={destinationStation}
        onProceedToPayment={handleProceedToPayment}
        onClearSeats={clearSelectedSeats}
        onRemoveSeat={toggleSeat}
        isBooking={isBooking}
        error={bookingError}
      />
    </div>
  );
}
