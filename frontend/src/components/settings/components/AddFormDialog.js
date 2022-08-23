import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AddFormDialog({open, handleAdd, handleClose}) {

  const [name, setName] = useState('');

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add new form</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the form name.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Form name"
          fullWidth
          variant="standard"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => handleAdd(name)}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}