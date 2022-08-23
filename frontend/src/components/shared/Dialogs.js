import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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