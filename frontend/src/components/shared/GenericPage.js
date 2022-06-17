import { useHistory } from "react-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CSVUploadModal, CustomToolbar, DeleteModal, DropdownMenu, GoogleMap, Loading, DataTable } from "./index";
import { Container, Fade } from "@mui/material";

/**
 * Generate markers on google map.
 * @function GenerateMarkers
 * @param data: Array
 * @param pageNumber: Number
 * @param rowsPerPage: Number
 */

/**
 * A generic page component for clients, services, goods, providers.
 * @param props {{fetchData, deleteItem, generateMarkers: GenerateMarkers, tableOptions?: {},
 * type: ("clients", "services", "goods", "providers"), nameFormatter, columnsWithoutOptions}}
 */
export default function GenericPage(props) {
  const {
    fetchData, deleteItem, generateMarkers, type,
    nameFormatter, columnsWithoutOptions
  } = props;
  const title = type.charAt(0).toUpperCase() + type.slice(1);

  // react hooks
  const history = useHistory();
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
        data: state.data.filter(item => item.id !== state.deleteId)
      }));
    }
  }, [deleteItem]);

  const showDeleteDialog = useCallback((idx) => {
    const item = state.data[idx];
    setState(state => ({
      ...state,
      showDeleteDialog: true,
      deleteId: item.id,
      deleteDialogTitle: `Delete ${title} ` + nameFormatter(item),
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
        body: ({id}) => (
          <DropdownMenu urlPrefix={type} objectId={id} handleDelete={showDeleteDialog}/>
        )
      },
    ]
  }, [showDeleteDialog, columnsWithoutOptions, type]);

  const tableOptions = {
    customToolbar:
      <CustomToolbar
        type={type}
        handleAdd={() => history.push(`/${type}/new`)}
        handleUpload={() => setState(state => ({...state, showUploadDialog: true}))}
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
      <Container>
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
