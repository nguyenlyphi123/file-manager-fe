import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { resetCurrentFolder } from 'redux/slices/curentFolder';
import { getTab, pushTab, removeLocation } from 'redux/slices/location';

const SideMenuItem = ({ to, className, children, show = true }) => {
  // redux
  const dispatch = useDispatch();
  const currentTab = useSelector((state) => getTab(state));

  const handleClick = (v) => {
    dispatch(pushTab(v === '' ? 'home' : v));
    dispatch(removeLocation());
    dispatch(resetCurrentFolder());
  };

  const isActive = useMemo(() => {
    if (
      (currentTab === 'home' && to === '') ||
      (currentTab === '' && to === '')
    )
      return true;

    return currentTab?.toLowerCase() === to?.toLowerCase();
  }, [currentTab, to]);

  if (!show) return null;

  return (
    <Link
      onClick={handleClick.bind(this, to)}
      to={to}
      className={`cursor-pointer flex items-center p-2 pl-4 my-2 rounded-md hover:bg-[#EFF1FF] duration-100 ${
        isActive &&
        'rounded-s-none border-l-[3px] border-[#8AA3FF] bg-[#EFF1FF]'
      } ${className}`}
    >
      {children}
    </Link>
  );
};

export default memo(SideMenuItem);
