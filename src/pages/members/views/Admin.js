import { Alert, Grid, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getGroupedInformationByAdmin } from 'services/informationController';

import Loading from 'parts/Loading';

import MemberCard from '../MemberCard';
import MentorCard from '../MentorCard';

function AdminView() {
  const { data: information, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: () => getGroupedInformationByAdmin(),
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
                        <MemberCard data={m} role={m.role} />
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
  );
}

export default AdminView;
