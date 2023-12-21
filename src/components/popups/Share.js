import {
  Avatar,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Modal,
  Paper,
  Tooltip,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import {
  CLASS,
  LECTURERS,
  MANAGER,
  MEMBER,
  PERMISSION_DOWNLOAD,
  PERMISSION_EDIT,
  PERMISSION_READ,
  PERMISSION_READ_WRITE,
  PERMISSION_SHARE,
  PERMISSION_WRITE,
  PUPIL,
  SPECIALIZATION,
} from 'constants/constants';
import useDebounce from 'hooks/useDebounce';
import Loading from 'parts/Loading';
import { useMemo, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BiUpArrow } from 'react-icons/bi';
import { BsCheckCircle, BsCheckCircleFill } from 'react-icons/bs';
import { ImSpinner } from 'react-icons/im';
import { useSelector } from 'react-redux';
import { getClasses } from 'services/classController';
import { shareFile } from 'services/fileController';
import { shareFolder } from 'services/folderController';
import { getLecturersBySpecialize } from 'services/lecturersController';
import { getPupils } from 'services/pupilController';
import { getSpecialization } from 'services/specializationController';
import { searchUser } from 'services/userController';
import FileIconHelper from 'utils/helpers/FileIconHelper';
import { isAuthor } from 'utils/helpers/Helper';
import ShareRenderHelper from 'utils/helpers/ShareRenderHelper';
import { Truncate } from 'utils/helpers/TypographyHelper';

export const SpecializeSelect = ({ handleSelect, handleReturn }) => {
  // fetch data
  const { data: specializes, isLoading: specializesLoading } = useQuery({
    queryKey: ['specializes'],
    queryFn: getSpecialization,
    retry: 3,
    refetchOnWindowFocus: false,
  });
  return (
    <div className='min-h-[150px] relative mb-5'>
      <p className='text-sm text-gray-600 font-semibold'>Specialization</p>
      <Grid
        container
        spacing={1}
        sx={{ width: '100%', marginTop: '5px', marginLeft: 0 }}
      >
        {specializesLoading ? (
          <Loading />
        ) : (
          specializes?.data?.map((specialize, index) => (
            <Grid key={index} item xs={6} md={6} lg={6}>
              <div
                onClick={() => handleSelect(specialize)}
                className='border rounded-md py-2 px-2 flex items-center justify-between cursor-pointer'
              >
                <p className='m-b-0 text-sm text-gray-700'>{specialize.name}</p>
                <Avatar
                  sx={{
                    height: 20,
                    width: 20,
                    fontSize: '70%',
                    bgcolor: '#1F6CFA',
                    marginLeft: '10px',
                  }}
                >
                  {specialize.member}
                </Avatar>
              </div>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
};

export const ClassSelect = ({
  data,
  memberSelected,
  type = 'create',
  handleSelect,
  handleReturn,
  handleMemberSelect,
  handleMutipleMemberSelect,
}) => {
  const user = useSelector((state) => state.user);

  // fetch class data
  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['classes', { id: data?._id }],
    queryFn: (params) => {
      const id = params.queryKey[1].id;
      if (!id) return;
      return getClasses(id);
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const { data: lecturers, isLoading: lecturersLoading } = useQuery({
    queryKey: ['lecturers'],
    queryFn: () => getLecturersBySpecialize(data?._id),
    retry: 3,
    refetchOnWindowFocus: false,
  });

  // select all
  const handleSelectAndUnselectAll = () => {
    handleMutipleMemberSelect(lecturers?.data);
  };

  const isAllMemberSelected = useMemo(() => {
    if (!lecturers?.data) return true;

    if (memberSelected.length === 0) return false;

    const exceptMe = lecturers?.data?.filter(
      (item) => item.account_id !== user.id,
    );

    if (type !== 'create') {
      const members = lecturers?.data?.filter(
        (item) =>
          item.account_id !== user.id &&
          memberSelected?.every(
            (member) => member.info._id !== item.account_id,
          ),
      );

      return members.length === 0;
    }

    return exceptMe.every((item) => memberSelected?.includes(item));
  }, [memberSelected, type, lecturers?.data, user.id]);

  if (classesLoading || lecturersLoading)
    return (
      <div className='min-h-[150px] relative'>
        <Loading />
      </div>
    );

  return (
    <>
      {user?.permission !== MANAGER && (
        <div className='min-h-[100px] relative'>
          <div className='flex items-center'>
            <p className='text-sm text-gray-600 font-semibold mr-2'>Classes</p>

            <BiUpArrow
              onClick={handleReturn}
              className='text-gray-600 font-semibold cursor-pointer'
            />
          </div>
          <Grid
            container
            spacing={1}
            sx={{ width: '100%', marginTop: '5px', marginLeft: 0 }}
          >
            {classes?.data?.map((class_) => (
              <Grid key={class_._id} item xs={2} md={2} lg={2}>
                <div
                  onClick={() => handleSelect(class_)}
                  className='border rounded-md py-1 px-2 flex items-center justify-between cursor-pointer'
                >
                  <p className='m-b-0 text-xs text-gray-700'>{class_?.name}</p>
                  <Avatar
                    sx={{
                      height: 20,
                      width: 20,
                      fontSize: '70%',
                      bgcolor: '#1F6CFA',
                      marginLeft: '10px',
                    }}
                  >
                    {class_?.pupil?.length}
                  </Avatar>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      )}

      <div className='relative min-h-[100px] max-h-[200px] overflow-y-scroll'>
        <div className='flex justify-between items-center pr-2'>
          <div className='flex items-center'>
            <p className='text-sm text-gray-600 font-semibold mr-2'>
              Lecturers
            </p>
            {user?.permission === MANAGER && (
              <BiUpArrow
                onClick={handleReturn}
                className='text-gray-600 font-semibold cursor-pointer'
              />
            )}
          </div>
          {isAllMemberSelected ? (
            <p
              onClick={handleSelectAndUnselectAll}
              className='text-gray-600 text-sm font-semibold cursor-pointer'
            >
              Remove all
            </p>
          ) : (
            <p
              onClick={handleSelectAndUnselectAll}
              className='text-gray-600 text-sm font-semibold cursor-pointer'
            >
              Select all
            </p>
          )}
        </div>
        <Grid
          container
          spacing={1}
          sx={{
            width: '100%',
            marginTop: '5px',
            marginLeft: 0,
            paddingRight: 1,
          }}
        >
          {lecturers?.data?.map(
            (lecturer) =>
              lecturer.account_id !== user.id && (
                <Grid key={lecturer._id} item xs={3} md={3} lg={3}>
                  <div
                    onClick={() => handleMemberSelect(lecturer)}
                    className='border rounded-md py-1 px-2 flex items-center justify-between cursor-pointer'
                  >
                    <p className='m-b-0 text-[0.85em] text-gray-700 mr-3'>
                      {lecturer?.name}
                    </p>

                    <Checkbox
                      icon={<BsCheckCircle />}
                      checkedIcon={<BsCheckCircleFill />}
                      sx={{ padding: '3px' }}
                      color='success'
                      checked={
                        memberSelected?.findIndex((item) => {
                          if (type === 'create')
                            return item._id === lecturer._id;
                          return item.info._id === lecturer.account_id;
                        }) !== -1
                      }
                    />
                  </div>
                </Grid>
              ),
          )}
        </Grid>
      </div>
    </>
  );
};

export const MemberSelect = ({
  data,
  handleReturn,
  memberSelected,
  type = 'create',
  handleSelect,
  handleMutipleMemberSelect,
}) => {
  const user = useSelector((state) => state.user);

  // fetch class data
  const { data: pupils, isLoading: pupilsLoading } = useQuery({
    queryKey: ['pupils'],
    queryFn: () => getPupils(data?._id),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // select all
  const handleSelectAndUnselectAll = () => {
    handleMutipleMemberSelect(pupils?.data);
  };

  const isAllMemberSelected = useMemo(() => {
    if (!pupils?.data) return true;

    if (memberSelected.length === 0) return false;

    const exceptMe = pupils?.data?.filter(
      (item) => item.account_id !== user.id,
    );

    if (type !== 'create') {
      const members = pupils?.data?.filter(
        (item) =>
          item.account_id !== user.id &&
          memberSelected?.every(
            (member) => member.info._id !== item.account_id,
          ),
      );

      return members.length === 0;
    }

    return exceptMe.every((item) => memberSelected?.includes(item));
  }, [memberSelected, type, pupils?.data, user.id]);

  return (
    <div className='min-h-[150px] max-h-[300px] overflow-y-scroll relative'>
      <div className='flex justify-between items-center pr-2'>
        <div className='flex items-center'>
          <p className='text-sm text-gray-600 font-semibold mr-2'>Pupils</p>

          {user?.permission !== PUPIL && (
            <BiUpArrow
              onClick={handleReturn}
              className='text-gray-600 font-semibold cursor-pointer'
            />
          )}
        </div>
        {isAllMemberSelected ? (
          <p
            onClick={handleSelectAndUnselectAll}
            className='text-gray-600 text-sm font-semibold cursor-pointer'
          >
            Remove all
          </p>
        ) : (
          <p
            onClick={handleSelectAndUnselectAll}
            className='text-gray-600 text-sm font-semibold cursor-pointer'
          >
            Select all
          </p>
        )}
      </div>
      <Grid
        container
        spacing={1}
        sx={{ width: '100%', marginTop: '5px', marginLeft: 0, paddingRight: 1 }}
      >
        {pupilsLoading ? (
          <Loading />
        ) : (
          pupils?.data
            ?.filter((item) => item.account_id !== user.id)
            .map((pupil) => (
              <Grid key={pupil._id} item xs={3} md={3} lg={3}>
                <div
                  onClick={() => handleSelect(pupil)}
                  className='border rounded-md py-1 px-2 flex items-center justify-between cursor-pointer'
                >
                  <p className='m-b-0 text-[0.85em] text-gray-700 mr-3'>
                    {pupil?.name}
                  </p>

                  <Checkbox
                    icon={<BsCheckCircle />}
                    checkedIcon={<BsCheckCircleFill />}
                    sx={{ padding: '3px' }}
                    color='success'
                    checked={
                      memberSelected?.findIndex((item) => {
                        if (type === 'create') return item._id === pupil._id;
                        return item.info._id === pupil.account_id;
                      }) !== -1
                    }
                  />
                </div>
              </Grid>
            ))
        )}
      </Grid>
    </div>
  );
};

export const Share = ({ handleClose, data, open }) => {
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

  // member selected
  const [memberSelected, setMemberSelected] = useState([]);

  const handleMemberItemSelect = (member) => {
    if (member.account_id === user.id) return;
    setMemberSelected((prev) => {
      const index = prev.findIndex((item) => item._id === member._id);
      if (index !== -1) {
        return prev.filter((item) => item._id !== member._id);
      }
      return [...prev, member];
    });
  };

  const handleMutipleMemberSelect = (arr) => {
    const exceptMe = arr?.filter((item) => item.account_id !== user.id);
    if (exceptMe.every((item) => memberSelected?.includes(item))) {
      return setMemberSelected((prev) => {
        return prev.filter((item) => !exceptMe.includes(item));
      });
    }

    if (!memberSelected?.includes(exceptMe)) {
      const newArr = exceptMe?.filter(
        (item) => !memberSelected?.includes(item),
      );
      return setMemberSelected((prev) => [...prev, ...newArr]);
    }
  };

  // search

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

  // permission
  const [permission, setPermission] = useState([
    PERMISSION_READ,
    PERMISSION_DOWNLOAD,
    PERMISSION_SHARE,
  ]);

  const handleChangePermission = (e) => {
    setPermission((prev) => {
      if (permission.length < 0) return [e.target.value];

      if (permission.length < 0 && e.target.value === PERMISSION_READ_WRITE)
        return [PERMISSION_READ, PERMISSION_WRITE];

      if (e.target.value === PERMISSION_READ_WRITE) {
        if (prev?.includes(PERMISSION_WRITE && PERMISSION_READ))
          return prev?.filter(
            (item) => item !== PERMISSION_WRITE && item !== PERMISSION_READ,
          );
        if (prev?.includes(PERMISSION_READ && !PERMISSION_WRITE))
          return [...prev, PERMISSION_WRITE];
        if (prev?.includes(PERMISSION_WRITE && !PERMISSION_READ))
          return [...prev, PERMISSION_READ];
        return [...prev, PERMISSION_READ, PERMISSION_WRITE];
      }

      if (prev?.includes(e.target.value)) {
        return prev?.filter((item) => item !== e.target.value);
      }

      return [...prev, e.target.value];
    });
  };

  const shareMutation = data.type ? shareFile : shareFolder;

  // handle share
  const handleShare = useMutation({
    mutationFn: () => {
      const emails = memberSelected?.map((pupil) => pupil.email);
      const permissions =
        !permission || permission.length === 0 ? [PERMISSION_READ] : permission;

      return shareMutation(
        data.type
          ? { emails, fileId: data._id }
          : { emails, permissions, folderId: data._id },
      );
    },
    onSuccess: () => {
      SuccessToast({
        message: `${data.type ? 'File' : 'Folder'} was shared successfully`,
      });
      handleClose();
    },
    onError: () => {
      ErrorToast({
        message: 'Oops! Something went wrong. Please try again later',
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
              <FileIconHelper className='mr-4 text-3xl' type={data.type} />
              <p className='text-[0.9em] text-gray-700 font-medium'>
                {data.name}
              </p>
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
                placeholder='Email or Name'
                autoFocus
                className='p-1 w-full outline-none'
                value={searchInput}
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

          {isAuthor(user.id, data.author._id) && memberSelected?.length > 0 && (
            <div className='mt-5'>
              <p className='text-sm text-gray-600 font-semibold'>Permission</p>
              <FormGroup
                row
                sx={{ marginLeft: 0, marginRight: 0, justifyContent: 'center' }}
              >
                {!data.type && (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size='small'
                          checked={permission?.includes(PERMISSION_READ)}
                        />
                      }
                      label={<p className='text-sm text-gray-700'>Read</p>}
                      value={PERMISSION_READ}
                      onChange={handleChangePermission}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size='small'
                          checked={permission?.includes(PERMISSION_WRITE)}
                        />
                      }
                      label={<p className='text-sm text-gray-700'>Write</p>}
                      value={PERMISSION_WRITE}
                      onChange={handleChangePermission}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size='small'
                          checked={
                            permission?.includes(PERMISSION_READ) &&
                            permission?.includes(PERMISSION_WRITE)
                              ? true
                              : false
                          }
                        />
                      }
                      label={
                        <p className='text-sm text-gray-700'>Read & Write</p>
                      }
                      value={PERMISSION_READ_WRITE}
                      onChange={handleChangePermission}
                    />
                  </>
                )}
                <FormControlLabel
                  control={
                    <Checkbox
                      size='small'
                      checked={permission?.includes(PERMISSION_DOWNLOAD)}
                    />
                  }
                  label={<p className='text-sm text-gray-700'>Download</p>}
                  value={PERMISSION_DOWNLOAD}
                  defaultChecked
                  onChange={handleChangePermission}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size='small'
                      checked={permission?.includes(PERMISSION_SHARE)}
                    />
                  }
                  label={<p className='text-sm text-gray-700'>Share</p>}
                  value={PERMISSION_SHARE}
                  onChange={handleChangePermission}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size='small'
                      checked={permission?.includes(PERMISSION_EDIT)}
                    />
                  }
                  label={<p className='text-sm text-gray-700'>Edit</p>}
                  value={PERMISSION_EDIT}
                  onChange={handleChangePermission}
                />
              </FormGroup>
            </div>
          )}
          <div className='mt-1'>
            <p className='text-sm text-gray-600 font-semibold'>Message</p>
            <textarea
              rows=''
              cols=''
              placeholder='Add a message'
              className='w-full border rounded outline-none p-3 py-2 ml-2 mt-2'
            />
          </div>
        </div>

        <div className='flex justify-end items-center py-3 px-8 bg-[#E5E9F2]'>
          <div
            onClick={handleClose}
            className='bg-white py-2 px-5 rounded-md text-gray-500 text-[0.9em] font-medium mr-4 shadow-sm cursor-pointer hover:text-white hover:bg-gray-600 duration-200'
          >
            Cancel
          </div>

          <div
            onClick={() => handleShare.mutate()}
            className='bg-blue-700/60 flex justify-center items-center py-2 px-5 min-w-[80px] h-[37px] rounded-md text-white text-[0.9em] font-medium cursor-pointer hover:bg-blue-700/80 duration-200'
          >
            {handleShare.isLoading ? (
              <ImSpinner className='animate-spin' />
            ) : (
              'Share'
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};
