import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import MyBookingsPage from "./pages/MyBookingsPage.jsx";
import OrderReceiptPage from "./pages/OrderReceiptPage.jsx";
import SingleTicketPage from "./pages/SingleTicketPage.jsx";
import TicketLookupPage from "./pages/TicketLookupPage.jsx";
import PaymentSuccessPage from "./pages/PaymentSuccessPage.jsx";
import PaymentFailurePage from "./pages/PaymentFailurePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Navbar from "./components/Navbar.jsx";
import { useAuth } from "./context/useAuth.js";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />
      {children}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <BookingPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyBookingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings/:orderId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <OrderReceiptPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TicketLookupPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/:ticketId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SingleTicketPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/success"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PaymentSuccessPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/failure"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PaymentFailurePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/cancel"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PaymentFailurePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;