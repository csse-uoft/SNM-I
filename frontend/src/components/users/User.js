import React, { useEffect, useState } from 'react';
import TR from '../shared/TR'
import {fetchUser, getProfile, getUserProfileById} from '../../api/userApi'
import { useParams } from "react-router";
import { Link, Loading } from "../shared";
import { Container, Paper, Table, Typography, TableBody } from "@mui/material";

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
        User profile
      </Typography>
      {/*<Link to={`/users/${id}/edit`}>*/}
      {/*  <Button color="primary" variant="contained" style={{marginBottom: 12}}>*/}
      {/*    Edit*/}
      {/*  </Button>*/}
      {/*</Link>*/}

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
              value={!user.primaryContact ? 'Not Provided' : user.primaryContact.givenName}
            />
            <TR
              title="Family Name"
              value={!user.primaryContact ? 'Not Provided' : user.primaryContact.familyName}
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
              value={'Not Provided'}
            />
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}
