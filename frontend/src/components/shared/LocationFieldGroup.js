import React, { useEffect, useState } from 'react';
import GeneralField from './fields/GeneralField';
import SelectField from './fields/SelectField';
import { provinceOptions } from '../../store/defaults';

export default function LocationFieldGroup({value: defaultValue, required, onChange, errMsg = {}}) {

  const [state, setState] = useState(defaultValue || {});

  const handleChange = name => e => {
    state[name] = e.target.value;
    onChange(state);
  }

  return (
    <div>
      <GeneralField
        label="Apt. #"
        type="text"
        value={state.aptNumber}
        onChange={handleChange('apartmentNumber')}
        error={!!errMsg['apartmentNumber']}
        helperText={errMsg['apartmentNumber']}
      />
      <GeneralField
        label="Street Address"
        type="text"
        value={state.streetAddress}
        onChange={handleChange('streetAddress')}
        required={required}
        error={!!errMsg['streetAddress']}
        helperText={errMsg['streetAddress']}
      />
      <GeneralField
        label="City"
        type="text"
        value={state.city}
        onChange={handleChange('city')}
        required={required}
        error={!!errMsg['city']}
        helperText={errMsg['city']}
      />
      <SelectField
        label="Province"
        value={state.province}
        options={provinceOptions}
        onChange={handleChange('province')}
        required={required}
        error={!!errMsg['province']}
        helperText={errMsg['province']}
      />
      <GeneralField
        label="Postal Code"
        type="text"
        value={state.postalCode}
        onChange={handleChange('postalCode')}
        required={required}
        error={!!errMsg['postalCode']}
        helperText={errMsg['postalCode']}
      />
    </div>
  );
}
