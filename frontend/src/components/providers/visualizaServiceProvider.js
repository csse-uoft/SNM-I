import React from "react";
import {useParams} from "react-router-dom";
import VisualizeGeneric from '../shared/visualizeGeneric'
import {
  Button, Grid
} from "@mui/material";
import {fetchCharacteristic} from "../../api/characteristicApi";

/**
 * This function is the frontend for visualizing single client
 * @returns {JSX.Element}
 */
export default function visualizeServiceProvider(){
  const {formType, id} = useParams();

  const getButtons = async function (genericType, genericData) {
    if (!!genericData) {
      for (let [key, data] of Object.entries(genericData)) {
        const [type, key_id] = key.split('_');
        if (typeof data === 'boolean') {
          const characteristic = await fetchCharacteristic(key_id);
          if (characteristic.fetchData.name === 'Partner Organization?' && data) {
            return (
              <Grid item>
                <Button variant="outlined" onClick={() => {return;}}>Refresh</Button>
              </Grid>
            );
          }
        }
      }
    }
  }

  return <VisualizeGeneric genericType={formType} getAdditionalButtons={getButtons}/>
}
