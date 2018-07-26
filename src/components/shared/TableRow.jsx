import React from 'react';

export default function TableRow({ title, value }) {
  if (value) {
    return (
      <tr>
        <td><b>{title}</b></td>
        <td>{value}</td>
      </tr>
    );
  } else {
    return null;
  }
}
