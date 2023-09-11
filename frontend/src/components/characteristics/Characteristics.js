import React, {useEffect, useState} from 'react';
import {
  Chip, Container, IconButton, Button, Box
} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon} from "@mui/icons-material";
import {DeleteModal, Loading, DataTable, Link} from "../shared";
import SelectField from "../shared/fields/SelectField";
import GeneralField from "../shared/fields/GeneralField";
import {useNavigate} from "react-router-dom";
import {fetchCharacteristics, deleteCharacteristic, fetchCharacteristicsDataTypes} from "../../api/characteristicApi";
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

export default function Characteristics() {
  const [state, setState] = useState({
    loading: true,
    // value: {},
    selectedId: null,
    selectedName: '',
    showErrorDialog: false,
    showDeleteDialog: false,
    loadingButton: false
  });
  const [form, setForm] = useState(
    []
  )
  const [dataTypes, setDataTypes] = useState({})
  const [errors, setErrors] = useState(
    {}
  )
  const [trigger, setTrigger] = useState(
    false
  )
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchCharacteristics().then(res => {
        if (res.success) {
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
      }
    ),
      fetchCharacteristicsDataTypes().then(newDataTypes =>setDataTypes(newDataTypes))]).then(
        setState(state => ({...state, loading: false}))).catch(e => {
      if (e.json) {
        setErrors(e.json)
      }
      setState(state => ({...state, loading: false, showErrorDialog: true}))
    })

  }, [trigger]);

  const showDeleteDialog = (id, name) => () => {
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
    try {
      await deleteCharacteristic(state.selectedId);
      setState(state => ({
        ...state, showDeleteDialog: false, selectedId: null, selectedName: '', loadingButton: false,
        // data: state.data.filter(item => item.id !== state.selectedId)
      }))
      setTrigger(!trigger)
      // setForm(form.filter(item => item.id !== state.selectedId))
    } catch (e) {
      if (e.json)
        setErrors(e.json)
      setState(state => ({
        ...state,
        showDeleteDialog: false,
        selectedId: null,
        selectedName: '',
        loadingButton: false,
        showErrorDialog: true
      }))
    }
  }

  const columns = [
    {
      label: 'Name',
      body: ({name, id}) => <Link color to={`/characteristic/${id}/edit`}>{name}</Link>,
      sortBy: ({name}) => name,
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
      body: ({dataType}) => dataTypes[dataType]
    },
    {
      label: ' ',
      body: ({id, name}) => {
        return (
          <span>
              <IconButton
                onClick={() => navigate('/characteristic/' + id + '/edit')}
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
        title={"Characteristics"}
        data={form}
        columns={columns}
        customToolbar={<Chip
          onClick={() => {
            navigate('/characteristic/add')
          }}
          color="primary"
          icon={<AddIcon/>}
          label="Add"
          variant="outlined"/>}
      />

      <AlertDialog dialogContentText={errors.message || "Error occurs"}
                   dialogTitle={'Fail'}
                   buttons={[<Button onClick={() => {
                     navigate('/dashboard')
                   }} key={'fail'}>{'ok'}</Button>]}
                   open={state.showErrorDialog}/>
      <AlertDialog dialogContentText={'Are you sure to delete Characteristic ' + state.selectedName}
                   dialogTitle={'Delete characteristic'}
                   buttons={[<Button onClick={handleCancel} key={'Cancel'}>{'cancel'}</Button>,
                     <LoadingButton noDefaultStyle variant="text" color="primary" loading={state.loadingButton}
                                    key={'confirm'}
                                    onClick={handleConfirm} children='confirm' autoFocus/>]}
                   open={state.showDeleteDialog}/>
    </Container>
  );
}
