import React, {useState, useEffect, useMemo} from "react";
import {useParams, Link} from "react-router-dom";
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
import {getServiceProviderName, getServiceProviderType} from "../shared/ServiceProviderInformation";
import {getServiceProviderNameCharacteristicIds} from "../shared/CharacteristicIds";


/**
 * This function is the frontend for visualizing the services of a program.
 * @returns {JSX.Element}
 */
export default function VisualizeServices() {
  const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState([]);
  const [columns, setColumns] = useState([]);
  const [information, setInformation] = useState([]);

  useEffect(() => {
    (async function () {

      const {data: genericData} = (await fetchSingleGeneric('program', id));
      const allServices = (await fetchMultipleGeneric('service')).data;
      const characteristicIds = (await getServiceProviderNameCharacteristicIds());

      const columns = [
        {field: 'label', headerName: 'Service', minWidth: 150},
        {field: 'value', headerName: 'Provider', minWidth: 500},
      ];
      setColumns(columns);

      const information = [];
      for (const serviceData of allServices) {
        if (serviceData.program && serviceData.serviceProvider && (serviceData.program.split('_')[1] === id)) {
          const label = <Link color to={`/services/${serviceData._id}`}>{serviceData.name}</Link>;
          const value = <Link color to={`/providers/${await getServiceProviderType(serviceData)}/${serviceData.serviceProvider._uri.split('_')[1]}`}>{(await getServiceProviderName(serviceData, characteristicIds))}</Link>;
          information.push({label, value})
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

        <VirtualizeTable rows={display} columns={columns}/>
      </Paper>
    </Container>
  );
}
