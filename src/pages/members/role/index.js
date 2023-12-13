import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import useClient from 'hooks/useClient';
import { useCallback, useState } from 'react';
import { assignRole } from 'services/informationController';
import { getMajors } from 'services/majorController';
import { getSpecializationByMajor } from 'services/specializationController';
import { renderPermission } from 'utils/helpers/Helper';

function MemberRole({ member, handleClose }) {
  const queryClient = useClient();

  const [selected, setSelected] = useState({
    role: '',
    major: '',
    specialization: [],
  });

  const handleChange = (e) => {
    setSelected({ ...selected, [e.target.name]: e.target.value });
  };

  const { data: majors } = useQuery({
    queryKey: ['majors'],
    queryFn: () => getMajors(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { data: specializations } = useQuery({
    queryKey: ['specializations', selected.major],
    queryFn: () => getSpecializationByMajor(selected.major),
    enabled: selected.major !== '',
    retry: false,
    refetchOnWindowFocus: false,
  });

  const specMapping = useCallback(
    (id) => {
      if (specializations?.data?.length === 0) return null;

      const specObject = Object.fromEntries(
        specializations?.data?.map((spec) => [spec._id, spec.name]),
      );

      return specObject[id];
    },
    [specializations],
  );

  const { mutate: handleSubmit } = useMutation({
    mutationFn: () =>
      assignRole({
        member_id: member._id,
        spec_id: selected.specialization,
        major_id: selected.major,
        permission: selected.role,
      }),
    onSuccess: () => {
      handleClose();
      queryClient.invalidateQueries(['members']);
      SuccessToast({ message: 'Role assigned successfully' });
    },
    onError: (error) => {
      console.log(error);
      ErrorToast({ message: 'Failed to assign role' });
    },
  });

  return (
    <Box className='bg-white shadow-md rounded-lg w-[40%] min-h-[400px] flex flex-col absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] overflow-hidden py-5 px-7'>
      <Typography
        variant='span'
        className='text-[18px] text-gray-600 font-bold'
      >
        Assign Role
      </Typography>

      <div className='mt-5 flex flex-col gap-5 flex-1'>
        <FormControl fullWidth size='medium'>
          <InputLabel>Role</InputLabel>
          <Select
            name='role'
            value={selected.role}
            label='Role'
            error={selected.role === ''}
            onChange={handleChange}
          >
            <MenuItem value={'MANAGER'}>
              {renderPermission['MANAGER'].label}
            </MenuItem>
            <MenuItem value={'LECTURERS'}>
              {renderPermission['LECTURERS'].label}
            </MenuItem>
            <MenuItem value={'PUPIL'}>
              {renderPermission['PUPIL'].label}
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size='medium'>
          <InputLabel>Major</InputLabel>
          <Select
            name='major'
            value={selected.major}
            label='Major'
            error={selected.major === ''}
            onChange={handleChange}
          >
            {majors?.data?.map((major) => (
              <MenuItem key={major._id} value={major._id}>
                {major.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size='medium'>
          <InputLabel>Specialization</InputLabel>
          <Select
            name='specialization'
            value={selected.specialization}
            label='Specialization'
            error={selected.specialization.length === 0}
            multiple
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={specMapping(value)} />
                ))}
              </Box>
            )}
            onChange={handleChange}
          >
            {specializations?.data?.length === 0 && (
              <MenuItem disabled>No specialization found</MenuItem>
            )}
            {specializations?.data?.map((spec) => (
              <MenuItem key={spec._id} value={spec._id}>
                <Checkbox
                  checked={selected.specialization.indexOf(spec._id) > -1}
                />
                <ListItemText primary={spec.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className='mt-5 flex justify-end gap-3 h-fit'>
        <Button
          variant='contained'
          size='small'
          color='error'
          sx={{ textTransform: 'none' }}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          size='small'
          disabled={
            selected.role === '' ||
            selected.major === '' ||
            selected.specialization.length === 0
          }
          sx={{ textTransform: 'none' }}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </div>
    </Box>
  );
}

export default MemberRole;
