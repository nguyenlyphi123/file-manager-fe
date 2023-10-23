import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = ({ ...rest }) => {
  const location = useLocation();

  const user = useSelector((state) => state.user);

  return user.isAuthenticated ? (
    <Outlet {...rest} />
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};

export default PrivateRoute;
