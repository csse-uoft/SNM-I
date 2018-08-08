import React from 'react';
import FormField from '../../shared/FormField'

export default function LocationFieldGroup({ address, handleFormValChange }) {
  return (
    <div>
      <FormField
        id="apt_number"
        label="Apt. #"
        type="text"
        value={address.apt_number}
        onChange={handleFormValChange}
      />
      <FormField
        id="street_address"
        label="Street Address"
        type="text"
        value={address.street_address}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="city"
        label="City"
        type="text"
        value={address.city}
        onChange={handleFormValChange}
        required
      />
      <FormField
        id="province"
        label="Province"
        type="text"
        value={address.province}
        onChange={handleFormValChange}
        required
      />
      <FormField
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
