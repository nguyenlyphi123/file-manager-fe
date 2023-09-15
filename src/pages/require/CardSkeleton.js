import { Card, CardContent, Skeleton } from '@mui/material';

const CardSkeleton = () => {
  return (
    <Card
      sx={{
        boxShadow: 'none',
        borderRadius: '5px',
        my: 0.5,
      }}
      className='cursor-pointer border'
    >
      <CardContent>
        <Skeleton animation='wave' height={50} />
        <Skeleton animation='wave' />
        <Skeleton animation='wave' />
        <div className='flex items-center mt-5'>
          <Skeleton animation='wave' width={(1 / 3) * 100} className='mr-3' />
          <Skeleton animation='wave' width={(1 / 3) * 100} className='mr-3' />
          <Skeleton animation='wave' width={(1 / 3) * 100} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CardSkeleton;
