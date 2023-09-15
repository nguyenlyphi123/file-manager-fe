import { Outlet } from 'react-router-dom';

const RestrictedRoute = ({ show = true, ...rest }) => {
  return show ? <Outlet {...rest} /> : 'Unauthorized access !!!';
};

export default RestrictedRoute;
