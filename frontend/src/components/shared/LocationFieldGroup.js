import React from 'react';
import GeneralField from './fields/GeneralField';
import SelectField from './fields/SelectField';
import { provinceOptions } from '../../store/defaults';

export default function LocationFieldGroup({address, required, errMsg = {}}) {
  const handleChange = name => e => address[name] = e.target.value;
  return (
    <div>
      <GeneralField
        label="Apt. #"
        type="text"
        value={address.apt_number}
        onChange={handleChange('apt_number')}
        error={!!errMsg['apt_number']}
        helperText={errMsg['apt_number']}
      />
      <GeneralField
        label="Street Address"
        type="text"
        value={address.street_address}
        onChange={handleChange('street_address')}
        required={required}
        error={!!errMsg['street_address']}
        helperText={errMsg['street_address']}
      />
      <GeneralField
        label="City"
        type="text"
        value={address.city}
        onChange={handleChange('city')}
        required={required}
        error={!!errMsg['city']}
        helperText={errMsg['city']}
      />
      <SelectField
        label="Province"
        value={address.province}
        options={provinceOptions}
        onChange={handleChange('province')}
        required={required}
        error={!!errMsg['province']}
        helperText={errMsg['province']}
      />
      <GeneralField
        label="Postal Code"
        type="text"
        value={address.postal_code}
        onChange={handleChange('postal_code')}
        required={required}
        error={!!errMsg['postal_code']}
        helperText={errMsg['postal_code']}
      />
    </div>
  );
}
