import React, { useState} from "react";
import { useDispatch } from "react-redux";
import { deleteClientNeed, ERROR } from "../store/actions/needActions";
import DeleteModal from "./shared/DeleteModal";
import NeedGroupPanel from "./client_needs/NeedGroupPanel";

export default function ClientNeeds(props) {
  const {clientId, needGroups} = props;
  const dispatch = useDispatch();

  const [state, setState] = useState({
    show: false,
    selectedId: null,
    needGroupData: needGroups,
  });

  const handleHide = () => {
    setState( state => ({
        ...state,
        showDeletedDiaglog: false
      }));
  }

  const handleShow = (id) => {
    setState(state => ({
        ...state,
        showDeletedDiaglog:true,
        selectedId:id
      })
    )
  }

  const needsByNeedGroup = state.needGroupData.map(need_group =>
    <NeedGroupPanel
      key={need_group.id}
      needGroupCategory={need_group.category}
      needs={need_group.needs}
      needGroupId={need_group.id}
      status={need_group.status}
      clientId={clientId}
      handleShow={handleShow}
    />
  );


  const handleDelete = (id, form) => {
    dispatch(deleteClientNeed(clientId, id, form)).then((status) => {
      if (status === ERROR) {
        // this.setState({ displayError: true });
      } else {
        setState( state => ({
          ...state,
          showDeletedDiaglog: false,
          needGroupData: deleteNeedInData(state.selectedId)
        }));
      }
    });
  }

  const deleteNeedInData = (id) => {
    let copy = [...state.needGroupData]
    for (const need_cat of copy){
      for (const need of need_cat.needs){
        if(need.id === state.selectedId){
          //Delete need corresponding to selectedId
          const idx = need_cat.needs.indexOf(need);
          if (idx > -1){
            need_cat.needs.splice(idx,1);
          }
        }
      }
      if (need_cat.needs.length === 0){
        //If there are no needs under this category, delete the category as well.
        const idx = copy.indexOf(need_cat);
        if (idx > -1){
          copy.splice(idx,1);
        }
      }
    }
    return copy;
  }

  if (state) {
    return (
      <div>
          {needsByNeedGroup}
        <DeleteModal
          contentType='Need'
          objectId={state.selectedId}
          show={state.showDeletedDiaglog}
          onHide={handleHide}
          delete={handleDelete}
          title = {"Delete this need?"}
        />
      </div>
      )

  } else {
    return '';
  }
}
