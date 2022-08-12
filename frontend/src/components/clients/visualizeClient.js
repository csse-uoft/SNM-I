import React, { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import {getDynamicFormsByFormType} from "../../api/dynamicFormApi";
import {fetchClient} from "../../api/clientApi";
import {Button, Container, Paper, Table, TableBody, TableHead, Typography} from "@mui/material";
import {Loading} from "../shared";
import TR from "../shared/TR";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

export default function visualizeClient() {

  const {type, id} = useParams();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [client, setClient] = useState({});

  useEffect(() => {
    fetchClient(id).then(data => {
      setClient(data.displayAll);
    });
    setLoading(false);

  }, [id]);

  console.log(client)

  if (loading)
    return <Loading message={`Loading user...`}/>;

  return(
    <Container>
      <Paper>
        <Table>
          <TableHead>
            <TableCell component="th" scope="row">
              {'Information for Client with ID: ' + id}
            </TableCell>
            <TableCell>
              <Button>Appointment</Button>
              <Button>Referral</Button>
            </TableCell>
          </TableHead>
          <TableBody>
            {Object.entries(client).map(([content, occurrence]) => {
              return(
                  <TR title={content}
                      value={occurrence}
                  />
              )
            })}
          </TableBody>
        </Table>
      </Paper>

    </Container>
  );
}