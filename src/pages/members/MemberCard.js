import { Paper, Typography, Button } from '@mui/material';

import { GrUserAdmin } from 'react-icons/gr';

import ModalButton from 'components/ModalButton';
import AssignMember from './assign';
import MemberDetails from './details';
import MemberRole from './role';
import { LECTURERS, PUPIL } from 'constants/constants';

import CustomAvatar from 'components/CustomAvatar';
import MoveMember from './move';

const MemberCard = ({
  data,
  assign = false,
  assignRole = false,
  move = false,
  role = PUPIL,
}) => {
  return (
    <Paper
      variant='outlined'
      className='w-full p-2 px-6 flex flex-col justify-center items-center relative'
    >
      {role === LECTURERS && (
        <div className='absolute top-3 right-3'>
          <GrUserAdmin className='text-xl text-red-500' />
        </div>
      )}

      <CustomAvatar
        width={50}
        height={50}
        text={data.name}
        fontSize={16}
        image={data.image}
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
        {data.name}
      </Typography>

      <div className='w-full text-center overflow-hidden text-ellipsis'>
        <Typography
          variant='p'
          sx={{ color: '#1976D2', fontStyle: 'italic', fontSize: 14 }}
        >
          {data.email}
        </Typography>
      </div>

      {assign ? (
        <ModalButton
          trigger={
            <Button
              variant='outlined'
              size='small'
              sx={{ textTransform: 'none', width: '100%', mt: 3 }}
            >
              Assign
            </Button>
          }
        >
          {(handleClose) => (
            <AssignMember member={data} handleClose={handleClose} />
          )}
        </ModalButton>
      ) : (
        <ModalButton
          trigger={
            <Button
              variant='outlined'
              size='small'
              sx={{ textTransform: 'none', width: '100%', mt: 3 }}
            >
              View Detail
            </Button>
          }
        >
          <MemberDetails data={data} />
        </ModalButton>
      )}

      {assignRole && (
        <ModalButton
          trigger={
            <Button
              variant='outlined'
              size='small'
              sx={{ textTransform: 'none', width: '100%', mt: 1 }}
              color='error'
            >
              Role
            </Button>
          }
        >
          {(handleClose) => (
            <MemberRole member={data} handleClose={handleClose} />
          )}
        </ModalButton>
      )}

      {move && (
        <ModalButton
          trigger={
            <Button
              variant='outlined'
              size='small'
              sx={{ textTransform: 'none', width: '100%', mt: 1 }}
              color='error'
            >
              Move
            </Button>
          }
        >
          {(handleClose) => (
            <MoveMember member={data} handleClose={handleClose} />
          )}
        </ModalButton>
      )}
    </Paper>
  );
};

export default MemberCard;
