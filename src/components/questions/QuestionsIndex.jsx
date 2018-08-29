import React from 'react';
import { Table } from 'react-bootstrap';

export default function QuestionsIndex({ children }) {
  return(
    <Table
      className="dashboard-table"
      striped
      bordered
      condensed
      hover
    >
      <thead>
        <tr>
          <th>Type</th>
          <th>Text</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </Table>
  )
}
