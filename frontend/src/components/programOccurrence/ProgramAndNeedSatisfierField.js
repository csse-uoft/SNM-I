import {useEffect, useState} from "react";
import {Loading} from "../shared";
import {getInstancesInClass} from "../../api/dynamicFormApi";
import SelectField from "../shared/fields/SelectField";
import {Box, Fade} from "@mui/material";
import {
  getNeedSatisfiersByProgram,
} from "../../api/programProvision";
import Dropdown from "../shared/fields/MultiSelectField";

export function ProgramAndNeedSatisfierField({
                                            fields,
                                            programFieldId,
                                            needSatisfierFieldId,
                                            handleChange
                                          }) {
  if (!programFieldId || !needSatisfierFieldId) {
    return <Box minWidth={"350px"}><Loading message=""/></Box>;
  }
  const programKey = `internalType_${programFieldId}`;
  const needSatisfierKey = `internalType_${needSatisfierFieldId}`;

  const [selectedProgram, setSelectedProgram] = useState(fields[programKey]);
  const [dynamicOptions, setDynamicOptions] = useState({});

  const handleChangeProgram = key => (e) => {
    const value = e.target.value;
    setSelectedProgram(value);
    handleChange(key)(e);
  }

  useEffect(() => {
    getInstancesInClass(":Program")
      .then(options => setDynamicOptions(prev => ({...prev, ":Program": options})));
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      getNeedSatisfiersByProgram(selectedProgram).then(options => {
        setDynamicOptions(prev => ({...prev, ":NeedSatisfier": options}));
      });
    }
  }, [selectedProgram]);


  const showProgramOcc = !!selectedProgram;

  return <>
    <SelectField key={programKey} label="Program" required value={fields[programKey]}
                 options={dynamicOptions[":Program"] || {}} onChange={handleChangeProgram(programKey)}/>
    {showProgramOcc ?
      <Fade in={showProgramOcc}>
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
