import {Box, Container, Grid, Icon, Paper, Typography} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {DataTable, Link} from "../shared";
import {useClientAPIs} from "../../api/clientApi";
import {
  ArrowRight,
  Check as YesIcon,
  Clear as NoIcon,
  LiveHelp,
  LiveHelpOutlined,
  Person,
  PersonOutlined
} from "@mui/icons-material";
import MatchingDropdownMenu from "./MatchingDropdownMenu";
import {getURILabel} from "../../api/dynamicFormApi";

export default function Matching({}) {
  const navigate = useNavigate();
  const {clientId, needId} = useParams();

  const [data, setData] = useState([]);
  const {matchFromClient} = useClientAPIs();
  const [title, setTitle] = useState({client: '', need: ''});

  useEffect(() => {
    (async function () {
      const [clientName, needName] = await Promise.all([
        getURILabel(`http://snmi#client_${clientId}`),
        getURILabel(`http://snmi#need_${needId}`)
      ])
      setTitle({client: clientName, need: needName});
    })();

    matchFromClient(clientId, needId).then(({data}) => {
      setData(data);
    });
  }, [clientId])

  const columns = useMemo(() => {
    return [
      {
        label: 'Type',
        body: ({type}) => type
      },
      {
        label: 'Name',
        body: ({path, name, type}) => {
          const uri = path[path.length - 1];
          return <Link color to={`/${type}s/${uri.split('_')[1]}`}>{name}</Link>;
        },
        sortBy: ({name}) => name,
      },
      {
        label: 'Distance',
        body: ({distance}) => distance,
      },
      {
        label: 'Eligibility',
        body: ({eligibilityMatched}) => eligibilityMatched ? <YesIcon color="primary"/> : <NoIcon color="secondary"/>,
        sortBy: ({eligibilityMatched}) => eligibilityMatched ? 0 : 1
      },
      {
        label: 'Path',
        body: ({path}) => {
          const renderedPath = [];
          path = path.slice(1, path.length - 1);
          for (const [idx, uri] of path.entries()) {
            const type = uri.split('#')[1].split('_')[0];
            const id = uri.split('_')[1];
            let link = `/${type}s/${id}`;
            if (type === 'need' || type === 'characteristic' || type === 'needSatisfier') {
              link = `/${type}/${id}/edit`;
            }
            renderedPath.push(<Link color to={link}>{type} {id}</Link>);
            if (idx !== path.length - 1) {
              renderedPath.push(<ArrowRight fontSize={"small"}/>)
            }
          }
          return <Box sx={{display: 'flex'}}>{renderedPath}</Box>;
        }
      },
      {
        label: ' ',
        body: ({type, path}) => {
          const serviceOrProgramId = path[path.length - 1].split('_')[1];

          let needId;
          const path_slice = path.slice(1, path.length - 1);
          for (const [idx, uri] of path_slice.entries()) {
            const type = uri.split('#')[1].split('_')[0];
            if (type === 'need') {
              needId = uri.split('_')[1];
              break;
            }
          }

          return <MatchingDropdownMenu type={type} clientId={clientId} needId={needId}
                                       serviceOrProgramId={serviceOrProgramId}/>
        }
      }
    ]
  }, [clientId, needId]);


  return <Container>
    <Paper sx={{mb: 2, mt: 2, minWidth: 300, p: 2}} elevation={2} variant="outlined">

      <Grid container alignItems={"center"}>
        <Grid item>
          <PersonOutlined sx={{fontSize: 34}}/>
        </Grid>
        <Grid item sx={{pl: 1}}>
          <Typography variant="h6">
            {title.client}
          </Typography>
        </Grid>
      </Grid>
      <Typography variant="subtitle1" sx={{pt: 1}}>
        Need: {title.need}
      </Typography>
    </Paper>

    <DataTable
      columns={columns}
      data={data}
      title={"Matched Programs/Services"}
      defaultOrderBy={columns[2].body}
    />
  </Container>
}
