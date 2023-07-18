import { useEffect, useState } from "react";
import { Loading } from "../shared";
import { getInstancesInClass } from "../../api/dynamicFormApi";
import SelectField from "../shared/fields/SelectField";
import { Box, Fade } from "@mui/material";
import { TextField } from '@mui/material'
import { fetchCharacteristics } from "../../api/characteristicApi";

export function AppointmentClientField({
  fields,
  clientFieldId,
  step,
  handleChange
}) {

  if (!clientFieldId) {
    return <Box minWidth={"350px"}><Loading message="" /></Box>;
  }

  const clientKey = `internalType_${clientFieldId}`;
  const [selectedClient, setSelectedClient] = useState(fields[clientKey]);
  const [dynamicOptions, setDynamicOptions] = useState({});

  const [nameKey, setNameKey] = useState({});
  const [nameValue, setNameValue] = useState({ firstName: null, lastName: null });
  const stepFields = {};

  step.map((s) => {
    if (s.name === "First Name") {
      stepFields['firstName'] = true;
    } else if (s.name === "Last Name") {
      stepFields['lastName'] = true;
    }
  });

  const handleChangeClient = key => (e) => {
    const value = e.target.value;
    setNameValue({firstName: null, lastName: null});
      try{
        let firstName = dynamicOptions[":Client"][value].split(',')[1].trim();
        setNameValue(prev => ({ ...prev, firstName: firstName }));
        handleChange(nameKey.firstName)(firstName);
      } catch (error) {
        console.log(error);
      }
    
    
      try{
        let lastName = dynamicOptions[":Client"][value].split(',')[0].trim();
        setNameValue(prev => ({ ...prev, lastName: lastName }));
        handleChange(nameKey.lastName)(lastName);
      } catch (error) {
        console.log(error);
      }
    
    setSelectedClient(value);
    handleChange(key)(e);
  }
 
  useEffect(() => {
    getInstancesInClass(":Client")
      .then(options => setDynamicOptions(prev => ({ ...prev, ":Client": options })));
    fetchCharacteristics().then((characteristics) => {
      characteristics.data.map((c) => {
        if (c.name === 'First Name') {
          setNameKey(prev => ({ ...prev, firstName: `characteristic_${c.id}` }));
        } else if (c.name === 'Last Name') {
          setNameKey(prev => ({ ...prev, lastName: `characteristic_${c.id}` }));
        }
      });
    });
  }, []);

  const showFadeContent = stepFields.hasOwnProperty("firstName") || stepFields.hasOwnProperty("lastName");

  return <>
    <SelectField key={clientKey} label="Client" value={fields[clientKey]}
      options={dynamicOptions[":Client"] || {}} onChange={handleChangeClient(clientKey)} />
    {showFadeContent ?
      <Fade in={showFadeContent}>
        <div>
          {
            stepFields.hasOwnProperty("firstName") ?
              <div>
                <TextField
                  label="First Name"
                  disabled = { nameValue.firstName ||  fields[nameKey.firstName] ? true : false}
                  sx={{ mt: '16px', minWidth: 350 }}
                  value={nameValue.firstName? nameValue.firstName : fields[nameKey.firstName]?  fields[nameKey.firstName]: '' }
                  onChange = {handleChange(nameKey.firstName)}
                />
              </div>
              : null
          }
          {
            stepFields.hasOwnProperty("lastName") ?
              <div>
                <TextField
                  label="Last Name"
                  disabled = { nameValue.lastName  ||  fields[nameKey.lastName] ? true : false}
                  sx={{ mt: '16px', minWidth: 350 }}
                  onChange = {handleChange(nameKey.lastName)}
                  value={nameValue.lastName? nameValue.lastName : fields[nameKey.lastName]?  fields[nameKey.lastName]:  '' }
                />
              </div>
              : null
          }
        </div>
      </Fade>
      : null
    }
  </>
}
