import React, { useState, useCallback } from 'react';
import Switch  from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function RequiredSwitch({checked: defaultChecked, onChange}) {

  const handleChange = useCallback((e, checked) => {
    onChange(checked)
  }, [onChange]);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography>Not Required</Typography>
      <Switch defaultChecked={defaultChecked} onChange={handleChange}/>
      <Typography>Required</Typography>
    </Stack>
  )
}