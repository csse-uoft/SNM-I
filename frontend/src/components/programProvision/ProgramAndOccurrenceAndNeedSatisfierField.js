import {useEffect, useState} from "react";
import {Loading} from "../shared";
import {getInstancesInClass} from "../../api/dynamicFormApi";
import SelectField from "../shared/fields/SelectField";
import {Box, Fade} from "@mui/material";
import {
  getNeedSatisfiersByProgramOcc,
  getProgramOccurrencesByProgram
} from "../../api/programProvision";

export function ProgramAndOccurrenceAndNeedSatisfierField({
                                            fields,
                                            programFieldId,
                                            programOccurrenceFieldId,
                                            needSatisfierFieldId,
                                            handleChange
                                          }) {
  if (!programFieldId || !programOccurrenceFieldId || !needSatisfierFieldId) {
    return <Box minWidth={"350px"}><Loading message=""/></Box>;
  }
  const programKey = `internalType_${programFieldId}`;
  const programOccKey = `internalType_${programOccurrenceFieldId}`;
  const needSatisfierKey = `internalType_${needSatisfierFieldId}`;

  const [selectedProgram, setSelectedProgram] = useState(fields[programKey]);
  const [selectedProgramOcc, setSelectedProgramOcc] = useState(fields[programOccKey]);
  const [dynamicOptions, setDynamicOptions] = useState({});

  const handleChangeProgram = key => (e) => {
    const value = e.target.value;
    setSelectedProgram(value);
    // handleChange(key)(e);
  }

  const handleChangeProgramOcc = key => (e) => {
    const value = e.target.value;
    setSelectedProgramOcc(value);
    handleChange(key)(e);
  }

  useEffect(() => {
    getInstancesInClass(":Program")
      .then(options => setDynamicOptions(prev => ({...prev, ":Program": options})));
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      getProgramOccurrencesByProgram(selectedProgram).then(options => {
        setDynamicOptions(prev => ({...prev, ":ProgramOccurrence": options}));
      });
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedProgramOcc) {
      getNeedSatisfiersByProgramOcc(selectedProgramOcc).then(options => {
        setDynamicOptions(prev => ({...prev, ":NeedSatisfier": options}));
      });
    }
  }, [selectedProgramOcc]);

  const showProgramOcc = !!selectedProgram;
  const showNeedSatisfier = showProgramOcc && !!selectedProgramOcc;

  return <>
    <SelectField key={programKey} label="Program" required value={fields[programKey]}
                 options={dynamicOptions[":Program"] || {}} onChange={handleChangeProgram(programKey)}/>
    {showProgramOcc ?
      <Fade in={showProgramOcc}>
        <div>
          <SelectField key={programOccKey} label="Program Occurrence" required value={fields[programOccKey]}
                       options={dynamicOptions[":ProgramOccurrence"] || {}}
                       onChange={handleChangeProgramOcc(programOccKey)}/>
        </div>
      </Fade>
      : null
    }
    {showNeedSatisfier ?
      <Fade in={showNeedSatisfier}>
        <div>
          <SelectField key={needSatisfierKey} label="Program Need Satisfier" required value={fields[needSatisfierKey]}
                       options={dynamicOptions[":NeedSatisfier"] || {}}
                       onChange={handleChange(needSatisfierKey)}/>
        </div>
      </Fade>
      : null
    }
  </>
}
