import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

export function EnhancedTableHead(props) {
  const {
    classes, onSelectAllClick, order, orderBy, numSelected,
    rowCount, onRequestSort, columns
  } = props;
  const createSortHandler = (getFieldValueFn) => (event) => {
    onRequestSort(event, getFieldValueFn);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" key={0}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {columns.map((headCell, idx) => (
          <TableCell
            key={idx + 1}
            style={headCell.style}
            sortDirection={orderBy === (headCell.sortBy || headCell.body) ? order : false}
          >
            <TableSortLabel
              active={orderBy === (headCell.sortBy || headCell.body)}
              direction={orderBy === (headCell.sortBy || headCell.body) ? order : 'asc'}
              onClick={createSortHandler(headCell.sortBy || headCell.body)}
            >
              {headCell.label}
              {orderBy === headCell.label ? (
                <span className={classes.sortSpan}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};
