import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import VisualizeGeneric from '../shared/visualizeGeneric'
import {
  Button, Grid
} from "@mui/material";
import {getDynamicFormsByFormType} from "../../api/dynamicFormApi";
import {updateSingleProvider} from "../../api/providersApi";
import {fetchCharacteristic} from "../../api/characteristicApi";
import {fetchPartnerOrganization, updatePartnerOrganization} from "../../api/partnerNetworkApi";

/**
 * This function is the frontend for visualizing single client
 * @returns {JSX.Element}
 */
export default function visualizeServiceProvider(){
  const name = 'organization';
  const {formType, id} = useParams();
  const [formId, setFormId] = useState(null);

  useEffect(() => {
    getDynamicFormsByFormType(name).then(({forms}) => {
      if (forms.length > 0) {
        // Select the first form
        setFormId(forms[0]._id);
      }
    });
  }, [id]);

  const getButtons = async function (genericType, genericData, enqueueSnackbar) {
    if (!!genericData) {
      for (let [key, data] of Object.entries(genericData)) {
        const [type, key_id] = key.split('_');
        if (type === 'characteristic' && typeof data === 'string') {
          const characteristic = await fetchCharacteristic(key_id);
          if (characteristic.fetchData.name === 'Organization Status' && data === 'Partner') {
            return (
              <Grid item>
                <Button variant="outlined" onClick={async () => {
                  let partnerData;
                  try {
                    partnerData = await fetchPartnerOrganization(id);
                    await updatePartnerOrganization(id, partnerData);
                  } catch (e) {
                    enqueueSnackbar(`Failed to refresh organization with ID ${id}: ` + e.json?.message || e.message, {variant: 'error'});
                    return;
                  }

                  enqueueSnackbar(`Organization with ID ${id} updated`, {variant: 'success'});
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
