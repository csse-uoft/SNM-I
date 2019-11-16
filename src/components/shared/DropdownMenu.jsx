import _ from 'lodash';
import React from 'react';
import { Glyphicon, Dropdown, MenuItem } from 'react-bootstrap';

export default function DropdownMenu({ urlPrefix, objectId, handleShow, hideViewOption }) {
  console.log("-------->dropdown");
  return (
    <Dropdown
      id="dropdown-menu"
      className="vertical-options"
      pullRight
    >
      <Dropdown.Toggle noCaret>
        <Glyphicon glyph="option-vertical" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {!hideViewOption &&
          <MenuItem
            eventKey="1"
            href={`/${urlPrefix}/${objectId}`}
//            target="_blank"
          >
            View
            <Glyphicon glyph="file" />
          </MenuItem>
        }
        <MenuItem
          eventKey="2"
          href={`/${urlPrefix}/${objectId}/edit`}
//          target="_blank"
        >
          Edit
          <Glyphicon glyph="pencil" />
        </MenuItem>
        <MenuItem divider />
        <MenuItem
          eventKey="3"
          onClick={() => handleShow(objectId)}
        >
          Delete
          <Glyphicon glyph="trash" />
        </MenuItem>
      </Dropdown.Menu>
    </Dropdown>
  );
}
