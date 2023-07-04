import { useEffect, useState } from "react";
import { Loading } from "../shared";
import { getInstancesInClass } from "../../api/dynamicFormApi";
import SelectField from "../shared/fields/SelectField";
import { Box, Fade } from "@mui/material";
import { TextField } from '@mui/material'

export function AppointmentClientField({
  fields,
  clientFieldId,
  step,
  handleChange
}) {

  if (!clientFieldId) {
    console.log('AppointmentClientField', { clientFieldId });
    return <Box minWidth={"350px"}><Loading message="" /></Box>;
  }

  const clientKey = `internalType_${clientFieldId}`;
  const [selectedClient, setSelectedClient] = useState(undefined);
  const [dynamicOptions, setDynamicOptions] = useState({});
  var firstName = false;
  var lastName = false;

  if (step) {
    step.map((s) => {
      if (s.name === 'First Name') {
        firstName = true;
      } else if (s.name === 'Last Name') {
        lastName = true;
      }
    });
  }

  const handleChangeClient = key => (e) => {
    console.log('AppointmentClientField', { key, e });
    console.log(dynamicOptions[":Client"][e.target.value]);
    const value = e.target.value;
    setSelectedClient(value);
    handleChange(key)(e);
  }

  useEffect(() => {
    getInstancesInClass(":Client")
      .then(options => setDynamicOptions(prev => ({ ...prev, ":Client": options })));
  }, []);

  const showFadeContent = !!selectedClient;

  return <>
    <SelectField key={clientKey} label="Client" value={dynamicOptions[":Client"]}
      options={dynamicOptions[":Client"] || {}} onChange={handleChangeClient(clientKey)} />
    {showFadeContent ?
      <Fade in={firstName || lastName}>
        <div>
          {
            firstName ?
              <div>
                <TextField
                  label="First Name"
                  disabled
                  sx={{ mt: '16px', minWidth: 350 }}
                  value={dynamicOptions[":Client"][selectedClient].split(',')[1].trim()}
                />
              </div>
              : null
          }
          {
            lastName ?
              <div>
                <TextField
                  label="Last Name"
                  disabled
                  sx={{ mt: '16px', minWidth: 350 }}
                  value={dynamicOptions[":Client"][selectedClient].split(',')[0].trim()}
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
