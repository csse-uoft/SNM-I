import React from "react";

import VisualizeGeneric from "../shared/visualizeGeneric";
import Matching from "./Matching";

/**
 * This function is the frontend for visualizing single client
 * @returns {JSX.Element}
 */
export default function VisualizeClient() {

  return (
    <>
      <VisualizeGeneric genericType={'client'}/>
      <Matching/>
    </>
  )
}