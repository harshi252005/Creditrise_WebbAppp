import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/AuthContext';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import GrowthPredictor from './pages/GrowthPredictor';
import AddEmi from './pages/AddEmi';
import AICoach from './pages/AICoach';
import ScoreSimulator from './pages/ScoreSimulator';
import Notifications from './pages/Notifications';
import LoansEmis from './pages/LoansEmis';
import CreditReport from './pages/CreditReport';
import ScoreDropAnalysis from './pages/ScoreDropAnalysis';
import ConfirmPayment from './pages/ConfirmPayment';
import EditProfile from './pages/EditProfile';
import Profile from './pages/Profile';

// 🔥 Protected Route FIXED
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>

        {/* Public routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />

        {/* Protected route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-profile" 
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/growth" 
          element={
            <ProtectedRoute>
              <GrowthPredictor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-emi" 
          element={
            <ProtectedRoute>
              <AddEmi />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/coach" 
          element={
            <ProtectedRoute>
              <AICoach />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/simulator" 
          element={
            <ProtectedRoute>
              <ScoreSimulator />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analysis" 
          element={
            <ProtectedRoute>
              <CreditReport />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/score-drop" 
          element={
            <ProtectedRoute>
              <ScoreDropAnalysis />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/loans" 
          element={
            <ProtectedRoute>
              <LoansEmis />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/confirm-payment" 
          element={
            <ProtectedRoute>
              <ConfirmPayment />
            </ProtectedRoute>
          } 
        />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;