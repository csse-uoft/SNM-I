import React, { useEffect, useState } from 'react';
import TR from '../shared/TR'
import {fetchUser, getProfile, getUserProfileById} from '../../api/userApi'
import { useParams } from "react-router";
import { Link, Loading } from "../shared";
import {Container, Paper, Table, Typography, TableBody, Button} from "@mui/material";
import {formatPhoneNumber} from "../../helpers/phone_number_helpers";

export default function User() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const {id} = useParams();

  useEffect(() => {
    getUserProfileById(id).then(user => {
      setUser(user);
      setLoading(false);
    });
  }, [id]);


  if (loading)
   return <Loading message={`Loading user...`}/>;

  console.log(user)
  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        {'Profile for user : ' + user.primaryEmail}
      </Typography>

      <Link to={`/users/`}>
        <Button color="primary" variant="contained" style={{marginBottom: 12, marginRight: 12}}>
          Back to User Form
        </Button>
      </Link>
      <Link to={`/users/${id}/edit`}>
        <Button color="primary" variant="contained" style={{marginBottom: 12, marginRight: 12}}>
          Edit
        </Button>
      </Link>

      <Paper elevation={4}>
        <Table>
          <TableBody>
            {/*<TR*/}
            {/*  title="Display Name"*/}
            {/*  value={user.displayName}*/}
            {/*/>*/}
            <TR
              title="Role"
              value={user.role}
            />
            <TR
              title="Given Name"
              value = {(user.primaryContact && user.primaryContact.givenName) ? user.primaryContact.givenName : 'Not Provided'}
            />
            <TR
              title="Family Name"
              value = {(user.primaryContact && user.primaryContact.familyName) ? user.primaryContact.familyName : 'Not Provided'}
            />
            <TR
              title="Username/Primary Email"
              value={user.primaryEmail}
            />
            <TR
              title="Secondary Email"
              value={!user.secondaryEmail ? 'Not Provided' : user.secondaryEmail}
            />
            <TR
              title="Phone Number"
              value={(user.primaryContact && user.primaryContact.telephone) ? formatPhoneNumber(user.primaryContact.telephone) : 'Not Provided'}
            />
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}
