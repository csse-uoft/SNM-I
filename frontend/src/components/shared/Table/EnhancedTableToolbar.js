import { IconButton, lighten, Toolbar, Tooltip, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import PropTypes from "prop-types";
import React from "react";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.mode === 'light'
      ? {
        color: theme.palette.primary.main,
        backgroundColor: lighten(theme.palette.primary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

export const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {numSelected, title, onDelete, customToolbar} = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={onDelete} size="large">
            <DeleteIcon/>
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Search">
        <IconButton aria-label="search list" size="large">
          <SearchIcon/>
        </IconButton>
      </Tooltip>
      {customToolbar}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};
