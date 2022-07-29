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
      label: 'Username/Email',
      body: ({id, email}) => {
        return <Link color to={`/users/${id}`}>
          {email}
        </Link>
      },
      sortBy: ({email}) => email
    },
    {
      label: 'First name',
      body: ({primaryContact}) => {
        if(primaryContact && primaryContact.givenName)
          return primaryContact.givenName
        return 'Not Provided'
      }
    },
    {
      label: 'Last name',
      body: ({primaryContact}) => {
        if(primaryContact && primaryContact.familyName)
          return primaryContact.familyName
        return 'Not Provided'
      }
    },
    {
      label: 'status',
      body: ({status}) => status
    },
    {
      label: 'Phone Number',
      body: ({primaryContact}) => {
        if (primaryContact && primaryContact.telephone)
          return formatPhoneNumber(primaryContact.telephone);
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
      label: 'Expiration Date',
      body: ({expirationDate}) => {
        if(expirationDate)
          return (new Date(expirationDate)).toString()
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
