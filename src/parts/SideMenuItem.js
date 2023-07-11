import React from 'react';
import { Link } from 'react-router-dom';

export default function SideMenuItem({
  onClick,
  to,
  className,
  children,
  show = true,
}) {
  if (!show) return null;

  return (
    <Link onClick={onClick} to={to} className={className}>
      {children}
    </Link>
  );
}
