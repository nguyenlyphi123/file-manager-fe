import {
  Avatar,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Modal,
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
import Loading from 'parts/Loading';
import { useMemo, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BiUpArrow } from 'react-icons/bi';
import { BsCheckCircle, BsCheckCircleFill, BsPlusCircle } from 'react-icons/bs';
import { ImSpinner } from 'react-icons/im';
import { useSelector } from 'react-redux';
import { getClasses } from 'services/classController';
import { shareFile } from 'services/fileController';
import { shareFolder } from 'services/folderController';
import { getLecturersBySpecialize } from 'services/lecturersController';
import { getPupils } from 'services/pupilController';
import { getSpecialization } from 'services/specializationController';
import FileIconHelper from 'utils/helpers/FileIconHelper';
import { isAuthor } from 'utils/helpers/Helper';
import ShareRenderHelper from 'utils/helpers/ShareRenderHelper';
import { Truncate, validateEmail } from 'utils/helpers/TypographyHelper';

export const SpecializeSelect = ({ handleSelect, handleReturn }) => {
  // fetch data
  const { data: specializes, isLoading: specializesLoading } = useQuery({
    queryKey: ['specializes'],
    queryFn: getSpecialization,
    retry: 3,
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
          specializes?.data?.map((specialize) => (
            <Grid item xs={6} md={6} lg={6}>
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
  handleSelect,
  handleReturn,
  handleMemberSelect,
  handleMutipleMemberSelect,
}) => {
  const user = useSelector((state) => state.user);

  // fetch class data
  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: () => getClasses(data?._id),
    retry: 3,
  });

  const { data: lecturers, isLoading: lecturersLoading } = useQuery({
    queryKey: ['lecturers'],
    queryFn: () => getLecturersBySpecialize(data?._id),
    retry: 3,
  });

  // select all
  const handleSelectAndUnselectAll = () => {
    handleMutipleMemberSelect(lecturers?.data);
  };

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
          {lecturers?.data.every((item) => memberSelected?.includes(item)) &&
          memberSelected?.length !== 0 ? (
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
          {lecturers?.data?.map((lecturers) => (
            <Grid key={lecturers._id} item xs={3} md={3} lg={3}>
              <div
                onClick={() => handleMemberSelect(lecturers)}
                className='border rounded-md py-1 px-2 flex items-center justify-between cursor-pointer'
              >
                <p className='m-b-0 text-[0.85em] text-gray-700 mr-3'>
                  {lecturers?.name}
                </p>

                <Checkbox
                  icon={<BsCheckCircle />}
                  checkedIcon={<BsCheckCircleFill />}
                  sx={{ padding: '3px' }}
                  color='success'
                  checked={
                    memberSelected?.findIndex(
                      (item) => item._id === lecturers._id,
                    ) !== -1
                  }
                />
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
};

export const MemberSelect = ({
  data,
  handleReturn,
  memberSelected,
  handleSelect,
  handleMutipleMemberSelect,
}) => {
  // fetch class data
  const { data: pupils, isLoading: pupilsLoading } = useQuery({
    queryKey: ['pupils'],
    queryFn: () => getPupils(data?._id),
    retry: 3,
  });

  // select all
  const handleSelectAndUnselectAll = () => {
    handleMutipleMemberSelect(pupils?.data);
  };

  return (
    <div className='min-h-[150px] max-h-[300px] overflow-y-scroll relative'>
      <div className='flex justify-between items-center pr-2'>
        <div className='flex items-center'>
          <p className='text-sm text-gray-600 font-semibold mr-2'>Pupils</p>

          <BiUpArrow
            onClick={handleReturn}
            className='text-gray-600 font-semibold cursor-pointer'
          />
        </div>
        {pupils?.data.every((item) => memberSelected?.includes(item)) &&
        memberSelected?.length !== 0 ? (
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
          pupils?.data?.map((pupil) => (
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
                    memberSelected?.findIndex(
                      (item) => item._id === pupil._id,
                    ) !== -1
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
  }, []);

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

  // email input
  const [email, setEmail] = useState();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAddEmail = () => {
    setMemberSelected((prev) => {
      return [...prev, { email: email }];
    });
    setEmail();
  };

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
              <FileIconHelper className='mr-4 text-3xl' />
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
            <div className='flex items-center'>
              <span className='text-[0.9em] text-gray-400 font-medium mr-4'>
                To
              </span>
              <input
                type='text'
                value={email ? email : ''}
                placeholder='Email or Name'
                autoFocus
                className='p-1 w-full outline-none'
                onChange={handleEmailChange}
              />
              {email && validateEmail(email) && (
                <BsPlusCircle
                  className='text-lg text-gray-500 hover:text-gray-700'
                  onClick={handleAddEmail}
                />
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
          {isAuthor(user.id, data.author) && memberSelected?.length > 0 && (
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
