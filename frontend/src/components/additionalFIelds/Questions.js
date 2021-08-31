import React, { useEffect, useState } from 'react';
import { fetchQuestions, updateQuestion, deleteQuestion, createQuestion } from '../../api/questionApi';
import {
  Chip, Container, IconButton, Dialog, DialogActions, DialogTitle, DialogContent,
  Button
} from "@material-ui/core";
import makeStyles from '@material-ui/styles/makeStyles';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@material-ui/icons";
import { DeleteModal, Loading, DataTable } from "../shared";
import SelectField from "../shared/fields/SelectField";
import GeneralField from "../shared/fields/GeneralField";

const useStyles = makeStyles(() => ({
  button: {
    padding: 4
  },
  formControl: {
    margin: null,
  },
}));

const ADD_TITLE = 'Add Question';
const EDIT_TITLE = 'Edit Question';
const contentTypeOptions = {
  provider: 'Provider',
};

function AddEditDialog({open, title, value, objectId, handleConfirm, handleClose}) {
  const [err, setErr] = useState({
    type: '',
    value: '',
  });

  /**
   * @returns {boolean} true if passed.
   */
  const check = () => {
    const newErr = {};
    if (value.content_type === '')
      newErr.content_type = 'This field is required';
    if (value.text === '')
      newErr.text = 'This field is required';
    setErr(newErr);
    return value.content_type !== '' && value.text !== '';
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <SelectField
          label={'Content type'}
          value={value.content_type}
          options={contentTypeOptions}
          onChange={(e) => value.content_type = e.target.value}
          disabled={title === EDIT_TITLE}
          formControlProps={{fullWidth: true}}
          error={!!err.content_type}
          helperText={err.content_type}
          required noDefaultStyle noEmpty
        />
        <GeneralField
          label="Question"
          value={value.text}
          onChange={e => value.text = e.target.value}
          error={!!err.text}
          helperText={err.text}
          fullWidth
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

export default function Questions() {
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
    fetchQuestions().then(data => {
      setState(state => ({...state, loading: false, data}));
    });
  }, []);

  const showDeleteDialog = (id, title) => () => {
    setState(state => ({
      ...state, selectedId: id, showDeleteDialog: true,
      deleteDialogTitle: 'Delete ' + title + ' ?'
    }));
  };

  const showEditDialog = (text, type, id) => () => setState(state => ({
    ...state,
    value: {id, text, content_type: type},
    selectedId: id,
    showAddEditDialog: true,
    dialogTitle: EDIT_TITLE,
  }));

  const showAddDialog = () => setState(state => ({
    ...state,
    value: {text: '', content_type: ''},
    showAddEditDialog: true,
    dialogTitle: ADD_TITLE,
  }));

  const handleAdd = async () => {
    try {
      const newItem = await createQuestion(state.value);
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
      await deleteQuestion(id, form);
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
      const newItem = await updateQuestion(state.value.id, state.value);
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
      name: 'text',
      label: 'Text',
      options: {
        setCellHeaderProps: () => ({style: {width: '60%'}})
      }
    },
    {
      name: 'content_type',
      label: 'Content type'
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
                onClick={showEditDialog(...rowData)}
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
    return <Loading message={`Loading questions...`}/>;

  return (
    <Container>
      <DataTable
        title={"Questions"}
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
        objectId={state.selectedId}
        title={state.dialogTitle}
        handleClose={() => setState(state => ({...state, showAddEditDialog: false}))}
        handleConfirm={state.dialogTitle === ADD_TITLE ? handleAdd : handleEdit}
      />
    </Container>
  );
}
