import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link as StyledLink } from '@mui/material';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { pushLocation } from 'redux/slices/location';
import { resetCurrentFolder } from 'redux/slices/curentFolder';

export const CustomedBreadcrumbs = ({ location }) => {
  const dispatch = useDispatch();

  return (
    <div role='presentation'>
      <Breadcrumbs aria-label='breadcrumb' separator='›' maxItems={3}>
        <Link to=''>
          <StyledLink
            underline='hover'
            color='inherit'
            fontSize={20}
            fontWeight='bold'
            onClick={() => dispatch(resetCurrentFolder())}
          >
            {location.tab}
          </StyledLink>
        </Link>
        {location.items.map((item) => {
          return (
            <Link
              key={item._id}
              to={item.href}
              onClick={() => dispatch(pushLocation({ _id: item._id }))}
              state={{ folder: item }}
            >
              <StyledLink
                underline='hover'
                color='inherit'
                fontSize={14}
                fontWeight='bold'
              >
                {item.name}
              </StyledLink>
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};
