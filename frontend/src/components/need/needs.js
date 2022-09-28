import React, {useEffect, useState} from 'react';
import {
  Chip, Container, IconButton, Dialog, DialogActions, DialogTitle, DialogContent,
  Button, Box
} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon} from "@mui/icons-material";
import {DeleteModal, Loading, DataTable} from "../shared";
import {useNavigate} from "react-router-dom";
import {fetchCharacteristics, deleteCharacteristic, fetchCharacteristicsDataTypes} from "../../api/characteristicApi";
import {AlertDialog} from "../shared/Dialogs";
import LoadingButton from "../shared/LoadingButton";
import {deleteNeed, fetchNeeds} from "../../api/needApi";
import {useSnackbar} from "notistack";

const useStyles = makeStyles(() => ({
  button: {
    padding: 4
  },
  formControl: {
    margin: null,
  },
}));

export default function Needs() {
  const [state, setState] = useState({
    loading: true,
    // value: {},
    selectedId: null,
    showDeleteDialog: false,
    loadingButton: false
  });
  const {enqueueSnackbar} = useSnackbar();
  const [form, setForm] = useState(
    []
  )
  const [trigger, setTrigger] = useState(
    false
  )
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchNeeds().then(res => {
        if (res.success) {
          setForm(res.needs.map(need => {
            return {
              id: need._id,
              type: need.type,
              changeType: need.changeType,
              characteristic: need.characteristic.name,
              codes: need.codes
            }
          }))
        }
      }
    ),]).then(
      setState(state => ({...state, loading: false}))).catch(e => {
      setState(state => ({...state, loading: false,}));
      enqueueSnackbar(`Error: ${e.message}`, {variant: 'error'});
    })

  }, [trigger]);

  const showDeleteDialog = (id) => () => {
    setState(state => ({
      ...state, selectedId: id, showDeleteDialog: true,
    }));
  };

  const handleCancel = () => {
    setState(state => ({
      ...state, selectedId: null, showDeleteDialog: false
    }))
  }

  const handleConfirm = async () => {
    try {
      await deleteNeed(state.selectedId);
      setState(state => ({
        ...state, showDeleteDialog: false, selectedId: null, loadingButton: false,
      }))
      setTrigger(!trigger)
      // setForm(form.filter(item => item.id !== state.selectedId))
    } catch (e) {
      setState(state => ({
        ...state,
        showDeleteDialog: false,
        selectedId: null,
        loadingButton: false,
      }))
      enqueueSnackbar(`Error: ${e.message}`, {variant: 'error'});
    }
  }

  const columns = [
    {
      label: 'Type',
      body: ({type}) => <Box sx={{width: '60%'}}>{type}</Box>
    },
    {
      label: 'Change Type',
      body: ({changeType}) => changeType
    },
    {
      label: 'characteristic',
      body: ({characteristic}) => characteristic
    },
    {
      label: ' ',
      body: ({id}) => {
        return (
          <span>
              <IconButton
                onClick={() => navigate('/need/' + id + '/edit')}
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

  if (state.loading)
    return <Loading message={`Loading needs...`}/>;

  return (
    <Container>
      <DataTable
        title={"needs"}
        data={form}
        columns={columns}
        customToolbar={<Chip
          onClick={() => {
            navigate('/need/add')
          }}
          color="primary"
          icon={<AddIcon/>}
          label="Add"
          variant="outlined"/>}
      />

      <AlertDialog dialogContentText={'Are you sure to delete Need_' + state.selectedId}
                   dialogTitle={'Delete Need'}
                   buttons={[<Button onClick={handleCancel} key={'Cancel'}>{'cancel'}</Button>,
                     <LoadingButton noDefaultStyle variant="text" color="primary" loading={state.loadingButton}
                                    key={'confirm'}
                                    onClick={handleConfirm} children='confirm' autoFocus/>]}
                   open={state.showDeleteDialog}/>
    </Container>
  );
}
