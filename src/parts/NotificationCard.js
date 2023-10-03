import { Card, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';
import { FormattedDate, calcTimeRemain } from 'utils/helpers/TypographyHelper';

export default function NotificationCard({ onClick, type, data }) {
  const [more, setMore] = useState(false);

  return (
    <MenuItem
      onClick={onClick}
      sx={{
        whiteSpace: 'break-spaces',
        '&:hover': {
          bgcolor: 'transparent',
          '& .MuiCard-root': {
            transform: 'scale(1.02)',
            transition: 'all 0.2s ease',
          },
        },
      }}
    >
      <Card sx={{ width: '300px', px: 1.5, py: 1.5 }}>
        <Typography sx={{ fontSize: '10px' }} color='text.secondary'>
          New requirement from {data?.author?.info?.name}
        </Typography>

        <Typography sx={{ fontSize: '14px', mt: 1 }}>{data?.title}</Typography>

        <Typography sx={{ fontSize: '12px' }} color='text.secondary'>
          {data?.message}
        </Typography>

        {more ? (
          data?.note && (
            <Typography sx={{ fontSize: '12px', mt: 1 }} color='text.secondary'>
              * {data?.note}
            </Typography>
          )
        ) : (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setMore(true);
            }}
          >
            <Typography
              sx={{
                '&:hover': {
                  color: 'primary.main',
                },
              }}
              color='text.secondary'
            >
              ...
            </Typography>
          </div>
        )}

        <div className='flex justify-between items-center mt-3'>
          <Typography sx={{ fontSize: '11px' }} color='text.secondary'>
            Required {FormattedDate(data?.createAt)}
          </Typography>

          <Typography sx={{ fontSize: '11px' }} color='text.secondary'>
            {calcTimeRemain(data?.endDate) === 'Expired'
              ? 'Expired'
              : `Remain: ${calcTimeRemain(data?.endDate)}`}
          </Typography>
        </div>
      </Card>
    </MenuItem>
  );
}
