import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';


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
