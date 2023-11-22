import { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { IconButton } from '@mui/material';

import {
  InputBase,
  styled,
  alpha,
  FormControl,
  InputLabel,
  InputAdornment,
  TextField,
} from '@mui/material';

const Input = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? '#F3F6F9' : '#1A2027',
    border: '1px solid',
    borderColor: theme.palette.mode === 'light' ? '#E0E3E7' : '#2D3843',
    fontSize: 16,
    padding: '8.5px 14px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

export const TextInput = ({
  label,
  value,
  variant = 'standard',
  placeholder,
  type = 'text',
  readOnly = false,
  onChange,
}) => {
  return (
    <FormControl variant={variant} fullWidth sx={{ my: 1 }}>
      <InputLabel shrink htmlFor='normal-input'>
        {label}
      </InputLabel>
      <Input
        value={value}
        type={type}
        id='normal-input'
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={onChange}
      />
    </FormControl>
  );
};

export const PasswordInput = ({
  label,
  value,
  variant = 'standard',
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl variant={variant} fullWidth sx={{ my: 1 }}>
      <InputLabel shrink htmlFor='password-input' sx={{ mb: 2 }}>
        {label}
      </InputLabel>
      <TextField
        id='password-input'
        size='small'
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge='end'
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          my: 1.5,
          'label + &': {
            marginTop: '24px',
          },
        }}
      />
    </FormControl>
  );
};
