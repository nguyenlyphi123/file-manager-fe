import React from 'react';

import {
  Copy,
  Move,
  Rename,
  Share,
  Detail,
  FolderDeleteConfirm,
} from '../../components/popups/ModelPopups';
import {
  COPY,
  DELETE,
  DETAILS,
  MOVE,
  RENAME,
  SHARE,
} from '../../constants/option';

export default function OptionHelper({
  type,
  data,
  handleClose,
  open,
  refetch,
  deleteShow,
  handleCancelDelete,
}) {
  switch (type) {
    case DETAILS:
      return <Detail handleClose={handleClose} data={data} open={open} />;

    case SHARE:
      return <Share handleClose={handleClose} data={data} open={open} />;

    case COPY:
      return <Copy handleClose={handleClose} data={data} open={open} />;

    case MOVE:
      return <Move handleClose={handleClose} data={data} open={open} />;

    case RENAME:
      return (
        <Rename
          handleClose={handleClose}
          data={data}
          open={open}
          refetch={refetch}
        />
      );

    case DELETE:
      return (
        <FolderDeleteConfirm
          open={deleteShow}
          data={data}
          handleClose={handleCancelDelete}
          refetch={refetch}
        />
      );

    default:
      break;
  }
}
