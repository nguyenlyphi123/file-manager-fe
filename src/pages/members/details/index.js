import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getInformationById } from 'services/informationController';

function MemberDetails({ data }) {
  console.log(data);
  const { data: information } = useQuery({
    queryKey: ['member-information'],
    queryFn: () => getInformationById(data._id),
    enabled: !!data._id,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return (
    <Box className='bg-white shadow-md rounded-lg w-[60%] min-h-[400px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] overflow-hidden py-5 px-7'>
      <Typography
        variant='span'
        className='text-[18px] text-gray-600 font-bold'
      >
        Details
      </Typography>
    </Box>
  );
}

export default MemberDetails;
