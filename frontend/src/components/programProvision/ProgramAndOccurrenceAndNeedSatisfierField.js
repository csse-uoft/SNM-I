import {useEffect, useState, useRef} from "react";
import {Loading} from "../shared";
import {getInstancesInClass} from "../../api/dynamicFormApi";
import SelectField from "../shared/fields/SelectField";
import {Box, Fade} from "@mui/material";
import {
  getNeedSatisfiersByProgramOcc,
  getProgramOccurrencesByProgram
} from "../../api/programProvision";
import {fetchSingleGeneric, fetchMultipleGeneric} from "../../api/genericDataApi";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";

export function ProgramAndOccurrenceAndNeedSatisfierField({
                                            fields,
                                            programFieldId,
                                            programOccurrenceFieldId,
                                            needSatisfierFieldId,
                                            handleChange,
                                            fixedProgramId // full URI of the program which all shown occurrences must be of, if given
                                          }) {
  const programKey = programFieldId ? `internalType_${programFieldId}` : null;
  const programOccKey = `internalType_${programOccurrenceFieldId}`;
  const needSatisfierKey = needSatisfierFieldId ? `internalType_${needSatisfierFieldId}` : null;

  const [selectedProgram, setSelectedProgram] = useState(fixedProgramId ? 'http://snmi#program_' + fixedProgramId : fields[programKey]);
  const [selectedProgramOcc, setSelectedProgramOcc] = useState(fields[programOccKey]);
  const [dynamicOptions, setDynamicOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingProgramOcc, setLoadingProgramOcc] = useState(true);
  const firstProgram = useRef(true);
  const [programOccurrenceInternalTypes, setProgramOccurrenceInternalTypes] = useState({});

  useEffect(() => {
    fetchInternalTypeByFormType('programOccurrence').then(({internalTypes}) => {
      const data = {}
      for (const {implementation, name, _id} of internalTypes) {
        data[name] = {implementation, _id}
      }
      setProgramOccurrenceInternalTypes(data);
    });
  }, []);

  const handleChangeProgram = key => (e) => {
    setLoadingProgramOcc(true);
    const value = e.target.value;
    setSelectedProgram(value);
    handleChange(key)(e);
  }

  const handleChangeProgramOcc = key => (e) => {
    const value = e.target.value;
    setSelectedProgramOcc(value);
    handleChange(key)(e);
  }

  useEffect(() => {
    getInstancesInClass(":Program")
      .then(options => setDynamicOptions(prev => ({...prev, ":Program": options})))
      .then(() => setLoading(false));
  }, []);

  const handleGetProgramOccs = () => {
    // unset program occurrence after another program is selected
    if (firstProgram.current) {
      firstProgram.current = false;
    } else {
      setSelectedProgramOcc(null);
      handleChange(programOccKey)(null);
    }
    setLoadingProgramOcc(false);
  }

  useEffect(() => {
    if (selectedProgram) {
      getProgramOccurrencesByProgram(selectedProgram)
        .then(options => setDynamicOptions(prev => ({...prev, ":ProgramOccurrence": options})))
        .then(() => handleGetProgramOccs());
    } else if (selectedProgramOcc) {
      fetchSingleGeneric('programOccurrence', selectedProgramOcc.split('_')[1])
        .then(occ => {
          const programInternalTypeId = programOccurrenceInternalTypes?.programForProgramOccurrence?._id;
          if (programInternalTypeId) {
            const programURI = occ.data['internalType_' + programInternalTypeId];
            getProgramOccurrencesByProgram(programURI)
              .then(options => setDynamicOptions(prev => ({...prev, ":ProgramOccurrence": options})))
              .then(() => handleGetProgramOccs());
          }
        })
    } else {
      // fetch all program occurrences
      fetchMultipleGeneric('programOccurrence')
        .then(options => setDynamicOptions(prev => ({...prev, ":ProgramOccurrence": options.data
          .reduce((options, option) => (options[option._uri] = option.description || option._uri, options), {})}))) // comma operator
        .then(() => handleGetProgramOccs());
    }
  }, [selectedProgram, programOccurrenceInternalTypes]);

  useEffect(() => {
    if (selectedProgramOcc) {
      getNeedSatisfiersByProgramOcc(selectedProgramOcc).then(options => {
        setDynamicOptions(prev => ({...prev, ":NeedSatisfier": options}));
      });
    }
  }, [selectedProgramOcc]);

  const showProgram = !!programKey;
  const showProgramOcc = !!selectedProgram || (!programKey && !!programOccKey);
  const showNeedSatisfier = showProgramOcc && !!selectedProgramOcc && !!needSatisfierKey;

  if ((showProgram && loading) || (showProgramOcc && loadingProgramOcc)) {
    return <Loading />
  }

  return <>
    {showProgram ?
      <SelectField key={programKey} label="Program" required value={fields[programKey]}
                   options={dynamicOptions[":Program"] || {}} onChange={handleChangeProgram(programKey)}
                   controlled/>
      : null
    }
    {showProgramOcc ?
      <Fade in={showProgramOcc}>
        <div>
          <SelectField key={programOccKey} label="Program Occurrence" required value={fields[programOccKey]}
                       options={dynamicOptions[":ProgramOccurrence"] || {}} loading={loadingProgramOcc}
                       onChange={handleChangeProgramOcc(programOccKey)} controlled/>
        </div>
      </Fade>
      : null
    }
    {showNeedSatisfier ?
      <Fade in={showNeedSatisfier}>
        <div>
          <SelectField key={needSatisfierKey} label="Program Need Satisfier" required value={fields[needSatisfierKey]}
                       options={dynamicOptions[":NeedSatisfier"] || {}}
                       onChange={handleChange(needSatisfierKey)} controlled/>
        </div>
      </Fade>
      : null
    }
  </>
}
