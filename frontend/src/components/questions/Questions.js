import {makeStyles} from "@mui/styles";
import {useHistory} from "react-router";
import React, {useEffect, useState} from "react";
import {deleteQuestion, fetchQuestions} from "../../api/questionApi";
import {Box, Button, Chip, Container, IconButton} from "@mui/material";
import {Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon} from "@mui/icons-material";
import {DataTable, Loading} from "../shared";
import {AlertDialog} from "../shared/Dialogs";
import LoadingButton from "../shared/LoadingButton";
import {deleteCharacteristic} from "../../api/characteristicApi";

const useStyles = makeStyles(() => ({
  button: {
    padding: 4
  },
  formControl: {
    margin: null,
  },
}));

export default function Questions() {
  const [state, setState] = useState({
    loading: true,
    selectedId: null,
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
    fetchQuestions().then(res => {
      if(res.success){
        setForm(res.data)
      }
      setState(state => ({...state, loading: false}))
    }).catch(e => {
      if(e.json)
        setErrors(e.json)
      setState(state => ({...state, loading: false, showErrorDialog: true}))
    })
  },[trigger])

  const showDeleteDialog = (id) => () => {
    setState(state => ({
      ...state, selectedId: id, showDeleteDialog: true,
    }));
  };


  const columns = [
    {
      label: 'id',
      body: ({id}) => <Box sx={{width: '60%'}}>{id}</Box>
    },
    {
      label: 'Content',
      body: ({content}) => <Box sx={{width: '60%'}}>{content}</Box>
    },
    {
      label: 'Description',
      body: ({description}) => description
    },
    {
      label: ' ',
      body: ({id}) => {
        return (
          <span>
              <IconButton
                onClick={() => history.push('/question/'+ id + '/edit')}
                className={classes.button}
                size="large">
                <EditIcon fontSize="small" color="primary"/>
              </IconButton>
              <IconButton
                onClick={showDeleteDialog(id)}
                className={classes.button}
                size="large">
                <DeleteIcon fontSize="small" color="secondary"/>
              </IconButton>
            </span>
        );
      }
    }
  ];

  const handleCancel = () => {
    setState(state => ({
      ...state, selectedId: null, showDeleteDialog: false,
    }))
  }

  const handleConfirm = async () => {
    try{
      await deleteQuestion(state.selectedId);
      setState(state => ({
        ...state, showDeleteDialog: false, selectedId: null, loadingButton: false,
      }))
      setTrigger(!trigger)
    }catch (e){
      if(e.json)
        setErrors(e.json)
      setState(state => ({
        ...state, showDeleteDialog: false, selectedId: null, loadingButton: false, showErrorDialog: true
      }))
    }
  }


  if (state.loading)
    return <Loading message={`Loading characteristics...`}/>;

  return (
    <Container>
      <DataTable
        title={"Questions"}
        data={form}
        columns={columns}
        customToolbar={<Chip
          onClick={() => {history.push('question/add')}}
          color="primary"
          icon={<AddIcon/>}
          label="Add"
          variant="outlined"/>}
      />

      <AlertDialog dialogContentText={errors.message || "Error occurs"}
                   dialogTitle={'Fail'}
                   buttons={[<Button onClick={() => {history.push('/dashboard')}} key={'fail'}>{'ok'}</Button>]}
                   open={state.showErrorDialog}/>
      <AlertDialog dialogContentText={'Are you sure to delete Question ' + state.selectedId}
                   dialogTitle={'Delete question'}
                   buttons={[<Button onClick={handleCancel} key={'Cancel'}>{'cancel'}</Button>,
                     <LoadingButton noDefaultStyle variant="text" color="primary" loading={state.loadingButton}
                                    key={'confirm'}
                                    onClick={handleConfirm} children='confirm' autoFocus/>]}
                   open={state.showDeleteDialog}/>
    </Container>
  );
}