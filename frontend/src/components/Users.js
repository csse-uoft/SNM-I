import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { Chip, Container } from "@material-ui/core";
import { Add as AddIcon, Check as YesIcon} from "@material-ui/icons";
import { DeleteModal, DropdownMenu, Link, Loading } from "./shared";
import { deleteUser, fetchUsers } from "../api/userApi";
import { useHistory } from "react-router";

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
      name: 'username',
      label: 'Username',
      options: {
        customBodyRender: (username, {rowData}) => (
          <Link color to={`/users/${rowData[rowData.length - 1]}`}>
            {username}
          </Link>
        )
      }
    },
    {
      name: 'email',
      label: 'Email'
    },
    {
      name: 'first_name',
      label: 'First name'
    },
    {
      name: 'last_name',
      label: 'Last name'
    },
    {
      name: 'primary_phone_number',
      label: 'Primary phone',
      options: {
        display: false,
      }
    },
    {
      name: 'secondary_phone_number',
      label: 'Secondary phone',
      options: {
        display: false,
      }
    },
    {
      name: 'is_superuser',
      label: 'Admin',
      options: {
        customBodyRender: (is_admin) => {
          if (is_admin)
            return <YesIcon color="primary"/>
        }
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
        customBodyRender: (id, {rowData, rowIndex}) =>
          <DropdownMenu urlPrefix={'users'} objectId={id}
                        handleDelete={() => showDeleteDialog(id, rowData[0])}/>
      }
    }
  ];

  if (state.loading)
    return <Loading message={`Loading users...`}/>;

  return (
    <Container>
      <MUIDataTable
        title={"Users"}
        data={state.data}
        columns={columns}
        options={{
          filter: false,
          selectableRows: 'none',
          responsive: 'scrollMaxHeight',
          customToolbar: () =>
            <Chip
              onClick={() => history.push('/users/new')}
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
    </Container>
  );
}
