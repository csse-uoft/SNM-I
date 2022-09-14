import React, {useState, useEffect, useMemo} from "react";
import {useParams} from "react-router-dom";
import {getDynamicForm, getDynamicFormsByFormType} from "../../api/dynamicFormApi";
import {Box, Chip, Container, Paper, Typography} from "@mui/material";
import {GoogleMap, Loading} from "../shared";
import {fetchSingleGeneric} from "../../api/genericDataApi";
import SelectField from "../shared/fields/SelectField";
import {fetchCharacteristic} from "../../api/characteristicApi";
import {fetchQuestion} from "../../api/questionApi";
import FieldGroup from "../shared/FieldGroup";
import VisualizeGeneric from "../shared/visualizeGeneric";

/**
 * This function is the frontend for visualizing single client
 * @returns {JSX.Element}
 */
export default function VisualizeClient() {

  return <VisualizeGeneric genericType={'client'}/>
}