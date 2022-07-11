import React, { useEffect, useState } from 'react';
import { Chip, Container } from "@mui/material";
import { Add as AddIcon, Check as YesIcon } from "@mui/icons-material";
import { DeleteModal, DropdownMenu, Link, Loading, DataTable } from "./shared";
import { deleteUser, fetchUsers } from "../api/userApi";
import { useHistory } from "react-router";
import { formatPhoneNumber } from "../helpers/phone_number_helpers";

export default function Users() {
  const history = useHistory();
  const [state, setState] = useState({
    loading: true,
    data: [],
    selectedId: null,
    deleteDialogTitle: '',
    showDeleteDialog: false,
  });

  useEffect(() => {
    fetchUsers().then(data => {
      // console.log(data)
      setState(state => ({...state, loading: false, data: data.data}));

    });
  }, []);

  const showDeleteDialog = (id, title) => () => {
    setState(state => ({
      ...state, selectedId: id, showDeleteDialog: true,
      deleteDialogTitle: 'Delete ' + title + ' ?'
    }));
  };

  const handleDelete = async (id, form) => {
    try {
      await deleteUser(id, form);
      setState(state => ({
        ...state, showDeleteDialog: false,
        data: state.data.filter(item => item.id !== state.selectedId)
      }));
    } catch (e) {
      // TODO: show error
      console.error(e);
    }
  };

  const columns = [
    {
      label: 'Username',
      body: ({id, username}) => {
        return <Link color to={`/users/${id}`}>
          {id}
        </Link>
      }
    },
    {
      label: 'Email',
      body: ({email}) => email
    },
    {
      label: 'First name',
      body: ({firstName}) => firstName
    },
    {
      label: 'Last name',
      body: ({lastName}) => lastName
    },
    {
      label: 'Primary phone',
      body: ({primaryPhoneNumber}) => {
        if (primaryPhoneNumber)
          return formatPhoneNumber(primaryPhoneNumber);
        return 'Not Provided';
      },
    },
    {
      label: 'Primary phone',
      body: ({secondaryPhoneNumber}) => {
        if (secondaryPhoneNumber)
          return formatPhoneNumber(secondaryPhoneNumber);
        return 'Not Provided';
      },
    },
    {
      label: 'Admin',
      body: ({isSuperuser}) => {
        if (isSuperuser)
          return <YesIcon color="primary"/>
      }
    },
    {
      label: ' ',
      body: ({username, id}) =>
        <DropdownMenu urlPrefix={'users'} objectId={id}
                      handleDelete={() => showDeleteDialog(id, username)}/>
    }
  ];

  if (state.loading)
    return <Loading message={`Loading users...`}/>;

  return (
    <Container>
      <DataTable
        title={"Users"}
        data={state.data}
        columns={columns}
        idField="id"
        customToolbar={
          <Chip
            onClick={() => history.push('/users/invite')}
            color="primary"
            icon={<AddIcon/>}
            label="Invite User"
            variant="outlined"/>
          }

      />
      <DeleteModal
        objectId={state.selectedId}
        title={state.deleteDialogTitle}
        show={state.showDeleteDialog}
        onHide={() => setState(state => ({...state, showDeleteDialog: false}))}
        delete={handleDelete}
      />
    </Container>
  );
}
