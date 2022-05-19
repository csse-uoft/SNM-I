import React from 'react';
import { InputBase, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export default function CSVUploadModal({show, onHide, submit}) {
  return (
    <Dialog
      open={show}
      onClose={onHide}
    >
      <DialogTitle id="form-dialog-title">Upload CSV</DialogTitle>
      <DialogContent>
        <InputBase type="file"/>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={submit}>Submit</Button>
        <Button onClick={onHide}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
