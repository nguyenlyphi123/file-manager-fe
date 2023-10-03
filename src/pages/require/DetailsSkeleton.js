import { Box, Grid, Skeleton } from '@mui/material';

export default function DetailsSkeleton() {
  return (
    <Box className='bg-white rounded-lg w-[100%] h-[100%] py-5 px-7'>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={7}>
          <Skeleton variant='text' width={300} height={40} animation='wave' />
          <div className='mt-5 mb-3 flex flex-col'>
            <Skeleton variant='text' width={50} height={30} animation='wave' />
            <Skeleton variant='text' width={200} height={30} animation='wave' />
            <Skeleton variant='text' width={200} height={30} animation='wave' />
          </div>
          <div className='mb-3 flex flex-col'>
            <Skeleton variant='text' width={50} height={30} animation='wave' />
            <Skeleton variant='text' width={200} height={30} animation='wave' />
            <Skeleton variant='text' width={200} height={30} animation='wave' />
          </div>
          <Skeleton
            variant='text'
            sx={{ width: '100%' }}
            height={5}
            animation='wave'
          />
          <div className='flex'>
            <Skeleton variant='text' width={50} height={50} animation='wave' />
          </div>
          <div>
            <Skeleton variant='text' width={50} height={50} animation='wave' />
          </div>
          <Skeleton
            variant='text'
            sx={{ width: '100%' }}
            height={5}
            animation='wave'
          />
          <div className='flex justify-between'>
            <Skeleton
              variant='text'
              sx={{ width: '30%' }}
              height={50}
              animation='wave'
            />
            <Skeleton
              variant='text'
              sx={{ width: '30%' }}
              height={50}
              animation='wave'
            />
            <Skeleton
              variant='text'
              sx={{ width: '30%' }}
              height={50}
              animation='wave'
            />
          </div>
        </Grid>

        <Grid item xs={12} sm={5}>
          <div className='mb-1'>
            <Skeleton variant='text' width={100} height={50} animation='wave' />
          </div>
          <div>
            <Skeleton
              variant='text'
              sx={{ width: '100%' }}
              height={70}
              animation='wave'
            />
          </div>
          <div className='flex flex-col mt-1'>
            <Skeleton variant='text' width={100} height={30} animation='wave' />
            <Skeleton variant='text' width={100} height={30} animation='wave' />
          </div>
          <Skeleton
            variant='text'
            sx={{ width: '100%' }}
            height={200}
            animation='wave'
          />
        </Grid>
      </Grid>
    </Box>
  );
}
