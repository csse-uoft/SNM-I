import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {userInvitationFields} from "../../constants/userInvitationFields";

export function AlertDialog(props) {

  return (

      <Dialog
        open={props.open}
      >
        <DialogTitle>
          {props.dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{whiteSpace: 'pre'}}>
            {props.dialogContentText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {props.buttons}
        </DialogActions>
      </Dialog>
  );
}