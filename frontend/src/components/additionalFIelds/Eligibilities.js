import React, { useEffect, useState } from 'react';
import { fetchEligibilities, deleteEligibility, createEligibility, updateEligibility } from '../../api/eligibilityApi';
import MUIDataTable from "mui-datatables";
import {
  Chip, Container, IconButton, Dialog, DialogActions, DialogTitle, DialogContent,
  Button
} from "@material-ui/core";
import makeStyles from '@material-ui/styles/makeStyles';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@material-ui/icons";
import { DeleteModal, Loading } from "../shared";
import GeneralField from "../shared/fields/GeneralField";

const useStyles = makeStyles(() => ({
  button: {
    padding: 4
  }
}));

const ADD_TITLE = 'Add Eligibility Criteria';
const EDIT_TITLE = 'Edit Eligibility Criteria';

function AddEditDialog({open, title, value, handleConfirm, handleClose}) {
  const [err, setErr] = useState({
    title: '',
  });

  /**
   * @returns {boolean} true if passed.
   */
  const check = () => {
    const newErr = {};
    if (value.title === '')
      newErr.title = 'This field is required';
    setErr(newErr);
    return value.title !== '';
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <GeneralField
          autoFocus
          label="Eligible criteria"
          value={value.title}
          onChange={e => value.title = e.target.value}
          error={!!err.title}
          helperText={err.title}
          fullWidth
          InputLabelProps={{}}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            if (check()) {
              handleConfirm();
            }
          }}
          color="primary">
          Confirm
        </Button>
        <Button onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Eligibilities() {
  const [state, setState] = useState({
    loading: true,
    data: [],
    value: {},
    selectedId: null,
    deleteDialogTitle: '',
    showDeleteDialog: false,
    dialogTitle: '',
    showAddEditDialog: false,
  });
  const classes = useStyles();

  useEffect(() => {
    fetchEligibilities().then(data => {
      setState(state => ({...state, loading: false, data}));
    });
  }, []);

  const showDeleteDialog = (id, title) => () => {
    setState(state => ({
      ...state, selectedId: id, showDeleteDialog: true,
      deleteDialogTitle: 'Delete ' + title + ' ?'
    }));
  };

  const shoeEditDialog = (title, id) => () => setState(state => ({
    ...state,
    selectedId: id,
    value: {title, id},
    showAddEditDialog: true,
    dialogTitle: EDIT_TITLE,
  }));

  const showAddDialog = () => setState(state => ({
    ...state,
    value: {title: ''},
    showAddEditDialog: true,
    dialogTitle: ADD_TITLE,
  }));

  const handleAdd = async () => {
    try {
      const newItem = await createEligibility(state.value);
      setState(state => ({
        ...state, showAddEditDialog: false,
        data: [...state.data, newItem]
      }));
    } catch (e) {
      // TODO: show error
      console.error(e);
    }
  };

  const handleDelete = async (id, form) => {
    try {
      await deleteEligibility(id, form);
      setState(state => ({
        ...state, showDeleteDialog: false,
        data: state.data.filter(item => item.id !== state.selectedId)
      }));
    } catch (e) {
      // TODO: show error
      console.error(e);
    }
  };

  const handleEdit = async () => {
    try {
      const newItem = await updateEligibility(state.value.id, state.value);
      setState(state => ({
        ...state, showAddEditDialog: false,
        data: state.data.map(item => item.id === state.selectedId ? newItem : item),
      }));
    } catch (e) {
      // TODO: show error
      console.error(e);
    }
  };

  const columns = [
    {
      name: 'title',
      label: 'Title',
      options: {
        setCellHeaderProps: () => ({style: {width: '80%'}})
      }
    },
    {
      name: 'id',
      label: ' ',
      options: {
        sort: false,
        filter: false,
        viewColumns: false,
        searchable: false,
        download: false,
        customBodyRender: (id, {rowData}) => {
          return (
            <span>
              <IconButton
                onClick={shoeEditDialog(...rowData)}
                className={classes.button}
                size="large">
                <EditIcon fontSize="small" color="primary"/>
              </IconButton>
              <IconButton
                onClick={showDeleteDialog(id, rowData[0])}
                className={classes.button}
                size="large">
                <DeleteIcon fontSize="small" color="secondary"/>
              </IconButton>
            </span>
          );
        }
      }
    }
  ];

  if (state.loading)
    return <Loading message={`Loading eligibilities...`}/>;

  return (
    <Container>
      <MUIDataTable
        title={"Eligibility Criteria"}
        data={state.data}
        columns={columns}
        options={{
          filter: false,
          selectableRows: 'none',
          responsive: 'scrollMaxHeight',
          customToolbar: () =>
            <Chip
              onClick={showAddDialog}
              color="primary"
              icon={<AddIcon/>}
              label="Add"
              variant="outlined"/>
        }}
      />
      <DeleteModal
        objectId={state.selectedId}
        title={state.deleteDialogTitle}
        show={state.showDeleteDialog}
        onHide={() => setState(state => ({...state, showDeleteDialog: false}))}
        delete={handleDelete}
      />
      <AddEditDialog
        open={state.showAddEditDialog}
        value={state.value}
        title={state.dialogTitle}
        handleClose={() => setState(state => ({...state, showAddEditDialog: false}))}
        handleConfirm={state.dialogTitle === ADD_TITLE ? handleAdd : handleEdit}
      />
    </Container>
  );
}
