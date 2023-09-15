import { IconButton, Menu, MenuItem } from '@mui/material';
import {
  PERMISSION_DOWNLOAD,
  PERMISSION_EDIT,
  PERMISSION_SHARE,
} from 'constants/constants';
import {
  COPY,
  DELETE,
  DETAILS,
  DOWNLOAD,
  MOVE,
  RENAME,
  SHARE,
} from 'constants/option';
import { useState } from 'react';
import {
  AiOutlineCopy,
  AiOutlineDownload,
  AiOutlineEye,
  AiOutlineShareAlt,
} from 'react-icons/ai';
import {
  BsBoxArrowRight,
  BsPencil,
  BsThreeDots,
  BsTrash,
} from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { hasFFPermission, isAuthor, isOwner } from 'utils/helpers/Helper';

export const ThreeDotsDropdownItem = ({ children, option, onClick, show }) => {
  if (!show)
    return (
      <MenuItem
        className='group/drop-items flex items-center px-4 py-3 hover:bg-blue-100/30 '
        disabled
      >
        {children}
      </MenuItem>
    );

  return (
    <MenuItem
      onClick={() => onClick(option)}
      className='group/drop-items flex items-center px-4 py-3 hover:bg-blue-100/30 '
    >
      {children}
    </MenuItem>
  );
};

export const ThreeDotsDropdown = ({
  data,
  handleSelectOption,
  handleShowDelete,
  className,
}) => {
  const user = useSelector((state) => state.user);

  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className={className}>
        <IconButton
          id='threedots-btn'
          aria-haspopup='true'
          aria-controls={open ? 'threedots-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <BsThreeDots className='text-lg' />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id='threedots-menu'
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={() => handleSelectOption(DETAILS)}
            className='group/drop-items flex items-center px-4 py-3 hover:bg-blue-100/30 '
          >
            <AiOutlineEye className='mr-4 text-xl text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Details
            </p>
          </MenuItem>

          <ThreeDotsDropdownItem
            option={SHARE}
            onClick={handleSelectOption}
            show={hasFFPermission(
              data.permission,
              PERMISSION_SHARE,
              isAuthor(user.id, data.author?._id),
              isOwner(user.id, data.owner?._id),
            )}
          >
            <AiOutlineShareAlt className='mr-4 text-xl text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Share
            </p>
          </ThreeDotsDropdownItem>

          <ThreeDotsDropdownItem
            option={COPY}
            onClick={handleSelectOption}
            show={hasFFPermission(
              data.permission,
              PERMISSION_EDIT,
              isAuthor(user.id, data.author?._id),
              isOwner(user.id, data.owner?._id),
            )}
          >
            <AiOutlineCopy className='mr-4 text-xl text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Copy
            </p>
          </ThreeDotsDropdownItem>

          <ThreeDotsDropdownItem
            option={MOVE}
            onClick={handleSelectOption}
            show={hasFFPermission(
              data.permission,
              PERMISSION_EDIT,
              isAuthor(user.id, data.author?._id),
              isOwner(user.id, data.owner?._id),
            )}
          >
            <BsBoxArrowRight className='mr-4 text-xl text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Move
            </p>
          </ThreeDotsDropdownItem>

          <ThreeDotsDropdownItem
            option={DOWNLOAD}
            onClick={handleSelectOption}
            show={hasFFPermission(
              data.permission,
              PERMISSION_DOWNLOAD,
              isAuthor(user.id, data.author?._id),
              isOwner(user.id, data.owner?._id),
            )}
          >
            <AiOutlineDownload className='mr-4 text-xl text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Download
            </p>
          </ThreeDotsDropdownItem>

          <ThreeDotsDropdownItem
            show={hasFFPermission(
              data.permission,
              PERMISSION_EDIT,
              isAuthor(user.id, data.author?._id),
              isOwner(user.id, data.owner?._id),
            )}
            option={RENAME}
            onClick={handleSelectOption}
          >
            <BsPencil className='mr-4 text-xl text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Rename
            </p>
          </ThreeDotsDropdownItem>

          <ThreeDotsDropdownItem
            show={hasFFPermission(
              data.permission,
              PERMISSION_EDIT,
              isAuthor(user.id, data.author?._id),
              isOwner(user.id, data.owner?._id),
            )}
            option={DELETE}
            onClick={(DELETE) => {
              handleSelectOption(DELETE);
              handleShowDelete();
            }}
          >
            <BsTrash className='mr-4 text-xl text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Delete
            </p>
          </ThreeDotsDropdownItem>
        </Menu>
      </div>
    </>
  );
};
