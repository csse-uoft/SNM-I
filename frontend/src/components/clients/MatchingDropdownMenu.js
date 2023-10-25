import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem, ListItemIcon, Typography } from "@mui/material";
import { MoreVert as MoreVertIcon, Edit, Delete, OpenInBrowser, Event as EventIcon, GroupAdd, HowToReg } from '@mui/icons-material';

const ITEM_HEIGHT = 48;

export default function MatchingDropdownMenu({type}) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLink = link => () => {
    navigate(link);
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
            width: 225,
          },
        }}
      >
        <MenuItem onClick={handleLink(`/appointments/new`)}>
          <ListItemIcon>
            <EventIcon fontSize="small" color="primary"/>
          </ListItemIcon>
          <Typography variant="inherit">Book an appointment</Typography>
        </MenuItem>

        <MenuItem onClick={handleLink(`/${type}Registrations/new`)}>
          <ListItemIcon>
            <HowToReg fontSize="small" color="primary"/>
          </ListItemIcon>
          <Typography variant="inherit">Register</Typography>
        </MenuItem>

        <MenuItem onClick={handleLink(`/referrals/new`)}>
          <ListItemIcon>
            <GroupAdd fontSize="small" color="secondary"/>
          </ListItemIcon>
          <Typography variant="inherit">Make a referral</Typography>
        </MenuItem>

      </Menu>
    </div>
  );
}
