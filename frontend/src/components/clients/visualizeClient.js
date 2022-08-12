import React, { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import {getDynamicFormsByFormType} from "../../api/dynamicFormApi";
import {fetchClient} from "../../api/clientApi";
import {Container, Paper, Table, TableBody, Typography} from "@mui/material";
import {Loading} from "../shared";
import TR from "../shared/TR";

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
      <Typography variant="h5" gutterBottom>
        {'Client Information with ID: ' + id}
      </Typography>

      {Object.entries(client).map(([content, occurrence]) => {
        return(
          <Paper>
            <Table>
              <TableBody>
                <TR title={content}
                    value={occurrence}
                />
              </TableBody>
            </Table>
          </Paper>
        )
      })}

    </Container>
  );
}