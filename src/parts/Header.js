import { FiFolder } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import HeaderDropdown from './HeaderDropdown';
import Notification from './Notification';

export default function Header() {
  return (
    <div className='bg-white flex justify-between items-center border-b border-gray-300 border-solid p-5 pl-6 pr-6 h-[80px] sticky top-0 z-10'>
      <Link to='' className='flex items-center cursor-pointer'>
        <div className='bg-[#efecff] p-2 rounded-full flex items-center content-center'>
          <FiFolder className='text-[#816bff] text-2xl' />
        </div>

        <p className='font-bold ml-2 text-gray-600'>File Manager</p>
      </Link>

      <div className='flex items-center'>
        <Notification />
        <HeaderDropdown />
      </div>
    </div>
  );
}
