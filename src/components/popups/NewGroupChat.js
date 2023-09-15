import {
  Avatar,
  Box,
  Grid,
  Modal,
  Paper,
  TextField,
  Tooltip,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import {
  CLASS,
  LECTURERS,
  MANAGER,
  MEMBER,
  PUPIL,
  SPECIALIZATION,
} from 'constants/constants';
import useDebounce from 'hooks/useDebounce';
import { useMemo, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { ImSpinner } from 'react-icons/im';
import { useSelector } from 'react-redux';
import { createGroupChat } from 'services/chatController';
import { searchUser } from 'services/userController';
import ShareRenderHelper from 'utils/helpers/ShareRenderHelper';
import { Truncate } from 'utils/helpers/TypographyHelper';

function NewGroupChat({ handleClose, open }) {
  const user = useSelector((state) => state.user);

  const queryClient = useQueryClient();

  // generate component
  const initSelection = useMemo(() => {
    switch (user.permission) {
      case MANAGER:
        return SPECIALIZATION;

      case LECTURERS:
        return SPECIALIZATION;

      case PUPIL:
        return MEMBER;

      default:
        break;
    }
  }, [user.permission]);

  const [selection, setSelection] = useState(initSelection);

  // specializations selected
  const [specSelected, setSpecSelected] = useState();

  const handleSpecializeItemSelect = (specialize) => {
    setSelection(CLASS);
    setSpecSelected(specialize);
  };

  // classes selected
  const [classSelected, setClassSelected] = useState();

  const handleClassItemSelect = (class_) => {
    setSelection(MEMBER);
    setClassSelected(class_);
  };

  // return
  const handleReturn = () => {
    if (selection === SPECIALIZATION) return handleClose();
    if (selection === CLASS) return setSelection(SPECIALIZATION);
    if (selection === MEMBER) return setSelection(CLASS);
  };

  // pupil selected
  const [memberSelected, setMemberSelected] = useState([]);

  const handleMemberItemSelect = (pupil) => {
    setMemberSelected((prev) => {
      const index = prev.findIndex((item) => item._id === pupil._id);
      if (index !== -1) {
        return prev.filter((item) => item._id !== pupil._id);
      }
      return [...prev, pupil];
    });
  };

  const handleMutipleMemberSelect = (arr) => {
    if (arr.every((item) => memberSelected?.includes(item))) {
      return setMemberSelected((prev) => {
        return prev.filter((item) => !arr.includes(item));
      });
    }

    if (!memberSelected?.includes(arr)) {
      const newArr = arr?.filter((item) => !memberSelected?.includes(item));
      return setMemberSelected((prev) => [...prev, ...newArr]);
    }
  };

  // search user
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const searchDebounce = useDebounce(search, 500);

  const { data: searchResult } = useQuery({
    queryKey: ['user-search', searchDebounce],
    queryFn: () => searchUser(searchDebounce),
    enabled: Boolean(searchDebounce),
    retry: 3,
    retryDelay: 2000,
  });

  // group name
  const [groupName, setGroupName] = useState('');

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  // handle create group chat
  const handleCreate = useMutation({
    mutationFn: () => {
      if (groupName.length === 0)
        throw new Error('Group name must not be empty');

      const member = memberSelected?.map((member) => member.account_id);

      return createGroupChat({ name: groupName, member: [...member, user.id] });
    },
    onSuccess: () => {
      SuccessToast({
        message: `New group chat was created successfully`,
      });
      handleClose();
      setMemberSelected([]);
      setGroupName('');
      queryClient.invalidateQueries(['chats']);
    },
    onError: (err) => {
      ErrorToast({
        message: err.message,
      });
    },
  });

  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby='keep-mounted-modal-title'
      aria-describedby='keep-mounted-modal-description'
    >
      <Box className='bg-white shadow-md rounded-lg w-[50%] absolute top-[50%] left-[50%] translate-x-[-50%]  translate-y-[-50%] overflow-hidden'>
        <div className='border-b'>
          <div className='flex justify-between items-center py-4 px-8'>
            <div className='flex items-center'>
              <TextField
                label='Group name'
                required
                variant='standard'
                value={groupName}
                onChange={handleGroupNameChange}
                placeholder='Enter group name'
                sx={{ width: '300px' }}
                size='small'
                error={groupName.length === 0}
              />
            </div>

            <div onClick={handleClose} className='cursor-pointer'>
              <AiOutlineClose className='text-gray-700 text-lg' />
            </div>
          </div>
        </div>

        <div className='py-2 px-8 border-b'>
          <div className='flex flex-col py-2'>
            <div className='flex items-center relative'>
              <span className='text-[0.9em] text-gray-400 font-medium mr-4'>
                To
              </span>
              <input
                type='text'
                value={searchInput}
                placeholder='Email or Name'
                autoFocus
                className='p-1 w-full outline-none'
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchInput(e.target.value);
                }}
              />
              {search && searchResult?.data?.length > 0 && (
                <Paper
                  sx={{
                    position: 'absolute',
                    top: 40,
                    left: 0,
                    width: '100%',
                    zIndex: 10,
                    minHeight: '100px',
                  }}
                  className='border'
                >
                  <Grid container spacing={1} sx={{ padding: 1 }}>
                    {searchResult?.data?.map((user) => (
                      <Grid key={user._id} item xs={4} md={4} lg={4}>
                        <Tooltip title={user.email} placement='top'>
                          <div
                            onClick={() => {
                              handleMemberItemSelect(user);
                              setSearchInput('');
                              setSearch('');
                            }}
                            className='flex  items-center text-gray-700 border rounded-md px-2 py-1 cursor-pointer'
                          >
                            <Avatar
                              sx={{
                                height: '20px',
                                width: '20px',
                                marginRight: 2,
                              }}
                            />
                            <p className='text-[13px] font-semibold'>
                              {Truncate(user.email, 20)}
                            </p>
                          </div>
                        </Tooltip>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}
            </div>

            {memberSelected?.length > 0 && (
              <div className='border rounded mt-3 p-3 max-h-[200px] overflow-y-scroll'>
                <Grid container spacing={1}>
                  {memberSelected?.map((pupil) => (
                    <Grid key={pupil._id} item xs={3} md={3} lg={3}>
                      <Tooltip title={pupil.email} placement='top'>
                        <div className='flex justify-between items-center text-gray-700 border rounded-md px-2 py-1'>
                          <Avatar sx={{ height: '20px', width: '20px' }} />
                          <p className='text-[13px] font-semibold'>
                            {Truncate(pupil.email, 13)}
                          </p>
                          <AiOutlineClose
                            onClick={() => handleMemberItemSelect(pupil)}
                            className='cursor-pointer'
                          />
                        </div>
                      </Tooltip>
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}
          </div>
        </div>

        <div className='px-8 py-4'>
          {
            <ShareRenderHelper
              selection={selection}
              handleSpecSelect={handleSpecializeItemSelect}
              handleClassSelect={handleClassItemSelect}
              handleMemberSelect={handleMemberItemSelect}
              handleMutipleMemberSelect={handleMutipleMemberSelect}
              handleReturn={handleReturn}
              specData={specSelected}
              classData={classSelected}
              memberData={memberSelected}
            />
          }
        </div>

        <div className='flex justify-end items-center py-3 px-8 bg-[#E5E9F2]'>
          <div
            onClick={handleClose}
            className='bg-white py-2 px-5 rounded-md text-gray-500 text-[0.9em] font-medium mr-4 shadow-sm cursor-pointer hover:text-white hover:bg-gray-600 duration-200'
          >
            Cancel
          </div>

          <div
            onClick={() => handleCreate.mutate()}
            className='bg-blue-700/60 flex justify-center items-center py-2 px-5 min-w-[80px] h-[37px] rounded-md text-white text-[0.9em] font-medium cursor-pointer hover:bg-blue-700/80 duration-200'
          >
            {handleCreate.isLoading ? (
              <ImSpinner className='animate-spin' />
            ) : (
              'Create'
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default NewGroupChat;
