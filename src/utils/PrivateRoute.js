import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ ...rest }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || location.state?.action === 'LOGOUT') {
      navigate('/login', { state: { action: 'LOGOUT' } });
      return;
    }
  }, [isAuthenticated, location.state?.action, navigate]);

  return isAuthenticated ? (
    <Outlet {...rest} />
  ) : (
    <Navigate to='/login' state={{ from: { pathname: location } }} replace />
  );
};

export default PrivateRoute;
