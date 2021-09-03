import React from "react";
import {
  Checkbox,
  lighten,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import makeStyles from '@material-ui/styles/makeStyles';
import { visuallyHidden } from "@material-ui/utils";
import { EnhancedTableHead } from "./EnhancedTableHead";
import { EnhancedTableToolbar } from "./EnhancedTableToolbar";

function descendingComparator(a, b, getValue, extraData) {
  b = getValue(b, extraData) || '';
  a = getValue(a, extraData) || '';
  if (b < a) {
    return -1;
  }
  if (b > a) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy, extraData) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy, extraData)
    : (a, b) => -descendingComparator(a, b, orderBy, extraData);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
  },
  table: {
    minWidth: 750,
  },
  // TODO fix #20379.
  sortSpan: visuallyHidden,
  tableRow: {
    '&.Mui-selected': {
      backgroundColor: lighten(theme.palette.primary.light, 0.85),
    },
    '&.Mui-selected:hover': {
      backgroundColor: lighten(theme.palette.primary.light, 0.80),
    }
  }
}));

export function EnhancedTable({data, title, columns, height, ...props}) {
  const {
    rowsPerPageOptions = [10, 25, 100],
    idField = '_id',
    defaultOrderBy = columns[0].sortBy || columns[0].body,
    extraData = {},
    rowStyle,
    onDelete,
    onChangePage, onChangeRowsPerPage,
    customToolbar
  } = props;
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(() => defaultOrderBy);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);

  const handleRequestSort = (event, getFieldValueFn) => {
    const isAsc = orderBy === getFieldValueFn && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(() => getFieldValueFn);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(data.map(item => item[idField]));
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);

    // Invoke listeners
    if (onChangePage)
      onChangePage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const rowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(rowsPerPage);
    setPage(0);

    // Invoke listeners
    if (onChangePage)
      onChangePage(0);
    if (onChangeRowsPerPage)
      onChangeRowsPerPage(rowsPerPage)
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleDelete = async () => {
    // TODO: Show delete progressively.
    if (onDelete) {
      await onDelete(selected);
      for (const id of selected) {
        data.splice(data.findIndex(item => item._id === id), 1);
      }
      setSelected([]);
    }
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <Paper elevation={5} className={classes.paper}>
      <EnhancedTableToolbar title={title} numSelected={selected.length} onDelete={handleDelete}
                            customToolbar={customToolbar}/>
      <TableContainer style={{maxHeight: height || 'calc(100vh - 228px)'}}>
        <Table
          stickyHeader
          className={classes.table}
          size="medium"
        >
          <EnhancedTableHead
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            columns={columns}
          />
          <TableBody>
            {stableSort(data, getComparator(order, orderBy, extraData))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                const id = row[idField];
                const isItemSelected = isSelected(id);
                return (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={id}
                    selected={isItemSelected}
                    style={rowStyle && rowStyle(row)}
                  >
                    <TableCell padding="checkbox" key={0}>
                      <Checkbox
                        color="primary"
                        onClick={(event) => handleClick(event, id)}
                        checked={isItemSelected}
                      />
                    </TableCell>
                    {columns.map((cell, idx) => <TableCell style={cell.style}
                                                           key={idx + 1}>{cell.body(row, extraData)}</TableCell>)}
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows,
                }}
              >
                <TableCell colSpan={6}/>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
