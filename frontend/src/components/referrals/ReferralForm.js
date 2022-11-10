import React from 'react';
import GenericForm from "../shared/GenericForm";
import { useParams } from "react-router-dom";

export default function ReferralForm() {
  return (
    <GenericForm name={'referral'} mainPage={'/referrals'}/>
  );
};
