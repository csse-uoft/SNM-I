import React from "react";
import {useParams} from "react-router-dom";
import VisualizeGeneric from '../shared/visualizeGeneric'

/**
 * This function is the frontend for visualizing single client
 * @returns {JSX.Element}
 */
export default function visualizeServiceProvider(){
  const {formType, id} = useParams();
  return <VisualizeGeneric genericType={formType}/>
}