import {useEffect, useState, useRef} from "react";
import {Loading} from "../shared";
import {getInstancesInClass} from "../../api/dynamicFormApi";
import SelectField from "../shared/fields/SelectField";
import {Box, Fade} from "@mui/material";
import {
  getNeedSatisfiersByServiceOcc,
  getServiceOccurrencesByService
} from "../../api/serviceProvision";
import {fetchSingleGeneric, fetchMultipleGeneric} from "../../api/genericDataApi";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";

export function ServiceAndOccurrenceAndNeedSatisfierField({
                                            fields,
                                            serviceFieldId,
                                            serviceOccurrenceFieldId,
                                            needSatisfierFieldId,
                                            handleChange,
                                            fixedServiceId // full URI of the service which all shown occurrences must be of, if given
                                          }) {
  const serviceKey = serviceFieldId ? `internalType_${serviceFieldId}` : null;
  const serviceOccKey = `internalType_${serviceOccurrenceFieldId}`;
  const needSatisfierKey = needSatisfierFieldId ? `internalType_${needSatisfierFieldId}` : null;

  const [selectedService, setSelectedService] = useState(fixedServiceId ? 'http://snmi#service_' + fixedServiceId : fields[serviceKey]);
  const [selectedServiceOcc, setSelectedServiceOcc] = useState(fields[serviceOccKey]);
  const [dynamicOptions, setDynamicOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingServiceOcc, setLoadingServiceOcc] = useState(true);
  const firstService = useRef(true);
  const [serviceOccurrenceInternalTypes, setServiceOccurrenceInternalTypes] = useState({});

  useEffect(() => {
    fetchInternalTypeByFormType('serviceOccurrence').then(({internalTypes}) => {
      const data = {}
      for (const {implementation, name, _id} of internalTypes) {
        data[name] = {implementation, _id}
      }
      setServiceOccurrenceInternalTypes(data);
    });
  }, []);

  const handleChangeService = key => (e) => {
    setLoadingServiceOcc(true);
    const value = e.target.value;
    setSelectedService(value);
    handleChange(key)(e);
  }

  const handleChangeServiceOcc = key => (e) => {
    const value = e.target.value;
    setSelectedServiceOcc(value);
    handleChange(key)(e);
  }

  useEffect(() => {
    getInstancesInClass(":Service")
      .then(options => setDynamicOptions(prev => ({...prev, ":Service": options})))
      .then(() => setLoading(false));
  }, []);

  const handleGetServiceOccs = () => {
    // unset service occurrence after another service is selected
    if (firstService.current) {
      firstService.current = false;
    } else {
      setSelectedServiceOcc(null);
      handleChange(serviceOccKey)(null);
    }
    setLoadingServiceOcc(false);
  }

  useEffect(() => {
    if (selectedService) {
      getServiceOccurrencesByService(selectedService)
        .then(options => setDynamicOptions(prev => ({...prev, ":ServiceOccurrence": options})))
        .then(() => handleGetServiceOccs());
    } else if (selectedServiceOcc) {
      fetchSingleGeneric('serviceOccurrence', selectedServiceOcc.split('_')[1])
        .then(occ => {
          const serviceInternalTypeId = serviceOccurrenceInternalTypes?.serviceForServiceOccurrence?._id;
          if (serviceInternalTypeId) {
            const serviceURI = occ.data['internalType_' + serviceInternalTypeId];
            getServiceOccurrencesByService(serviceURI)
              .then(options => setDynamicOptions(prev => ({...prev, ":ServiceOccurrence": options})))
              .then(() => handleGetServiceOccs());
          }
        })
    } else {
      // fetch all service occurrences
      fetchMultipleGeneric('serviceOccurrence')
        .then(options => setDynamicOptions(prev => ({...prev, ":ServiceOccurrence": options.data
          .reduce((options, option) => (options[option._uri] = option.description || option._uri, options), {})}))) // comma operator
        .then(() => handleGetServiceOccs());
    }
  }, [selectedService, serviceOccurrenceInternalTypes]);

  useEffect(() => {
    if (selectedServiceOcc) {
      getNeedSatisfiersByServiceOcc(selectedServiceOcc).then(options => {
        setDynamicOptions(prev => ({...prev, ":NeedSatisfier": options}));
      });
    }
  }, [selectedServiceOcc]);

  const showService = !!serviceKey;
  const showServiceOcc = !!selectedService || (!serviceKey && !!serviceOccKey);
  const showNeedSatisfier = showServiceOcc && !!selectedServiceOcc && !!needSatisfierKey;

  if ((showService && loading) || (showServiceOcc && loadingServiceOcc)) {
    return <Loading />
  }

  return <>
    {showService ?
      <SelectField key={serviceKey} label="Service" required value={fields[serviceKey]}
                   options={dynamicOptions[":Service"] || {}} onChange={handleChangeService(serviceKey)}
                   controlled/>
      : null
    }
    {showServiceOcc ?
      <Fade in={showServiceOcc}>
        <div>
          <SelectField key={serviceOccKey} label="Service Occurrence" required value={fields[serviceOccKey]}
                       options={dynamicOptions[":ServiceOccurrence"] || {}} loading={loadingServiceOcc}
                       onChange={handleChangeServiceOcc(serviceOccKey)} controlled/>
        </div>
      </Fade>
      : null
    }
    {showNeedSatisfier ?
      <Fade in={showNeedSatisfier}>
        <div>
          <SelectField key={needSatisfierKey} label="Service Need Satisfier" required value={fields[needSatisfierKey]}
                       options={dynamicOptions[":NeedSatisfier"] || {}}
                       onChange={handleChange(needSatisfierKey)} controlled/>
        </div>
      </Fade>
      : null
    }
  </>
}
