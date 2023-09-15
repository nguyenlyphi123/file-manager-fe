import { Box, Card, CardContent, Tooltip, Typography } from '@mui/material';
import { REQ_STATUS_CANCEL, REQ_STATUS_PROCESSING } from 'constants/constants';
import { useCallback } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { BsFileEarmarkFill, BsFillClockFill } from 'react-icons/bs';
import { FaFolder } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { renderBottomColor } from 'utils/helpers/Helper';
import { calcTimeRemain } from 'utils/helpers/TypographyHelper';
import CardSkeleton from './CardSkeleton';

function InProgress({ data, handleClick, isFetching }) {
  const user = useSelector((state) => state.user);

  const isExpired = useCallback(
    (time) => calcTimeRemain(time) === 'Expired',
    [],
  );

  const processStatus = useCallback(
    (arr) => {
      if (isExpired(arr.endDate)) return REQ_STATUS_CANCEL;

      if (user.id === arr.author._id) return REQ_STATUS_PROCESSING;

      const mem = arr?.to?.find((mem) => mem.info._id === user.id);
      return mem?.status;
    },
    [user.id, isExpired],
  );

  console.log(data);

  return (
    <Droppable droppableId='processing' type='group'>
      {(provided) => (
        <Box
          sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1, padding: 1 }}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <Typography
            sx={{ fontSize: '18px', fontWeight: '600', ml: 1 }}
            color='text.secondary'
          >
            In Progress
          </Typography>
          <Box sx={{ marginY: 1 }}>
            {isFetching && <CardSkeleton />}

            {data?.map((require, index) => (
              <Draggable
                key={require._id}
                draggableId={require._id}
                index={index}
              >
                {(provided) => (
                  <Card
                    sx={{
                      boxShadow: 'none',
                      borderRadius: '5px',
                      my: 0.5,
                      borderBottom: `5px solid ${renderBottomColor(
                        processStatus(require),
                      )}`,
                    }}
                    className='cursor-pointer border'
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    onClick={() => handleClick(require)}
                  >
                    <CardContent>
                      <Typography variant='h6'>{require.title}</Typography>
                      <Typography
                        sx={{ fontSize: '14px' }}
                        color='text.secondary'
                      >
                        {require.message}
                      </Typography>
                      {require.note && (
                        <Typography
                          sx={{ fontSize: '13px', mt: 1 }}
                          color='text.secondary'
                        >
                          {require.note}
                        </Typography>
                      )}
                      <div className='flex items-center mt-5'>
                        <Tooltip title='Folder' placement='top'>
                          <div className='flex items-center mr-3'>
                            <FaFolder color='#8AA3FF' />{' '}
                            <Typography
                              sx={{ fontSize: '14px', ml: 0.5 }}
                              color='#8AA3FF'
                            >
                              {require.folder?.name}
                            </Typography>
                          </div>
                        </Tooltip>

                        <Tooltip title='Remain' placement='top'>
                          <div className='flex items-center mr-3'>
                            <BsFillClockFill color='#8AA3FF' />{' '}
                            <Typography
                              sx={{ fontSize: '14px', ml: 0.5 }}
                              color='#8AA3FF'
                            >
                              {calcTimeRemain(require.endDate)}
                            </Typography>
                          </div>
                        </Tooltip>

                        <Tooltip title='File type' placement='top'>
                          <div className='flex items-center'>
                            <BsFileEarmarkFill color='#8AA3FF' />
                            <Typography
                              sx={{ fontSize: '14px', ml: 0.5 }}
                              color='#8AA3FF'
                            >
                              {require.file_type}
                            </Typography>
                          </div>
                        </Tooltip>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        </Box>
      )}
    </Droppable>
  );
}

export default InProgress;
