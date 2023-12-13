import ModalButton from 'components/ModalButton';
import MemberDetails from './details';

const { Paper, Typography, Button } = require('@mui/material');
const { default: CustomAvatar } = require('components/CustomAvatar');

const MentorCard = ({ data, position }) => {
  return (
    <Paper
      variant='outlined'
      className='h-full max-h-[350px] w-full p-2 px-6 flex flex-col justify-center items-center'
    >
      <CustomAvatar
        width={90}
        height={90}
        text={data.name}
        fontSize={20}
        image={data.image}
      />

      <Typography
        variant='p'
        sx={{
          mt: 3,
          fontSize: 20,
          fontWeight: '500',
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

      <Typography
        variant='p'
        sx={{
          mt: 2,
          color: 'GrayText',
          fontFamily: 'sans-serif',
          fontSize: 14,
          letterSpacing: '0.5px',
        }}
      >
        {position}
      </Typography>

      <ModalButton
        trigger={
          <Button
            variant='outlined'
            size='small'
            sx={{ textTransform: 'none', width: '100%', mt: 5 }}
          >
            View Detail
          </Button>
        }
      >
        <MemberDetails data={data} />
      </ModalButton>
    </Paper>
  );
};

export default MentorCard;
