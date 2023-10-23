import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { resetCurrentFolder } from 'redux/slices/curentFolder';
import { pushLocation } from 'redux/slices/location';

export const CustomedBreadcrumbs = ({ location }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleToFolders = () => {
    navigate('/folders');
    dispatch(resetCurrentFolder());
  };

  return (
    <div role='presentation'>
      <Breadcrumbs
        aria-label='breadcrumb'
        separator='›'
        maxItems={3}
        sx={{ alignItems: 'baseline' }}
      >
        <p
          className='text-[20px] font-bold hover:cursor-pointer hover:underline'
          onClick={handleToFolders}
        >
          {location.tab}
        </p>
        {location.items.map((item) => {
          return (
            <Link
              key={item._id}
              to={item.href}
              onClick={() => dispatch(pushLocation({ _id: item._id }))}
              state={{ folder: item }}
            >
              <p className='text-[14px] font-bold hover:cursor-pointer hover:underline'>
                {item.name}
              </p>
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};
