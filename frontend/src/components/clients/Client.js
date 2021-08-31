import React, { useState, useEffect } from "react";
import _ from 'lodash';
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { Container } from "@material-ui/core";
import Button from '@material-ui/core/Button'
import { Edit, Print } from '@material-ui/icons';
import { Link } from '../shared'
import Alert from '@material-ui/core/Alert';

import ClientNeeds from '../ClientNeeds';
import ClientInfoTable from './client_table/ClientInfoTable';
import AppointmentRow from '../appointments/AppointmentRow';

import { fetchClient } from '../../store/actions/clientActions.js'
import { fetchClientFields } from "../../api/settingApi";
import { clientFields } from '../../constants/client_fields.js'

//Table
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default function Client() {
  //redux hooks
  const dispatch = useDispatch();
  const {id} = useParams();

  const [state, setState] = useState({
    data: null,
    CF: null,
    CN: null
  });


  useEffect(() => {
      dispatch(fetchClient(id)).then(data => {
        setState(state => ({
          ...state,
          data
        }))
      })
  }, [dispatch, id]);

  useEffect(() => {
      if (state.CF == null) {
        fetchClientFields().then(json => {
          setState(state => ({
            ...state,
            CF: json
          }))
        })
      }
    }, [dispatch, state.CF]
  );


  if (state.data && state.CF) {
    const client = state.data;
    const CF = state.CF;
    const formStructure = CF['form_structure'];

    if (client.family) {
      let members = _.clone(client.family.members);
      _.remove(members, {
        person: { id: id }
      });
    }

    return (
      <Container>
        <h3>Client Profile</h3>
        <div>
          <Link to={`/clients/${id}/edit/`}>
            <Button
              variant="contained"
              startIcon={<Edit/>}>
              Edit
            </Button>
          </Link>
          &nbsp;
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.print()}
            startIcon={<Print/>}>
            Print
          </Button>

          <div>
            {client.is_deleted &&
            <Alert variant="filled" severity="error">
              The client has been deleted
            </Alert>
            }
            {/*Client info tables*/}
            {_.map(formStructure, (infoFields, step) => {
              return (
                <ClientInfoTable
                  key={step}
                  step={step}
                  client={client}
                  infoFields={_.keys(_.omit(infoFields, 'family'))}
                  clientFields={clientFields}
                />
              )
            })}

            {/*Family*/}
            {/*TODO: have family tested*/}
            {(client.family && client.family.members.length > 0) &&
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow >
                      <TableCell>First name</TableCell>
                      <TableCell>Last name</TableCell>
                      <TableCell>Date of Birth</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Relationship</TableCell>
                    </TableRow>
                  </TableHead>
                  {_.map(_.filter(client.family.members, member => {
                    return member.person.id !== client.id
                  }), (member, index) => {
                    return (
                      <clientFamilyTableRow
                        member = {member}
                        index = {index}
                      />
                      )
                  })}
                </Table>
              </TableContainer>
            }
          </div>

          {/*TODO： client needs*/}
          <h3>Needs</h3>
          <Link to={`/clients/${client.id}/needs/new`}>
            <Button variant="contained">
              Add need
            </Button>
          </Link>
          { client && client.need_groups.length > 0 &&
          <ClientNeeds
            clientId={client.id}
            needGroups={client.need_groups}
          />
          }

          <h3>Appointments</h3>
          { client && client.appointments.length > 0 &&
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow >
                  <TableCell>Category</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {client.appointments.map(appointment => {
                  return (
                    <AppointmentRow
                      key={appointment.id}
                      appointment={appointment}
                    />
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

          }
          <hr />

        </div>
      </Container>
    )
  } else {
    return null;
  }
}

function clientFamilyTableRow({member, index}) {
  return (
    <TableRow key={member.person.id}>
      <TableCell component="th" scope="row">
        Family member #{index + 1}
      </TableCell>
      <TableCell align="left">{member.person.first_name}</TableCell>
      <TableCell align="left">{member.person.last_name}</TableCell>
      <TableCell align="left">{member.person.birth_date}</TableCell>
      <TableCell align="left">{member.person.gender}</TableCell>
      <TableCell align="left">{member.relationship}</TableCell>
    </TableRow>
  );
}