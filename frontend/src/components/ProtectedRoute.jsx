import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import your hook

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  
  if (!token) {
    // replace: true prevents the user from clicking "back" into the dashboard
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;