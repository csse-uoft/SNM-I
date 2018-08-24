import React from 'react';
import GeneralField from './GeneralField'

export default function LocationFieldGroup({ address, handleFormValChange }) {
  return (
    <div>
      <GeneralField
        id="apt_number"
        label="Apt. #"
        type="text"
        value={address.apt_number}
        onChange={handleFormValChange}
      />
      <GeneralField
        id="street_address"
        label="Street Address"
        type="text"
        value={address.street_address}
        onChange={handleFormValChange}
        required
      />
      <GeneralField
        id="city"
        label="City"
        type="text"
        value={address.city}
        onChange={handleFormValChange}
        required
      />
      <GeneralField
        id="province"
        label="Province"
        type="text"
        value={address.province}
        onChange={handleFormValChange}
        required
      />
      <GeneralField
        id="postal_code"
        label="Postal Code"
        type="text"
        value={address.postal_code}
        onChange={handleFormValChange}
        required
      />
    </div>
  );
}
