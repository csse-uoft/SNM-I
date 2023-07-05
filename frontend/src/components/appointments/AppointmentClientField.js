import { useEffect, useState } from "react";
import { Loading } from "../shared";
import { getInstancesInClass } from "../../api/dynamicFormApi";
import SelectField from "../shared/fields/SelectField";
import { Box, Fade } from "@mui/material";
import { TextField } from '@mui/material'
import { fetchCharacteristics } from "../../api/characteristicApi";
import { set } from "lodash";

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
  const firstNameInfo = {
    name: 'First Name',
    show: false,
    value: undefined,
  };
  const lastNameInfo = {
    name: 'Last Name',
    show: false,
    value: undefined,
  };
  const [nameKey, setNameKey] = useState({});
  const [nameValue, setNameValue] = useState({});

  if (step) {
    step.map((s) => {
      if (s.name === 'First Name') {
        firstNameInfo.show = true;
      } else if (s.name === 'Last Name') {
        lastNameInfo.show = true;
      }
    });
  }

  const handleChangeClient = key => (e) => {
    console.log('AppointmentClientField', { key, e });
    console.log(dynamicOptions[":Client"][e.target.value]);
    const value = e.target.value;
    if (firstNameInfo.show) {
      try{
        let firstName = dynamicOptions[":Client"][value].split(',')[1].trim();
        console.log('firstName', { firstName });
        setNameValue(prev => ({ ...prev, firstName: firstName }));
        handleChange(nameKey.firstName)(firstName);
      } catch (error) {
        console.log('error', { error });
      }
    }
    if (lastNameInfo.show) {
      try{
        let lastName = dynamicOptions[":Client"][value].split(',')[0].trim();
        console.log('lastName', { lastName });
        setNameValue(prev => ({ ...prev, lastName: lastName }));
        handleChange(nameKey.lastName)(lastName);
      } catch (error) {
        console.log('error', { error });
      }
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

  const showFadeContent = !!selectedClient;

  return <>
    <SelectField key={clientKey} label="Client" value={dynamicOptions[":Client"]}
      options={dynamicOptions[":Client"] || {}} onChange={handleChangeClient(clientKey)} />
    {showFadeContent ?
      <Fade in={firstNameInfo.show || lastNameInfo.show}>
        <div>
          {
            firstNameInfo.show ?
              <div>
                <TextField
                  label="First Name"
                  disabled = { nameValue.firstName ? true : false}
                  sx={{ mt: '16px', minWidth: 350 }}
                  value={nameValue.firstName}
                  onChange = {handleChange(nameKey.firstName)}
                />
              </div>
              : null
          }
          {
            lastNameInfo.show ?
              <div>
                <TextField
                  label="Last Name"
                  disabled = { nameValue.lastName ? true : false}
                  sx={{ mt: '16px', minWidth: 350 }}
                  onChange = {handleChange(nameKey.lastName)}
                  value={nameValue.lastName}
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
