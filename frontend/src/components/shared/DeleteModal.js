import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";

export default function DeleteModal({show, onHide, title, objectId, ...props}) { // cannot use keyword "delete"
  const [form, setForm] = useState({reason: ''});

  return (
    <Dialog
      open={show}
      onClose={onHide}
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField value={form.reason} label="Reason" sx={{mt: 2}}
                   onChange={e => setForm({reason: e.target.value})} fullWidth/>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={() => props.delete(objectId, form)}>Confirm</Button>
        <Button onClick={onHide}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
