import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';


export default function TR({ title, value }) {
  if (value) {
    return (
      <TableRow key={title}>
        <TableCell component="th" scope="row">
          {title}
        </TableCell>
        <TableCell align="left">{value}</TableCell>
      </TableRow>
    );
  } else {
    return null;
  }
}
