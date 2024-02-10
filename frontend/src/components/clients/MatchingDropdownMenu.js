import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem, ListItemIcon, Typography } from "@mui/material";
import { MoreVert as MoreVertIcon, Edit, Delete, OpenInBrowser, Event as EventIcon, GroupAdd, HowToReg } from '@mui/icons-material';
import { getProgramOccurrencesByProgram } from "../../api/programProvision";
import { getServiceOccurrencesByService } from "../../api/serviceProvision";

const ITEM_HEIGHT = 48;

export default function MatchingDropdownMenu({type, clientId, needId, serviceOrProgramId}) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [anyOccurrences, setAnyOccurrences] = useState(false);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLink = link => () => {
    navigate(link);
  };

  useEffect(() => {
    if (type === 'program') {
      getProgramOccurrencesByProgram('http://snmi#program_' + serviceOrProgramId).then(occurrences => {
        setAnyOccurrences(Object.keys(occurrences).length > 0);
      });
    } else {
      getServiceOccurrencesByService('http://snmi#service_' + serviceOrProgramId).then(occurrences => {
        setAnyOccurrences(Object.keys(occurrences).length > 0);
      });
    }
  }, [type, serviceOrProgramId]);

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
        <MenuItem onClick={handleLink(`/appointments/new/${clientId}/`)}>
          <ListItemIcon>
            <EventIcon fontSize="small" color="primary"/>
          </ListItemIcon>
          <Typography variant="inherit">Book an appointment</Typography>
        </MenuItem>

        <MenuItem onClick={handleLink(`/${type}Registrations/new/${clientId}/${serviceOrProgramId}/`)} disabled={!anyOccurrences}>
          <ListItemIcon>
            <HowToReg fontSize="small" color="primary"/>
          </ListItemIcon>
          <Typography variant="inherit">Register</Typography>
        </MenuItem>

        <MenuItem onClick={handleLink(`/referrals/new/${clientId}/${needId}/${type}/${serviceOrProgramId}/`)}>
          <ListItemIcon>
            <GroupAdd fontSize="small" color="secondary"/>
          </ListItemIcon>
          <Typography variant="inherit">Make a referral</Typography>
        </MenuItem>

      </Menu>
    </div>
  );
}
