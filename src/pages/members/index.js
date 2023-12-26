import { ADMIN, MANAGER } from 'constants/constants';
import { useSelector } from 'react-redux';
import AdminView from './views/Admin';
import ManagerView from './views/Manager';

function Members() {
  const user = useSelector((state) => state.user);

  return (
    <div className='py-5 px-7 tracking-wide h-full'>
      <div className='text-[20px] text-gray-600 font-bold'>Members</div>

      <div className='mt-5'>
        {user?.permission === ADMIN && <AdminView />}
        {user?.permission === MANAGER && <ManagerView />}
      </div>
    </div>
  );
}

export default Members;
