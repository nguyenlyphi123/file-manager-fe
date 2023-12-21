import { Box, Chip, Divider, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import CustomAvatar from 'components/CustomAvatar';
import React from 'react';
import { getInformationById } from 'services/informationController';
import { renderPermission } from 'utils/helpers/Helper';

function MemberDetails({ data }) {
  console.log(data);
  const { data: information } = useQuery({
    queryKey: ['member-information'],
    queryFn: () => getInformationById(data._id),
    enabled: !!data._id,
    refetchOnWindowFocus: false,
    retry: false,
  });

  console.log(information?.data);

  return (
    <Box className='bg-white shadow-md rounded-lg min-w-[30%] min-h-[400px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] overflow-hidden py-5 pb-7 px-7'>
      <Typography
        variant='span'
        className='text-[18px] text-gray-600 font-bold'
      >
        Details
      </Typography>
      <div className='flex flex-col items-center'>
        <div className='flex flex-col items-center h-full mt-5'>
          <CustomAvatar
            image={information?.data?.image}
            text={information?.data?.name}
            fontSize={30}
            width={130}
            height={130}
          />
          <span className='flex justify-center items-center text-[20px] text-gray-700 italic mt-2 cursor-pointer'>
            {information?.data?.name}
          </span>
        </div>

        <div className='w-[80%] mt-8'>
          <Divider className='mt-5' textAlign='center'>
            <span className='flex justify-center items-center text-[13px] text-gray-500'>
              Role
            </span>
          </Divider>
          <div className='text-black text-opacity-80 m-2 flex justify-center'>
            <Chip
              label={renderPermission[information?.data?.permission]?.label}
              color={renderPermission[information?.data?.permission]?.color}
            />
          </div>

          {information?.data?.major && (
            <>
              <Divider className='mt-5' textAlign='center'>
                <span className='flex justify-center items-center text-[13px] text-gray-500'>
                  Major
                </span>
              </Divider>
              <div className='text-black text-opacity-80 m-2 flex justify-center'>
                <Chip
                  label={information?.data?.major?.name}
                  color={
                    renderPermission[information?.data?.account_id?.permission]
                      ?.color
                  }
                />
              </div>
            </>
          )}

          {information?.data?.specialization?.length > 0 && (
            <>
              <Divider className='mt-5' textAlign='center'>
                <span className='flex justify-center items-center text-[13px] text-gray-500'>
                  Specialization
                </span>
              </Divider>
              <div className='text-black text-opacity-80 m-2 flex justify-center gap-1'>
                {information?.data?.specialization?.map((item) => (
                  <Chip
                    key={item._id}
                    label={item.name}
                    color={
                      renderPermission[information?.data?.permission]?.color
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Box>
  );
}

export default MemberDetails;
