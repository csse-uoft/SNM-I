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
          <DialogContentText>
            {props.dialogContentText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {props.buttons}
          {/*{Object.entries(props.buttons).map(([buttonText, handleClicking]) => {*/}

          {/*  return (*/}

          {/*    <Button*/}
          {/*      key={buttonText}*/}
          {/*      onClick={handleClicking}>*/}
          {/*      {buttonText}*/}
          {/*    </Button>*/}
          {/*  )*/}
          {/*})}*/}
          {/*<Button onClick={props.handleCancel}>{cancelButtonText}</Button>*/}
          {/*<Button onClick={props.handleConfirm} autoFocus>*/}
          {/*  {confirmButtonText}*/}
          {/*</Button>*/}
        </DialogActions>
      </Dialog>
  );
}