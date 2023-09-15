import { memo, useLayoutEffect, useState } from 'react';
import { Router } from 'react-router-dom';
import AxiosInterceptor from 'utils/lib/AxiosInterceptor';

const CustomRouter = ({ history, ...props }) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  AxiosInterceptor();

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      {...props}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};

export default memo(CustomRouter);
