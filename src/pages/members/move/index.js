import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import OverlayLoading from 'components/OverlayLoading';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  assignMentor,
  getInformationById,
} from 'services/informationController';

function MoveMember({ member, handleClose }) {
  const { id } = useSelector((state) => state.user);

  const queryClient = useQueryClient();

  const [selected, setSelected] = useState([]);

  const { data: information, isLoading } = useQuery({
    queryKey: ['information'],
    queryFn: () => getInformationById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const handleSelect = (id) => {
    setSelected(id);
  };

  const handleMove = useMutation({
    mutationFn: () =>
      assignMentor({
        member_id: member._id,
        mentor_id: id,
        spec_id: selected,
        major_id: information.data?.major?._id,
      }),
    onSuccess: () => {
      handleClose();
      SuccessToast({ message: 'Success' });
      queryClient.invalidateQueries(['members']);
    },
    onError: (e) => {
      ErrorToast({ message: e?.response?.data?.message });
    },
  });

  if (isLoading) return <OverlayLoading />;

  return (
    <Box className='bg-white shadow-md rounded-lg w-[60%] min-h-[400px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] overflow-hidden py-5 px-7'>
      <Typography
        variant='span'
        className='text-[18px] text-gray-600 font-bold'
      >
        Move Member
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          mt: 0.5,
          minHeight: 300,
          maxHeight: 500,
          overflowY: 'scroll',
        }}
      >
        {information.data?.specialization?.map((s) => (
          <Grid key={s._id} item md={3}>
            <Paper
              variant='outlined'
              className={`w-full min-h-[200px] flex justify-center items-center border cursor-pointer px-2 hover:bg-gray-100/50 duration-100 ${
                s._id === selected && '!bg-green-200'
              }`}
              component={Box}
              onClick={handleSelect.bind(this, s._id)}
            >
              <Typography
                variant='span'
                className='font-semibold text-center text-gray-700'
              >
                {s.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <div className='flex justify-end items-center'>
        <Button color='error' variant='contained' size='small'>
          Cancel
        </Button>

        <Button
          color='primary'
          variant='contained'
          size='small'
          sx={{ ml: 1 }}
          disabled={!selected}
          onClick={() => handleMove.mutate()}
        >
          Move
        </Button>
      </div>
    </Box>
  );
}

export default MoveMember;
