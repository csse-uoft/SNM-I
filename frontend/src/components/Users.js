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
      setState(state => ({...state, loading: false, data}));
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
          {username}
        </Link>
      }
    },
    {
      label: 'Email',
      body: ({email}) => email
    },
    {
      label: 'First name',
      body: ({first_name}) => first_name
    },
    {
      label: 'Last name',
      body: ({last_name}) => last_name
    },
    {
      label: 'Primary phone',
      body: ({primary_phone_number}) => {
        if (primary_phone_number)
          return formatPhoneNumber(primary_phone_number);
        return 'Not Provided';
      },
    },
    {
      label: 'Primary phone',
      body: ({secondary_phone_number}) => {
        if (secondary_phone_number)
          return formatPhoneNumber(secondary_phone_number);
        return 'Not Provided';
      },
    },
    {
      label: 'Admin',
      body: ({is_superuser}) => {
        if (is_superuser)
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

  // if (state.loading)
  //   return <Loading message={`Loading users...`}/>;

  return (
    <Container>
      <DataTable
        title={"Users"}
        data={state.data}
        columns={columns}
        idField="id"
        customToolbar={
          <Chip
            onClick={() => history.push('/users/new')}
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
