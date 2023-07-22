import React from 'react';

import {
  Copy,
  Detail,
  FolderDeleteConfirm,
  FolderDownloadConfirm,
  Move,
  Rename,
  Share,
} from '../../components/popups/ModelPopups';
import {
  COPY,
  DELETE,
  DETAILS,
  DOWNLOAD,
  MOVE,
  RENAME,
  SHARE,
} from '../../constants/option';

export default function OptionHelper({
  type,
  data,
  handleClose,
  open,
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
      return <Rename handleClose={handleClose} data={data} open={open} />;

    case DOWNLOAD:
      return (
        <FolderDownloadConfirm
          handleClose={handleClose}
          data={data}
          open={open}
        />
      );

    case DELETE:
      return (
        <FolderDeleteConfirm
          open={deleteShow}
          data={data}
          handleClose={handleCancelDelete}
        />
      );

    default:
      break;
  }
}
