import React, { useEffect, useState} from 'react';
import { fetchQuestions, updateQuestion, deleteQuestion, createQuestion } from '../../api/mockedApi/question';
import {
  Chip, Container, IconButton, Dialog, DialogActions, DialogTitle, DialogContent,
  Button, Box
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { DeleteModal, Loading, DataTable } from "../shared";
import SelectField from "../shared/fields/SelectField";
import GeneralField from "../shared/fields/GeneralField";
import {useHistory} from "react-router";
import {fetchCharacteristics, deleteCharacteristic} from "../../api/characteristicApi";
import {AlertDialog} from "../shared/Dialogs";
import LoadingButton from "../shared/LoadingButton";

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

// function AddEditDialog({open, title, value, objectId, handleConfirm, handleClose}) {
//   const [err, setErr] = useState({
//     type: '',
//     value: '',
//   });
//
//   /**
//    * @returns {boolean} true if passed.
//    */
//   const check = () => {
//     const newErr = {};
//     if (value.content_type === '')
//       newErr.content_type = 'This field is required';
//     if (value.text === '')
//       newErr.text = 'This field is required';
//     setErr(newErr);
//     return value.content_type !== '' && value.text !== '';
//   };
//
//   return (
//     <Dialog open={open} onClose={handleClose} fullWidth>
//       <DialogTitle>{title}</DialogTitle>
//       <DialogContent>
//         <Box sx={{mt: 2}}/>
//         <SelectField
//           label={'Content type'}
//           value={value.content_type}
//           options={contentTypeOptions}
//           onChange={(e) => value.content_type = e.target.value}
//           disabled={title === EDIT_TITLE}
//           formControlProps={{fullWidth: true}}
//           error={!!err.content_type}
//           helperText={err.content_type}
//           required noDefaultStyle noEmpty
//         />
//         <GeneralField
//           label="Question"
//           value={value.text}
//           onChange={e => value.text = e.target.value}
//           error={!!err.text}
//           helperText={err.text}
//           fullWidth
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button
//           onClick={() => {
//             if (check()) {
//               handleConfirm();
//             }
//           }}
//           color="primary">
//           Confirm
//         </Button>
//         <Button onClick={handleClose}>
//           Cancel
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

export default function Characteristics() {
  const [state, setState] = useState({
    loading: true,
    value: {},
    selectedId: null,
    selectedName: '',
    showErrorDialog: false,
    showDeleteDialog: false,
    loadingButton: false
  });
  const [form, setForm] = useState(
    []
  )
  const [errors, setErrors] = useState(
    {}
  )
  const[trigger, setTrigger] = useState(
    false
  )
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    fetchCharacteristics().then(res => {
      if(res.success){
        setForm(res.data.map(characteristic => {
          return {
            id: characteristic.id,
            label: characteristic.implementation.label,
            name: characteristic.name,
            fieldType: characteristic.implementation.fieldType.label,
            dataType: characteristic.implementation.valueDataType
          }
        }))
      }
      setState(state => ({...state, loading: false}))
      }
    ).catch(e => {
      if(e.json){
        setErrors(e.json)
        setState(state => ({...state, loading: false, showErrorDialog: true}))
      }
    });
  }, [trigger]);

  const showDeleteDialog = (id,name) => () => {
    setState(state => ({
      ...state, selectedId: id, showDeleteDialog: true, selectedName: name
    }));
  };

  const handleCancel = () => {
    setState(state => ({
      ...state, selectedId: null, showDeleteDialog: false, selectedName: ''
    }))
  }

  const handleConfirm = async () => {
    try{
      await deleteCharacteristic(state.selectedId);
      setState(state => ({
        ...state, showDeleteDialog: false, selectedId: null, selectedName: '', loadingButton: false,
        // data: state.data.filter(item => item.id !== state.selectedId)
      }))
      setTrigger(!trigger)
      // setForm(form.filter(item => item.id !== state.selectedId))
    }catch (e){

    }
  }

  // const showEditDialog = (text, type, id) => () => setState(state => ({
  //   ...state,
  //   value: {id, text, content_type: type},
  //   selectedId: id,
  //   showAddEditDialog: true,
  //   dialogTitle: EDIT_TITLE,
  // }));

  // const showAddDialog = () => setState(state => ({
  //   ...state,
  //   value: {text: '', content_type: ''},
  //   showAddEditDialog: true,
  //   dialogTitle: ADD_TITLE,
  // }));

  // const handleAdd = async () => {
  //   try {
  //     const newItem = await createQuestion(state.value);
  //     setState(state => ({
  //       ...state, showAddEditDialog: false,
  //       data: [...state.data, newItem]
  //     }));
  //   } catch (e) {
  //     // TODO: show error
  //     console.error(e);
  //   }
  // };

  const handleDelete = async (id, form) => {
    try {
      await deleteCharacteristic(id);
      setState(state => ({
        ...state, showDeleteDialog: false,
        data: state.data.filter(item => item.id !== state.selectedId)
      }));
    } catch (e) {
      // TODO: show error
      console.error(e);
    }
  };

  // const handleEdit = async () => {
  //   try {
  //     const newItem = await updateQuestion(state.value.id, state.value);
  //     setState(state => ({
  //       ...state, showAddEditDialog: false,
  //       data: state.data.map(item => item.id === state.selectedId ? newItem : item),
  //     }));
  //   } catch (e) {
  //     // TODO: show error
  //     console.error(e);
  //   }
  // };

  const columns = [
    {
      label: 'Name',
      body: ({name}) => <Box sx={{width: '60%'}}>{name}</Box>
    },
    {
      label: 'Label',
      body: ({label}) => label
    },
    {
      label: 'Field Type',
      body: ({fieldType}) => fieldType
    },
    {
      label: 'Data Type',
      body: ({dataType}) => dataType
    },
    {
      label: ' ',
      body: ({id, name}) => {
        return (
          <span>
              <IconButton
                onClick={() => history.push('/characteristics/'+ id + '/edit')}
                className={classes.button}
                size="large">
                <EditIcon fontSize="small" color="primary"/>
              </IconButton>
              <IconButton
                onClick={showDeleteDialog(id, name)}
                className={classes.button}
                size="large">
                <DeleteIcon fontSize="small" color="secondary"/>
              </IconButton>
            </span>
        );
      }
    }
  ];

  if (state.loading)
    return <Loading message={`Loading characteristics...`}/>;

  return (
    <Container>
      <DataTable
        title={"Questions"}
        data={form}
        columns={columns}
        customToolbar={<Chip
          onClick={() => {history.push('characteristics/add')}}
          color="primary"
          icon={<AddIcon/>}
          label="Add"
          variant="outlined"/>}
      />
      {/*<DeleteModal*/}
      {/*  objectId={state.selectedId}*/}
      {/*  title={state.deleteDialogTitle}*/}
      {/*  show={state.showDeleteDialog}*/}
      {/*  onHide={() => setState(state => ({...state, showDeleteDialog: false}))}*/}
      {/*  delete={handleDelete}*/}
      {/*/>*/}
      {/*<AddEditDialog*/}
      {/*  open={state.showAddEditDialog}*/}
      {/*  value={state.value}*/}
      {/*  objectId={state.selectedId}*/}
      {/*  title={state.dialogTitle}*/}
      {/*  handleClose={() => setState(state => ({...state, showAddEditDialog: false}))}*/}
      {/*  handleConfirm={state.dialogTitle === ADD_TITLE ? handleAdd : handleEdit}*/}
      {/*/>*/}
      <AlertDialog dialogContentText={errors.message || "Error occurs"}
                   dialogTitle={'Fail'}
                   buttons={[<Button onClick={() => {history.push('/dashboard')}} key={'fail'}>{'ok'}</Button>]}
                   open={state.showErrorDialog}/>
      <AlertDialog dialogContentText={'Are you sure to delete ' + state.selectedName}
                   dialogTitle={'Delete characteristics'}
                   buttons={[<Button onClick={handleCancel} key={'Cancel'}>{'cancel'}</Button>,
                     <LoadingButton noDefaultStyle variant="text" color="primary" loading={state.loadingButton}
                                    key={'confirm'}
                                    onClick={handleConfirm} children='confirm' autoFocus/>]}
                   open={state.showDeleteDialog}/>
    </Container>
  );
}
