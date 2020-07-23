import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ACTION_ERROR } from "../../store/defaults";
import { CSVUploadModal, CustomToolbar, DeleteModal, DropdownMenu, GoogleMap, Loading } from "./index";
import { Container, Fade } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

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

  // redux hooks
  const dispatch = useDispatch();

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
    dispatch(fetchData()).then(data => setState(state => ({...state, data, loading: false})))
  }, [dispatch, fetchData]);

  const hideDialog = () => {
    setState(state => ({
      ...state,
      showUploadDialog: false,
      showDeleteDialog: false,
    }));
  };

  const handleDelete = useCallback(async (id, form) => {
    const status = await dispatch(deleteItem(id, form));
    if (status === ACTION_ERROR) {
      // do something
    } else {
      hideDialog();
      setState(state => ({
        ...state,
        data: state.data.filter(item => item.id !== state.deleteId)
      }));
    }
  }, [dispatch, deleteItem]);

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
        name: 'id',
        label: ' ',
        options: {
          sort: false,
          filter: false,
          viewColumns: false,
          searchable: false,
          customBodyRender: (id, {rowIndex}) => (
            <DropdownMenu urlPrefix={type} objectId={id} rowIndex={rowIndex} handleDelete={showDeleteDialog}/>
          )
        }
      },
    ]
  }, [showDeleteDialog, columnsWithoutOptions, type]);

  const tableOptions = {
    selectableRows: 'none',
    responsive: 'scrollMaxHeight',
    rowsPerPageOptions: [10, 20, 100, 1e5],
    download: false,
    customToolbar: () =>
      <CustomToolbar
        type={type}
        handleAdd={() => history.push(`/${type}/new`)}
        handleUpload={() => setState(state => ({...state, showUploadDialog: true}))}
      />,
    onRowsDelete: (rowsDeleted) => {
      const idx = rowsDeleted.data[0].index;
      showDeleteDialog(idx);
      return false;
    },
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
        <MUIDataTable
          columns={columns}
          data={state.data}
          title={title}
          options={tableOptions}
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
