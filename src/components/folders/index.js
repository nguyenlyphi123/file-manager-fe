import React, { useEffect } from 'react';
import { TiArrowSortedDown } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { locationSelector, pushTab } from 'redux/slices/location';

import { CustomedBreadcrumbs } from 'components/Breadcrumbs';

export default function Folders() {
  // redux
  const folderLocation = useSelector(locationSelector);

  // dispatch action redux
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(pushTab('Folders'));
  }, []);

  return (
    <>
      <div className='min-h-[calc(100vh-142px)] py-5 px-7 tracking-wide relative'>
        <CustomedBreadcrumbs location={folderLocation} />
        <div className='mt-5 min-h-[calc(100vh-142px-90px)] flex flex-col'>
          <Outlet />
        </div>
      </div>
    </>
  );
}
