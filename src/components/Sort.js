import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useState } from 'react';

export default function Sort({ onSort }) {
  const [sortString, setSortString] = useState('lastOpened');

  const handleChange = (event) => {
    setSortString(event.target.value);
    onSort(event.target.value);
  };

  return (
    <FormControl sx={{ minWidth: 120 }} size='small'>
      <Select
        variant='standard'
        value={sortString}
        inputProps={{ 'aria-label': 'Without label' }}
        size='small'
        sx={{
          fontSize: '0.875rem',
          fontWeight: '500',
          lineHeight: '1.25rem',
          color: 'rgb(107 114 128)',
        }}
        onChange={handleChange}
      >
        <MenuItem value='lastOpened' sx={{ fontSize: '14px' }}>
          Last Opened
        </MenuItem>
        <MenuItem value='createAt' sx={{ fontSize: '14px' }}>
          Recently Created
        </MenuItem>
        <MenuItem value='modifiedAt' sx={{ fontSize: '14px' }}>
          Recently Edited
        </MenuItem>
      </Select>
    </FormControl>
  );
}
