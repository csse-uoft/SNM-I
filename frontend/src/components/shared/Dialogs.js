import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export function AlertDialog({cancelButtonText='Cancel', confirmButtonText='Confirm', ...restProps}) {

  return (
    <div>

      <Dialog
        open={true}
        onClose={restProps.handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {restProps.dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {restProps.dialogContentText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={restProps.handleCancel}>{cancelButtonText}</Button>
          <Button onClick={restProps.handleConfirm} autoFocus>
            {confirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}