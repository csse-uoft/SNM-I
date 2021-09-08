import React, { useState, useEffect } from "react";
import _ from 'lodash';
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { Container } from "@material-ui/core";
import Button from '@material-ui/core/Button'
import { Edit, RateReview, Print } from '@material-ui/icons';
import { Link } from '../shared'
import Rating from '@material-ui/core/Rating';
import Box from '@material-ui/core/Box';

import { providerFields } from '../../constants/provider_fields.js'

// components
import ProviderInfoTable from './provider_table/ProviderInfoTable';


import { fetchProvider } from '../../store/actions/providerActions.js'
import { fetchProviderFields } from '../../api/mockedApi/providerFields';

export default function ProviderProfile() {
  //redux hooks
  const dispatch = useDispatch();
  const {id} = useParams();

  const [state, setState] = useState({
    data: null,
    formSetting: null
  });


  useEffect(() => {
      dispatch(fetchProvider(id)).then(data => {
        setState(state => ({
          ...state,
          data
        }))
      })
    }, [dispatch, id]
  );

  useEffect(() => {
      if (state.formSetting == null) {
        fetchProviderFields(false).then(json => {
          setState(state => ({
            ...state,
            formSetting: json
          }))
        })
      }
    }, [dispatch, state.formSetting]
  );
  if (state.data && state.formSetting) {
    const {provider} = state.data;
    const {formSetting} = state;

    let formType;
    if (provider.type === 'Organization') {
      formType = 'organization'
    } else if (provider.type === 'Individual') {
      formType = provider.category.split(' ').join('_').toLowerCase()
    }
    const reviewValue = ((provider.reviews.map(review => review.rating))
      .reduce((first, second) => first + second, 0)) / provider.reviews.length;
    return (
      <Container>
        <h3>Provider Profile</h3>
        <div>
          <Link to={`/providers/${id}/edit/`}>
            <Button
              variant="contained"
              startIcon={<Edit/>}>
              Edit
            </Button>
          </Link>
          &nbsp;
          <Link to={`/providers/${id}/rate`}>
            <Button
              variant="contained"
              startIcon={<RateReview/>}>
              Rate Provider
            </Button>
          </Link>
          {' '}
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.print()}
            startIcon={<Print/>}>
            Print
          </Button>

          {formSetting[formType] &&
          _.map(formSetting[formType].form_structure, (infoFields, step) => {
            return (
              <ProviderInfoTable
                key={step}
                step={step}
                provider={provider}
                providerFields={providerFields}
                infoFields={infoFields}
              />
            )
          })
          }

          <h3> Reviews </h3>
          <Box component="fieldset" mb={3} borderColor="transparent">
            <Rating size="large" name = "provider-rating" value={reviewValue}/>
          </Box>

          <h3>Services</h3>
          <Link to="/services/new">
            <Button variant="contained">
              Add Service
            </Button>
          </Link>

        </div>
      </Container>
    )
  } else {
    return '';
  }
}
