import Tabs from 'components/Tabs';
import React, { useMemo } from 'react';
import AccountSetting from './account';

export default function Settings() {
  const menu = useMemo(
    () => [
      {
        label: 'Account Information',
        value: 'account',
        component: <AccountSetting />,
      },
      // {
      //   label: 'Change Password',
      //   value: 'password',
      //   component: <AccountSetting />,
      // },
    ],
    [],
  );

  return (
    <div className='py-5 px-7 tracking-wide h-full'>
      <div className='text-[20px] text-gray-600 font-bold'>Settings</div>

      <div className='mt-5 h-[90%] relative'>
        <Tabs menu={menu} />
      </div>
    </div>
  );
}
