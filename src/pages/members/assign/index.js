import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CustomAvatar from 'components/CustomAvatar';
import OverlayLoading from 'components/OverlayLoading';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import { useCallback, useState } from 'react';
import { FiArrowUpCircle } from 'react-icons/fi';
import {
  assignMentor,
  getListMentorInformationWithSpecialization,
} from 'services/informationController';
import { getMajors } from 'services/majorController';
import { getSpecializationByMajor } from 'services/specializationController';

function AssignMember({ member, handleClose }) {
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState({
    major: undefined,
    specialization: undefined,
    mentor: undefined,
  });

  const { data: majors, isFetching: mFetching } = useQuery({
    queryKey: ['majors'],
    queryFn: () => getMajors(),
    refetchOnWindowFocus: false,
  });

  const { data: specializations, isFetching: sFetching } = useQuery({
    queryKey: ['specializations', { majorId: selected?.major?._id }],
    queryFn: (params) => {
      const { majorId } = params.queryKey[1];

      if (!majorId) return;

      return getSpecializationByMajor(majorId);
    },
    enabled: !!selected?.major?._id,
    refetchOnWindowFocus: false,
  });

  const { data: mentors, isFetching: mtFetching } = useQuery({
    queryKey: [
      'mentors',
      { specializationId: selected?.specialization?._id || null },
    ],
    queryFn: (params) => {
      const { specializationId } = params.queryKey[1];

      if (!specializationId) return;

      return getListMentorInformationWithSpecialization(specializationId);
    },
    enabled: !!selected?.specialization?._id,
    refetchOnWindowFocus: false,
  });

  const handleSelect = (key, value) => {
    setSelected((prev) => ({ ...prev, [key]: value }));
  };

  const handleReturn = (key) => {
    switch (key) {
      case 'major':
        setSelected((prev) => ({
          ...prev,
          specialization: undefined,
          mentor: undefined,
        }));
        break;

      case 'specialization':
        setSelected((prev) => ({ ...prev, mentor: undefined }));
        break;

      default:
        break;
    }
  };

  const handleBack = () => {
    const selectedKeys = Object.entries(selected).filter(
      ([key, value]) => value !== undefined,
    );

    setSelected((prev) => ({
      ...prev,
      [selectedKeys[selectedKeys.length - 1][0]]: undefined,
    }));
  };

  const handleAssign = useMutation({
    mutationFn: (mid) => {
      const payload = {
        mentor_id: mid,
        member_id: member._id,
        major_id: selected.major._id,
        spec_id: selected.specialization._id,
      };

      return assignMentor(payload);
    },
    onSuccess: () => {
      handleClose();
      queryClient.invalidateQueries(['members']);
      SuccessToast('Member assigned successfully');
    },
    onError: (error) => {
      console.log(error);
      ErrorToast('Failed to assign member');
    },
  });

  const renderSelector = useCallback(() => {
    if (selected?.specialization) {
      return (
        <MentorSelector data={mentors?.data} handleSelect={handleAssign} />
      );
    }

    if (selected?.major) {
      return (
        <PositionSelector
          data={specializations?.data}
          handleSelect={handleSelect}
          name='specialization'
        />
      );
    }

    return (
      <PositionSelector
        data={majors?.data}
        handleSelect={handleSelect}
        name='major'
      />
    );
  }, [selected, majors, specializations, mentors, handleAssign]);

  return (
    <Box className='bg-white shadow-md rounded-lg w-[60%] min-h-[400px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] overflow-hidden py-5 px-7'>
      <Typography
        variant='span'
        className='text-[18px] text-gray-600 font-bold'
      >
        Assign Member
      </Typography>
      {selected?.major && (
        <div className='mt-2 h-fit'>
          {Object.entries(selected).map(([key, value]) => {
            if (key === 'major')
              return (
                <Typography
                  key={key}
                  variant='span'
                  className='text-[13px] text-gray-600 font-bold italic !mt-3 cursor-pointer'
                  onClick={handleReturn.bind(this, key)}
                >
                  {value ? `${value.name} ` : ''}
                </Typography>
              );
            return (
              <Typography
                key={key}
                variant='span'
                className='text-[13px] text-gray-600 font-bold italic !mt-3 cursor-pointer'
                onClick={handleReturn.bind(this, key)}
              >
                {value ? ` < ${value.name} ` : ''}
              </Typography>
            );
          })}
          <IconButton size='small' onClick={handleBack}>
            <FiArrowUpCircle />
          </IconButton>
        </div>
      )}
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
        {mFetching || sFetching || mtFetching ? (
          <OverlayLoading />
        ) : (
          renderSelector()
        )}
      </Grid>
    </Box>
  );
}

const PositionSelector = ({ data, handleSelect, name }) => {
  if (!data || data?.length === 0) {
    return (
      <p className='italic w-full text-center text-gray-600 text-sm mt-2'>
        Data is not availble!
      </p>
    );
  }

  return data?.map((m) => (
    <Grid key={m._id} item md={3}>
      <Paper
        variant='outlined'
        className='w-full min-h-[200px] flex justify-center items-center border cursor-pointer px-2 hover:bg-gray-100/50 duration-100'
        component={Box}
        onClick={handleSelect.bind(this, name, m)}
      >
        <Typography
          variant='span'
          className='font-semibold text-center text-gray-700'
        >
          {m.name}
        </Typography>
      </Paper>
    </Grid>
  ));
};

const MentorSelector = ({ data, handleSelect }) => {
  if (!data || data?.length === 0) {
    return (
      <p className='italic w-full text-center text-gray-600 text-sm mt-2'>
        Data is not availble!
      </p>
    );
  }

  return data?.map((m) => (
    <Grid key={m._id} item md={4}>
      <Paper
        variant='outlined'
        className='w-full p-2 py-4 px-6 flex flex-col justify-center items-center'
      >
        <CustomAvatar
          width={50}
          height={50}
          text={m.name}
          fontSize={16}
          image={m.image}
        />

        <Typography
          variant='p'
          sx={{
            mt: 2,
            fontSize: 16,
            fontWeight: 500,
            fontFamily: 'sans-serif',
            color: '#001737',
          }}
        >
          {m.name}
        </Typography>

        <div className='w-full text-center overflow-hidden text-ellipsis'>
          <Typography
            variant='p'
            sx={{ color: '#1976D2', fontStyle: 'italic', fontSize: 14 }}
          >
            {m.email}
          </Typography>
        </div>

        <Button
          variant='outlined'
          size='small'
          sx={{ textTransform: 'none', width: '100%', mt: 3 }}
          onClick={() => handleSelect.mutate(m._id)}
        >
          Select
        </Button>
      </Paper>
    </Grid>
  ));
};

export default AssignMember;
