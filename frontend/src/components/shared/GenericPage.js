import { useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CSVUploadModal, CustomToolbar, DeleteModal, DropdownMenu, GoogleMap, Loading, DataTable } from "./index";
import {Container, Fade, TextField} from "@mui/material";

/**
 * Generate markers on google map.
 * @function GenerateMarkers
 * @param data: Array
 * @param pageNumber: Number
 * @param rowsPerPage: Number
 */

/**
 * A generic page component for clients, services, programs, goods, providers.
 * @param props {{fetchData, deleteItem, generateMarkers: GenerateMarkers, tableOptions?: {},
 * type: ("clients", "services", "programs", "goods", "providers"), nameFormatter, columnsWithoutOptions}}
 */
export default function GenericPage(props) {
  const {
    fetchData, searchData, deleteItem, generateMarkers, advancedSearch, type,
    nameFormatter, columnsWithoutOptions
  } = props;
  let title = props.title;
  if (!title)
    title = type.charAt(0).toUpperCase() + type.slice(1);

  // react hooks
  const navigate = useNavigate();
  const [state, setState] = useState({
    showUploadDialog: false,
    showDeleteDialog: false,
    deleteId: null,
    deleteDialogTitle: '',
    data: [], // providers
    pageNumber: 1,
    rowsPerPage: 10,
    loading: true,
  });

  // useEffect with empty dependencies is something like componentWillMount
  useEffect(() => {
    fetchData().then(data => setState(state => ({...state, data, loading: false})));
  }, [fetchData]);

  const hideDialog = () => {
    setState(state => ({
      ...state,
      showUploadDialog: false,
      showDeleteDialog: false,
    }));
  };

  const handleDelete = useCallback(async (id, form) => {
    const res = await deleteItem(id, form);
    if (!res.success) {
      // do something
    } else {
      hideDialog();
      setState(state => ({
        ...state,
        data: state.data.filter(item => item._id !== state.deleteId)
      }));
    }
  }, [deleteItem]);

  const showDeleteDialog = useCallback((_id) => {
    setState(state => ({
      ...state,
      showDeleteDialog: true,
      deleteId: _id,
      deleteDialogTitle: `Delete ${title} ` + nameFormatter(state.data.find(item => item._id === _id)),
    }));
  }, [state.data, nameFormatter, title]);

  // TODO: implement upload CSV
  const handleUpload = file => {

  };

  const columns = useMemo(() => {
    return [
      ...columnsWithoutOptions,
      {
        label: ' ',
        body: ({_id, type: rowType}) => {
          if (type === 'providers')
            return <DropdownMenu urlPrefix={`${type}/${rowType.toLowerCase()}`} objectId={_id} handleDelete={showDeleteDialog}/>
          else
            return <DropdownMenu urlPrefix={type} objectId={_id} handleDelete={showDeleteDialog}/>
        }
      },
    ]
  }, [showDeleteDialog, columnsWithoutOptions, type]);

  const reloadDataAndRefreshPage = (searchitem) => {
    searchData(searchitem).then(data => setState(state => ({...state, data, loading: false})));

    // it's possible that data is entered in the search bar
    // and the search bar sent it to the backend
    // but when no entity like this is found, it will return all possibility
    // so we need to remove that possibility
  }

  const advancedSearchAndRefreshPage = (searchitems) => {
    // searchitems must be a dictionary
    advancedSearch(searchitems).then(data => setState(state => ({...state, data, loading: false})));
  }

  const tableOptions = {
    customToolbar:
      <CustomToolbar
        type={type}
        handleAdd={() => navigate(`/${type}/new`)}
        handleSearch={reloadDataAndRefreshPage}
        handleUpload={() => setState(state => ({...state, showUploadDialog: true}))}
        handleAdvancedSearch={advancedSearchAndRefreshPage}
        // handleDelete={reloadDataAndRefreshPage}
      />,
    onDelete: async (ids) => {
      // TODO: Lester 8/30/2021
      showDeleteDialog(ids);
      return false;
    },

    // These listeners are required for displaying pin on Google Map
    onChangePage: pageNumber => setState(state => ({...state, pageNumber})),
    onChangeRowsPerPage: rowsPerPage => setState(state => ({...state, rowsPerPage})),
    ...props.tableOptions,
  };

  // This also filters out providers without lat / lng.
  const markers = useMemo(() => generateMarkers(state.data, state.pageNumber, state.rowsPerPage),
    [generateMarkers, state.data, state.pageNumber, state.rowsPerPage]);

  if (state.loading)
    return <Loading message={`Loading ${title}...`}/>;

  return (
    <Fade in>
      <Container maxWidth="xl">
        <DataTable
          columns={columns}
          data={state.data}
          title={title}
          {...tableOptions}
        />

        <CSVUploadModal
          show={state.showUploadDialog}
          onHide={hideDialog}
          submit={handleUpload}
        />
        <DeleteModal
          contentType="Provider"
          objectId={state.deleteId}
          title={state.deleteDialogTitle}
          show={state.showDeleteDialog}
          onHide={hideDialog}
          delete={handleDelete}
        />
        <GoogleMap markers={markers}/>
      </Container>
    </Fade>
  )
}
