import {useEffect, useState} from "react";
import {Loading} from "../shared";
import {getInstancesInClass} from "../../api/dynamicFormApi";
import SelectField from "../shared/fields/SelectField";
import {Box, Fade} from "@mui/material";
import {
  getNeedSatisfiersByService,
} from "../../api/serviceProvision";
import Dropdown from "../shared/fields/MultiSelectField";

export function ServiceAndNeedSatisfierField({
                                            fields,
                                            serviceFieldId,
                                            needSatisfierFieldId,
                                            handleChange
                                          }) {
  if (!serviceFieldId || !needSatisfierFieldId) {
    return <Box minWidth={"350px"}><Loading message=""/></Box>;
  }
  const serviceKey = `internalType_${serviceFieldId}`;
  const needSatisfierKey = `internalType_${needSatisfierFieldId}`;

  const [selectedService, setSelectedService] = useState(fields[serviceKey]);
  const [dynamicOptions, setDynamicOptions] = useState({});

  const handleChangeService = key => (e) => {
    const value = e.target.value;
    setSelectedService(value);
    handleChange(key)(e);
  }

  useEffect(() => {
    getInstancesInClass(":Service")
      .then(options => setDynamicOptions(prev => ({...prev, ":Service": options})));
  }, []);

  useEffect(() => {
    if (selectedService) {
      getNeedSatisfiersByService(selectedService).then(options => {
        setDynamicOptions(prev => ({...prev, ":NeedSatisfier": options}));
      });
    }
  }, [selectedService]);


  const showServiceOcc = !!selectedService;

  return <>
    <SelectField key={serviceKey} label="Service" required value={fields[serviceKey]}
                 options={dynamicOptions[":Service"] || {}} onChange={handleChangeService(serviceKey)}/>
    {showServiceOcc ?
      <Fade in={showServiceOcc}>
        <div>
          <Dropdown key={needSatisfierKey} label="Need Satisfier" required value={fields[needSatisfierKey]}
                       options={dynamicOptions[":NeedSatisfier"] || {}}
                       onChange={handleChange(needSatisfierKey)}/>
        </div>
      </Fade>
      : null
    }
  </>
}
