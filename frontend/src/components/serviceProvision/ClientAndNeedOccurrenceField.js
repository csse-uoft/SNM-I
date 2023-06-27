import {useEffect, useState} from "react";
import {Loading} from "../shared";
import {getInstancesInClass} from "../../api/dynamicFormApi";
import SelectField from "../shared/fields/SelectField";
import {Box, Fade} from "@mui/material";
import {getNeedOccurrencesByClient} from "../../api/serviceProvision";

export function ClientAndNeedOccurrenceField({fields, clientFieldId, needOccFieldId, handleChange}) {
  if (!clientFieldId || !needOccFieldId) {
    return <Box minWidth={"350px"}><Loading message=""/></Box>;
  }
  const clientKey = `internalType_${clientFieldId}`;
  const needOccKey = `internalType_${needOccFieldId}`;

  const [selectedClient, setSelectedClient] = useState(fields[clientKey]);
  const [dynamicOptions, setDynamicOptions] = useState({});

  const handleChangeClient = key => (e) => {
    const value = e.target.value;
    setSelectedClient(value);
    handleChange(key)(e);
  }

  useEffect(() => {
    getInstancesInClass(":Client")
      .then(options => setDynamicOptions(prev => ({...prev, ":Client": options})));
  }, []);

  useEffect(() => {
    if (selectedClient) {
      console.log(selectedClient)
      getNeedOccurrencesByClient(selectedClient).then(options => {
        setDynamicOptions(prev => ({...prev, ":NeedOccurrence": options}));
      });
    }
  }, [selectedClient]);

  const showNeedOcc = !!selectedClient;

  return <>
    <SelectField key={clientKey} label="Client" required value={fields[clientKey]}
                 options={dynamicOptions[":Client"] || {}} onChange={handleChangeClient(clientKey)}/>
    {showNeedOcc ?
      <Fade in={showNeedOcc}>
        <div>
          <SelectField key={needOccKey} label="Client Need Occurrence" required value={fields[needOccKey]}
                       options={dynamicOptions[":NeedOccurrence"] || {}} onChange={handleChange(needOccKey)}/>
        </div>
      </Fade>
      : null
    }
  </>
}
