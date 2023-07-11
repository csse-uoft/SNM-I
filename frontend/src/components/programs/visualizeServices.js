import React, {useState, useEffect, useMemo} from "react";
import {useParams} from "react-router-dom";
import {getDynamicForm, getDynamicFormsByFormType, getInstancesInClass, getURILabel} from "../../api/dynamicFormApi";
import {
  Box, Chip, Container, Paper, Typography
} from "@mui/material";
import {Loading} from "../shared/index";
import {fetchSingleGeneric, fetchMultipleGeneric} from "../../api/genericDataApi";
import SelectField from "../shared/fields/SelectField";
import {fetchCharacteristic} from "../../api/characteristicApi";
import {fetchQuestion} from "../../api/questionApi";
import {fetchSingleProvider} from "../../api/providersApi";
import VirtualizeTable from "../shared/virtualizeTable";


/**
 * This function is the frontend for visualizing single generic TODO
 * @returns {JSX.Element}
 */
export default function VisualizeServices() {
  const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState([]);
  const [information, setInformation] = useState([]);

  useEffect(() => {
    (async function () {

      const {data: genericData} = (await fetchSingleGeneric('program', id));
      const allServices = (await fetchMultipleGeneric('service')).data;

      const information = [];
      for (const serviceData of allServices) {
        if (serviceData.program.split('_')[1] === id) {
//		(await fetchMultipleGeneric(serviceData.program.split('_')[1]));
          information.push({label: serviceData.name, value: serviceData.serviceProvider, id: serviceData._id})
        }
      }

      setInformation(information);
      setDisplay(information);

      setLoading(false);
    })();
  }, [id]);

  if (loading)
    return <Loading message={`Loading user...`}/>;

  return (
    <Container>
      <Paper sx={{pl: 2, pr: 2, pb: 2, mb: 2}}>
        <Typography
          sx={{marginTop: '20px', pt: 1, marginRight: '20px', fontSize: '150%'}}>
          {`Services of program with ID: ` + id}
        </Typography>

        <VirtualizeTable rows={display}/>
      </Paper>
    </Container>
  );
}
