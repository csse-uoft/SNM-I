import React, { useState} from "react";
import { useDispatch } from "react-redux";
import { deleteClientOutcome, ERROR } from "../store/actions/outcomeActions";
import DeleteModal from "./shared/DeleteModal";
import OutcomeGroupPanel from "./client_outcomes/OutcomeGroupPanel";

export default function ClientOutcomes(props) {
  const {clientId, outcomeGroups} = props;
  const dispatch = useDispatch();

  const [state, setState] = useState({
    show: false,
    selectedId: null,
    outcomeGroupData: outcomeGroups,
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

  const outcomesByOutcomeGroup = state.outcomeGroupData.map(outcome_group =>
    <OutcomeGroupPanel
      key={outcome_group.id}
      outcomeGroupCategory={outcome_group.category}
      outcomes={outcome_group.outcomes}
      outcomeGroupId={outcome_group.id}
      status={outcome_group.status}
      clientId={clientId}
      handleShow={handleShow}
    />
  );


  const handleDelete = (id, form) => {
    dispatch(deleteClientOutcome(clientId, id, form)).then((status) => {
      if (status === ERROR) {
        // this.setState({ displayError: true });
      } else {
        setState( state => ({
          ...state,
          showDeletedDiaglog: false,
          outcomeGroupData: deleteOutcomeInData(state.selectedId)
        }));
      }
    });
  }

  const deleteOutcomeInData = (id) => {
    let copy = [...state.outcomeGroupData]
    for (const outcome_cat of copy){
      for (const outcome of outcome_cat.outcomes){
        if(outcome.id === state.selectedId){
          //Delete outcome corresponding to selectedId
          const idx = outcome_cat.outcomes.indexOf(outcome);
          if (idx > -1){
            outcome_cat.outcomes.splice(idx,1);
          }
        }
      }
      if (outcome_cat.outcomes.length === 0){
        //If there are no outcomes under this category, delete the category as well.
        const idx = copy.indexOf(outcome_cat);
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
          {outcomesByOutcomeGroup}
        <DeleteModal
          contentType='Outcome'
          objectId={state.selectedId}
          show={state.showDeletedDiaglog}
          onHide={handleHide}
          delete={handleDelete}
          title = {"Delete this outcome?"}
        />
      </div>
      )

  } else {
    return '';
  }
}
