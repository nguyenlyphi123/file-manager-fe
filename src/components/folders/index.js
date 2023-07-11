import React, { useEffect } from 'react';
import { TiArrowSortedDown } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { locationSelector, pushTab } from '../../redux/slices/location';
import { CustomedBreadcrumbs } from '../Breadcrumbs';

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
      <div className='h-[200vh] py-5 px-7 tracking-wide'>
        <CustomedBreadcrumbs location={folderLocation} />
        <div className='mt-5'>
          <div className='flex items-center mb-4'>
            <p className='text-sm text-gray-500 font-semibold mr-2'>
              Last Opened
            </p>
            <TiArrowSortedDown className='text-gray-500' />
          </div>

          <Outlet />
        </div>
      </div>
    </>
  );
}
