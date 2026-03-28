import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Pages
import HomePage        from './pages/HomePage';
import ShopPage        from './pages/ShopPage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import DashboardPage   from './pages/DashboardPage';
import ProfilePage     from './pages/ProfilePage';

function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div className="spinner" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={user.role === 'owner' ? '/dashboard' : '/'} replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem' } }} />
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/shop/:id"    element={<ShopPage />} />
          <Route path="/login"       element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register"    element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/dashboard"   element={<PrivateRoute role="owner"><DashboardPage /></PrivateRoute>} />
          <Route path="/profile"     element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
