import { AiOutlineHome, AiOutlineShareAlt } from 'react-icons/ai';
import {
  FiFile,
  FiFolder,
  FiSettings,
  FiStar,
  FiTrash,
  FiUsers,
} from 'react-icons/fi';

import SideMenuItem from 'parts/SideMenuItem';
import { FaTasks } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { ADMIN, MANAGER } from 'constants/constants';

export default function SideMenu() {
  const user = useSelector((state) => state.user);

  return (
    <div className='p-3 sm:w-[80px] lg:w-2/12 bg-white border-r border-gray-300 border-solid sticky top-16'>
      <SideMenuItem to=''>
        <div className='text-[#8094AE] text-xl font-bold mr-4'>
          <AiOutlineHome />
        </div>

        <div className='text-[#526484] text-md font-medium hidden lg:block'>
          Home
        </div>
      </SideMenuItem>

      <SideMenuItem to='files'>
        <div className='text-[#8094AE] text-xl font-bold mr-4'>
          <FiFile />
        </div>

        <div className='text-[#526484] text-md font-medium hidden lg:block'>
          Files
        </div>
      </SideMenuItem>

      <SideMenuItem to='folders'>
        <div className='text-[#8094AE] text-xl font-bold mr-4'>
          <FiFolder />
        </div>

        <div className='text-[#526484] text-md font-medium hidden lg:block'>
          Folders
        </div>
      </SideMenuItem>

      <SideMenuItem to='starred'>
        <div className='text-[#8094AE] text-xl font-bold mr-4'>
          <FiStar />
        </div>

        <div className='text-[#526484] text-md font-medium hidden lg:block'>
          Starred
        </div>
      </SideMenuItem>

      <SideMenuItem to='shared'>
        <div className='text-[#8094AE] text-xl font-bold mr-4'>
          <AiOutlineShareAlt />
        </div>

        <div className='text-[#526484] text-md font-medium hidden lg:block'>
          Shared
        </div>
      </SideMenuItem>

      <SideMenuItem to='recovery'>
        <div className='text-[#8094AE] text-xl font-bold mr-4'>
          <FiTrash />
        </div>

        <div className='text-[#526484] text-md font-medium hidden lg:block'>
          Recovery
        </div>
      </SideMenuItem>

      <SideMenuItem to='require'>
        <div className='text-[#8094AE] text-xl font-bold mr-4'>
          <FaTasks />
        </div>

        <div className='text-[#526484] text-md font-medium hidden lg:block'>
          Require
        </div>
      </SideMenuItem>

      <SideMenuItem
        to='members'
        show={user.permission === ADMIN || user.permission === MANAGER}
      >
        <div className='text-[#8094AE] text-xl font-bold mr-4'>
          <FiUsers />
        </div>

        <div className='text-[#526484] text-md font-medium hidden lg:block'>
          Members
        </div>
      </SideMenuItem>

      <SideMenuItem to='settings'>
        <div className='text-[#8094AE] text-xl font-bold mr-4'>
          <FiSettings />
        </div>

        <div className='text-[#526484] text-md font-medium hidden lg:block'>
          Settings
        </div>
      </SideMenuItem>
    </div>
  );
}
