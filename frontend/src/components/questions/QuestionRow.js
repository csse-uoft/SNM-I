import React from 'react';
import DropdownMenu from '../shared/DropdownMenu'

export default function uestionRow({ question, handleShow }) {
  return(
    <tr>
      <td>
        {question.content_type}
      </td>
      <td>
        {question.text}
      </td>
      <td>
        <DropdownMenu
          hideViewOption
          urlPrefix="questions"
          objectId={question.id}
          handleShow={handleShow}
        />
      </td>
    </tr>
  )
}
