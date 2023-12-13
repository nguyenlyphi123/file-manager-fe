import { Alert, Grid, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  getGroupedInformationByAdmin,
  getGroupedInformationByManager,
} from 'services/informationController';

import Loading from 'parts/Loading';

import MemberCard from './MemberCard';
import MentorCard from './MentorCard';
import { useSelector } from 'react-redux';
import { ADMIN, MANAGER } from 'constants/constants';

function Members() {
  const user = useSelector((state) => state.user);

  const { data: information, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: () =>
      user.permission === MANAGER
        ? getGroupedInformationByManager()
        : getGroupedInformationByAdmin(),
    refetchOnWindowFocus: false,
    enabled: user.permission === MANAGER || user.permission === ADMIN,
  });

  if (isLoading) return <Loading />;

  return (
    <div className='py-5 px-7 tracking-wide h-full'>
      <div className='text-[20px] text-gray-600 font-bold'>Members</div>

      <div className='mt-5'>
        <div className='flex flex-col gap-2'>
          {information?.data?.map((info) => {
            if (!info._id && info.members?.length !== 0) {
              if (user.permission === ADMIN) {
                return (
                  <div key={info.name} className='w-full p-2 flex'>
                    <Paper variant='outlined' className='h-full w-full p-3'>
                      <Alert severity='info' sx={{ mb: 2 }}>
                        The following members are not assigned to any group.
                      </Alert>
                      <Grid container spacing={1}>
                        {info.members?.map((mem) => (
                          <Grid key={mem._id} item xs={6} sm={4} md={3}>
                            <MemberCard data={mem} assign role />
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </div>
                );
              } else return null;
            }

            return info.members?.map((mem) => (
              <div key={mem?._id} className='min-h-[350px] w-full p-2 flex'>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={4}>
                    <MentorCard data={mem} position={info.name} />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Paper variant='outlined' className='h-full w-full p-3'>
                      <Grid container spacing={1}>
                        {mem.members?.map((m) => (
                          <Grid key={m._id} item xs={6} sm={6} md={4}>
                            <MemberCard data={m} />
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </div>
            ));
          })}
        </div>
      </div>
    </div>
  );
}

export default Members;
