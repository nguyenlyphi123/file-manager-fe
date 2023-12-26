import { Alert, Grid, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getGroupedInformationByManager } from 'services/informationController';

import Loading from 'parts/Loading';
import MemberCard from '../MemberCard';

function ManagerView() {
  const { data: information, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: () => getGroupedInformationByManager(),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Loading />;

  return (
    <div className='flex flex-col gap-2'>
      {information?.data?.map((info) => {
        if (!info._id && info.members?.length !== 0) {
          return (
            <div key={info.name} className='w-full p-2 flex'>
              <Paper variant='outlined' className='h-full w-full p-3'>
                <Alert severity='info' sx={{ mb: 2 }}>
                  The following members are not assigned to any group.
                </Alert>
                <Grid container spacing={1}>
                  {info.members?.map((mem) => (
                    <Grid key={mem._id} item xs={6} sm={4} md={3}>
                      <MemberCard data={mem} assign assignRole />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </div>
          );
        }

        return info.members?.map((mem) => (
          <div key={mem?._id} className='w-full p-2 flex'>
            <Paper variant='outlined' className='h-full w-full p-3'>
              <div className='flex justify-center items-center w-full mb-5 mt-2'>
                <p className='text-xl text-gray-700 italic'>{info.name}</p>
              </div>
              {mem.members.length > 0 ? (
                <Grid container spacing={1}>
                  {mem.members?.map((m) => (
                    <Grid key={m._id} item xs={6} sm={6} md={3}>
                      <MemberCard data={m} role={m.role} move />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <div className='min-h-[100px] flex justify-center items-center'>
                  <p className='text-sm text-gray-700 italic'>
                    Chưa có thành viên
                  </p>
                </div>
              )}
            </Paper>
          </div>
        ));
      })}
    </div>
  );
}

export default ManagerView;
