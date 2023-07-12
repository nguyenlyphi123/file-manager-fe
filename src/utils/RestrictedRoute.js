import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RestrictedRoute = ({ ...rest }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();

  return isAuthenticated ? (
    <Outlet {...rest} />
  ) : (
    <Navigate to='/login' state={{ from: { pathname: location } }} replace />
  );
};

export default RestrictedRoute;
