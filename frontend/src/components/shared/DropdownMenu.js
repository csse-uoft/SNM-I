import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { IconButton, Menu, MenuItem, ListItemIcon, Typography } from "@material-ui/core";
import { MoreVert as MoreVertIcon, Edit, Delete, OpenInBrowser } from '@material-ui/icons';

const ITEM_HEIGHT = 48;

export default function DropdownMenu({urlPrefix, objectId, handleDelete, rowIndex, hideViewOption}) {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLink = link => () => {
    history.push(link);
  };

  return (
    <div>
      <IconButton
        onClick={handleClick}
        size="small"
      >
        <MoreVertIcon/>
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 150,
          },
        }}
      >
        {!hideViewOption &&
        <MenuItem onClick={handleLink(`/${urlPrefix}/${objectId}`)}>
          <ListItemIcon>
            <OpenInBrowser fontSize="small" color="primary"/>
          </ListItemIcon>
          <Typography variant="inherit">View</Typography>

        </MenuItem>
        }

        <MenuItem onClick={handleLink(`/${urlPrefix}/${objectId}/edit`)}>
          <ListItemIcon>
            <Edit fontSize="small" color="primary"/>
          </ListItemIcon>
          Edit
        </MenuItem>

        <MenuItem onClick={() => {
          handleClose();
          handleDelete(rowIndex !== undefined ? rowIndex : objectId)
        }}>
          <ListItemIcon>
            <Delete fontSize="small" color="secondary"/>
          </ListItemIcon>
          Delete
        </MenuItem>

      </Menu>
    </div>
  );
}
