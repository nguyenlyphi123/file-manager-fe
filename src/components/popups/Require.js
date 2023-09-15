import {
  Avatar,
  Box,
  Button,
  Chip,
  ClickAwayListener,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Modal,
  Paper,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import OverlayLoading from 'components/OverlayLoading';
import SmallFolderCard from 'components/cards/SmallFolderCard';
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
import moment from 'moment';
import { memo, useMemo, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BiUpArrow } from 'react-icons/bi';
import { ImSpinner } from 'react-icons/im';
import { useSelector } from 'react-redux';
import { getFolderDetail, getFolderList } from 'services/folderController';
import { createRequire } from 'services/requireController';
import { searchUser } from 'services/userController';
import ShareRenderHelper from 'utils/helpers/ShareRenderHelper';
import { Truncate } from 'utils/helpers/TypographyHelper';

const fileTypes = [
  {
    value: 'doc',
    label: 'Doc',
  },
  {
    value: 'docx',
    label: 'Docx',
  },
  {
    value: 'pdf',
    label: 'PDF',
  },
  {
    value: 'xlsx',
    label: 'XLSX',
  },
  {
    value: 'ppt',
    label: 'PPT',
  },
  {
    value: 'zip',
    label: 'ZIP',
  },
  {
    value: 'jpg',
    label: 'JPG',
  },
  {
    value: 'png',
    label: 'PNG',
  },
  {
    value: 'txt',
    label: 'TXT',
  },
  {
    value: 'mp3',
    label: 'MP3',
  },
  {
    value: 'mp4',
    label: 'MP4',
  },
];

const MutipleMemberSelectPopup = memo(
  ({
    open,
    handleClose,
    handleMemberSelect,
    handleMutipleMemberSelect,
    memberData,
  }) => {
    const user = useSelector((state) => state.user);

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
                <p className='text-[0.9em] text-gray-700 font-medium'>
                  Select Member
                </p>
              </div>

              <div onClick={handleClose} className='cursor-pointer'>
                <AiOutlineClose className='text-gray-700 text-lg' />
              </div>
            </div>
          </div>

          <div className='py-6 px-8'>
            <ShareRenderHelper
              selection={selection}
              handleSpecSelect={handleSpecializeItemSelect}
              handleClassSelect={handleClassItemSelect}
              handleMemberSelect={handleMemberSelect}
              handleMutipleMemberSelect={handleMutipleMemberSelect}
              handleReturn={handleReturn}
              specData={specSelected}
              classData={classSelected}
              memberData={memberData}
            />
          </div>
        </Box>
      </Modal>
    );
  },
);

const General = memo(({ handleChange, require }) => {
  return (
    <FormControl fullWidth>
      <p className='text-gray-600 text-xs font-semibold'>General</p>
      <TextField
        label='Title'
        size='small'
        name='title'
        fullWidth
        sx={{ marginY: 2 }}
        value={require.title ? require.title : ''}
        required
        onChange={handleChange}
      />
      <TextField
        select
        defaultValue='doc'
        label='File Type'
        size='small'
        name='file_type'
        fullWidth
        value={require.file_type}
        sx={{ marginY: 2 }}
        onChange={handleChange}
      >
        {fileTypes.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label='Max size'
        size='small'
        name='max_size'
        type='number'
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment className='text-gray-500' position='end'>
              MB
            </InputAdornment>
          ),
        }}
        inputProps={{
          min: 1,
          max: 100,
          inputMode: 'numeric',
          pattern: '[0-9]*',
        }}
        value={require.max_size ? require.max_size : 10}
        sx={{ marginY: 2 }}
        onChange={handleChange}
      />
      <TextField
        label='Message'
        size='small'
        name='message'
        fullWidth
        multiline
        sx={{ marginY: 2 }}
        value={require.message ? require.message : ''}
        onChange={handleChange}
      />
      <TextField
        label='Note'
        size='small'
        name='note'
        fullWidth
        multiline
        value={require.note ? require.note : ''}
        sx={{ marginY: 2 }}
        onChange={handleChange}
      />
    </FormControl>
  );
});

const DesAndMem = memo(({ handleChange, memberSelected, folderSelected }) => {
  const user = useSelector((state) => state.user);

  const queryClient = useQueryClient();

  const [selectedFolder, setSelectedFolder] = useState([]);

  const { data: folders, isLoading: folderLoading } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => await getFolderList(),
    retry: 3,
    retryDelay: 3000,
    refetchOnWindowFocus: false,
  });

  const { data: folderDetail, isLoading: folderDetailLoading } = useQuery({
    queryKey: [
      'folderDetail',
      { id: selectedFolder[selectedFolder.length - 1]?._id },
    ],
    queryFn: async (params) => {
      const { id } = params.queryKey[1];
      if (!id) return null;
      return await getFolderDetail({ id });
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });

  // select folder
  const [desName, setDesName] = useState(null);

  const handleChangeFolderName = (e) => {
    setDesName(e.target.value);
    handleChange('folder', {
      name: e.target.value,
      parent_folder: selectedFolder[selectedFolder.length - 1]?._id,
    });
  };

  const handleSelectFolder = (folder) => {
    setSelectedFolder((prev) => [...prev, folder]);
    handleChange('folder', {
      name: desName,
      parent_folder: folder._id,
    });
  };

  const handleSelectPrevFolder = () => {
    setSelectedFolder((prev) => {
      const newSelectedFolder = [...prev.slice(0, prev.length - 1)];

      handleChange('folder', {
        name: desName,
        parent_folder: newSelectedFolder[newSelectedFolder.length - 1]?._id,
      });

      return newSelectedFolder;
    });
    if (selectedFolder.length === 1) {
      queryClient.invalidateQueries(['folders']);
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

  // select member
  const [openMutipleSelect, setOpenMutipleSelect] = useState(false);

  const handleOpenMutipleSelect = () => {
    setOpenMutipleSelect(true);
  };

  const handleCloseMutipleSelect = () => {
    setOpenMutipleSelect(false);
  };

  const handleMemberItemSelect = (member) => {
    if (member.account_id === user.id) return;

    let newMemberSelected = [...memberSelected];

    const index = newMemberSelected.findIndex(
      (item) => item._id === member._id,
    );

    if (index !== -1) {
      newMemberSelected = newMemberSelected.filter(
        (item) => item._id !== member._id,
      );
    } else {
      newMemberSelected.push(member);
    }

    handleChange('to', newMemberSelected);
  };

  const handleMutipleMemberSelect = (arr) => {
    const exceptMe = arr?.filter((item) => item.account_id !== user.id);

    if (exceptMe.every((item) => memberSelected?.includes(item))) {
      const newMemberSelected = [
        ...memberSelected.filter((item) => !exceptMe.includes(item)),
      ];

      return handleChange('to', newMemberSelected);
    }

    if (!memberSelected?.includes(exceptMe)) {
      const newMemberSelected = exceptMe?.filter(
        (item) => !memberSelected?.includes(item),
      );

      return handleChange('to', [...memberSelected, ...newMemberSelected]);
    }
  };

  return (
    <>
      <p className='text-gray-600 text-xs font-semibold'>
        Member & Destination
      </p>
      <FormControl sx={{ marginTop: '16px' }} fullWidth>
        <FormLabel aria-labelledby='folder-option' sx={{ fontSize: 13 }}>
          Destination
        </FormLabel>
        <TextField
          label='Name'
          size='small'
          name='search'
          value={folderSelected.name ? folderSelected.name : ''}
          fullWidth={false}
          sx={{ marginY: 2 }}
          required
          onChange={handleChangeFolderName}
        />
        <Box
          sx={{
            minHeight: '150px',
            maxHeight: '200px',
            overFlowY: 'scroll',
            border: '1px solid rgba(0,0,0,0.1)',
            padding: '5px',
            position: 'relative',
          }}
        >
          {folderLoading || folderDetailLoading ? (
            <OverlayLoading />
          ) : (
            <Grid container spacing={1} flexWrap='wrap'>
              {selectedFolder.length === 0 &&
                folders.data?.map((folder) => (
                  <Grid item xs={12} sm={6} md={4} key={folder._id}>
                    <SmallFolderCard
                      key={folder._id}
                      folder={folder}
                      handleClick={handleSelectFolder}
                    />
                  </Grid>
                ))}

              {selectedFolder.length > 0 &&
                folderDetail &&
                folderDetail.data?.map((folder) => (
                  <Grid item xs={12} sm={6} md={4} key={folder._id}>
                    <SmallFolderCard
                      key={folder._id}
                      folder={folder}
                      handleClick={handleSelectFolder}
                    />
                  </Grid>
                ))}
            </Grid>
          )}
        </Box>
        <i className='text-[13px] text-gray-600 mt-2 flex justify-end items-center'>
          {`Folder selected: ${
            selectedFolder.length > 0
              ? selectedFolder[selectedFolder.length - 1].name
              : 'root'
          }`}
          {selectedFolder.length > 0 && (
            <BiUpArrow
              className='ml-2 cursor-pointer'
              onClick={handleSelectPrevFolder}
            />
          )}
        </i>
      </FormControl>

      <FormControl sx={{ marginTop: '16px' }} fullWidth>
        <FormLabel aria-labelledby='member' sx={{ fontSize: 13 }}>
          Member
        </FormLabel>

        <div className='flex justify-between items-center gap-2 relative'>
          <TextField
            label='Enter email'
            size='small'
            name='search'
            fullWidth
            sx={{ marginY: 2 }}
            value={searchInput}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchInput(e.target.value);
            }}
          />
          <Button
            variant='outlined'
            color='error'
            sx={{
              height: '40px',
              textTransform: 'none',
              minWidth: '120px',
            }}
            onClick={handleOpenMutipleSelect}
          >
            Select Many
          </Button>

          {search && searchResult?.data?.length > 0 && (
            <ClickAwayListener
              onClickAway={() => {
                setSearchInput('');
                setSearch('');
              }}
            >
              <Paper
                sx={{
                  position: 'absolute',
                  top: 60,
                  left: 0,
                  width: '100%',
                  zIndex: 10,
                  minHeight: '100px',
                }}
                className='border'
              >
                <Grid container spacing={1} sx={{ padding: 1 }}>
                  {searchResult?.data
                    ?.filter((user) => !memberSelected.includes(user))
                    .map((user) => (
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
                              {Truncate(user.email, 13)}
                            </p>
                          </div>
                        </Tooltip>
                      </Grid>
                    ))}
                </Grid>
              </Paper>
            </ClickAwayListener>
          )}
        </div>
      </FormControl>

      {memberSelected?.length > 0 && (
        <FormControl sx={{ marginTop: '5px', position: 'relative' }} fullWidth>
          <FormLabel aria-labelledby='folder-option' sx={{ fontSize: 13 }}>
            Selected
          </FormLabel>
          <Box sx={{ marginTop: '16px', maxWidth: '100%' }}>
            <Stack direction='row' spacing={1} useFlexGap flexWrap='wrap'>
              {memberSelected?.map((member) => (
                <Chip
                  key={member._id}
                  avatar={<Avatar />}
                  label={member.email}
                  variant='outline'
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleMemberItemSelect(member)}
                />
              ))}
            </Stack>
          </Box>
        </FormControl>
      )}

      <MutipleMemberSelectPopup
        open={openMutipleSelect}
        handleClose={handleCloseMutipleSelect}
        handleMemberSelect={handleMemberItemSelect}
        handleMutipleMemberSelect={handleMutipleMemberSelect}
        memberData={memberSelected}
      />
    </>
  );
});

export const Timming = ({ handleChange, require }) => {
  return (
    <FormControl>
      <p className='text-gray-600 text-xs font-semibold'>Time</p>
      <DateTimePicker
        label='Start date'
        format='DD/MM/YYYY hh:mm'
        value={moment(require.startDate)}
        slotProps={{ textField: { size: 'small' } }}
        sx={{ marginY: '16px', position: 'relative' }}
        onChange={handleChange.bind(this, 'startDate')}
        closeOnSelect
      />
      <DateTimePicker
        label='End date'
        format='DD/MM/YYYY hh:mm'
        value={moment(require.endDate)}
        slotProps={{ textField: { size: 'small' } }}
        sx={{ marginY: '16px', position: 'relative' }}
        onChange={handleChange.bind(this, 'endDate')}
        closeOnSelect
      />
    </FormControl>
  );
};

const initState = {
  title: null,
  file_type: 'doc',
  max_size: 10,
  message: null,
  note: null,
  startDate: null,
  endDate: null,
  folder: {
    name: null,
    parent_folder: null,
  },
  to: [],
};

const RequireModal = ({ open, handleClose, data }) => {
  const queryClient = useQueryClient();

  const [require, setRequire] = useState(
    data ? { ...data, to: data?.to?.map((i) => ({ ...i.info })) } : initState,
  );

  const handleGeneralChange = (e) => {
    setRequire((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTimeChange = (key, value) => {
    setRequire((prev) => ({ ...prev, [key]: value }));
  };

  const handleDesAndMemChange = (key, value) => {
    setRequire((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = useMutation({
    mutationFn: async () => {
      const params = {
        ...require,
        to: require.to.map((item) => item.account_id),
      };
      return await createRequire(params);
    },
    onSuccess: () => {
      SuccessToast({ message: 'Create require successfully!' });
      setRequire(initState);
      handleClose();
      queryClient.invalidateQueries(['requires']);
    },
    onError: (error) => {
      ErrorToast({ message: 'Create require failed!' });
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
      <Box className='bg-white shadow-md rounded-lg w-[70%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-6'>
        <p className='text-xl text-gray-700 font-medium'>
          {`${data ? 'Update' : 'New'}`} Requirement
        </p>
        <Divider sx={{ marginY: 2 }} />
        <Grid container spacing={2} className='mt-5'>
          <Grid item sm={12} md={3}>
            <General handleChange={handleGeneralChange} require={require} />
          </Grid>

          <Grid item sm={12} md={6}>
            <DesAndMem
              handleChange={handleDesAndMemChange}
              memberSelected={data ? require?.to : require.to}
              folderSelected={require.folder}
            />
          </Grid>

          <Grid item sm={12} md={3}>
            <Timming handleChange={handleTimeChange} require={require} />
          </Grid>
        </Grid>
        <div className='mt-5 pt-5 border-t'>
          <div className='flex justify-end'>
            <Button
              size='small'
              variant='contained'
              color='error'
              onClick={handleClose}
              sx={{ marginRight: 1 }}
            >
              Cancel
            </Button>
            <Button
              size='small'
              variant='contained'
              className='w-[100px] h-[40px] py-2 ml-2'
              onClick={() => handleSubmit.mutate()}
            >
              {handleSubmit.isLoading ? (
                <ImSpinner className='animate-spin' />
              ) : (
                `${data ? 'Update' : 'Create'}`
              )}
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default memo(RequireModal);
