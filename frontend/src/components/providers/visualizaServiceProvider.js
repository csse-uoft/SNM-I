import React from "react";
import {useParams} from "react-router-dom";
import VisualizeGeneric from '../shared/visualizeGeneric'
import {
  Button, Grid
} from "@mui/material";
import {fetchCharacteristic} from "../../api/characteristicApi";
import {refreshPartnerOrganization} from "../../api/partnerNetworkApi";

/**
 * This function is the frontend for visualizing single client
 * @returns {JSX.Element}
 */
export default function visualizeServiceProvider(){
  const {formType, id} = useParams();

  const getButtons = async function (genericType, genericData, enqueueSnackbar) {
    if (!!genericData) {
      for (let [key, data] of Object.entries(genericData)) {
        const [type, key_id] = key.split('_');
        if (typeof data === 'boolean') {
          const characteristic = await fetchCharacteristic(key_id);
          if (characteristic.fetchData.name === 'Partner Organization?' && data) {
            return (
              <Grid item>
                <Button variant="outlined" onClick={async () => {
                  try {
                    await refreshPartnerOrganization(id);
                    enqueueSnackbar(`Organization with ID ${id} updated`, {variant: 'success'});
                  } catch (e) {
                    enqueueSnackbar(`Failed to refresh organization with ID ${id}: ` + e.json.message, {variant: 'error'});
                  }
                }}>Refresh</Button>
              </Grid>
            );
          }
        }
      }
    }
  }

  return <VisualizeGeneric genericType={formType} getAdditionalButtons={getButtons}/>
}
