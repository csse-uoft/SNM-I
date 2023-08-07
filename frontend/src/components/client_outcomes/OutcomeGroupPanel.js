import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button, Box, Accordion, AccordionSummary, AccordionDetails, Typography, Paper, Grid
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from '../shared'
import { updateClientOutcomeGroup } from "../../store/actions/outcomeActions";

//icons
import { Edit, PriorityHigh, Delete, Alarm, ExpandMoreOutlined } from "@mui/icons-material";


export default function OutcomeGroupPanel(props) {
  const {
    outcomeGroupCategory, outcomes, outcomeGroupId, status,
    clientId, handleShow
  } = props;
  const dispatch = useDispatch();


  const [state, setState] = useState({
    status: status,
    hasUrgentOutcome: anyUrgentOutcome(outcomes)
  })
  const changeOutcomeGroupCategoryStatus = () => {
    const outcome_group = {
      category: outcomeGroupCategory,
      status: (state.status === "Unmet") ? "Met" : "Unmet",
      client_id: clientId,
      id: outcomeGroupId
    }
    setState(state => ({...state, status: outcome_group.status}))
    dispatch(updateClientOutcomeGroup(clientId, outcome_group.id, outcome_group));

  }

  const classes = useStyles();

  const outcomesUnderCat = outcomes.map(outcome =>
    <Paper key={outcome.id}
           variant={"outlined"}
    >
      <Grid container spacing={3} className={classes.innerBox}>
        <Grid item xs>
          <Typography color={'primary'}>{outcome.type}</Typography>
        </Grid>
        <Grid item xs>
        </Grid>
        {outcome.is_urgent && (
          <Grid item xs>
            <Box display="flex" flexDirection={"row"}>
              <Alarm className={classes.highPriority}></Alarm>
              <Typography className={classes.highPriority}>Urgent</Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <Box className={classes.innerBox}>
        <Link color to={`/outcomes/${outcome.id}`}>
          Find Services/Goods
        </Link>
        <p>{outcome.description}</p>
      </Box>

      <Box display='flex' className={classes.innerBox}>
        <Box>
          <Link to={`/outcomes/${outcome.id}/edit`}>
            <Button
              startIcon={<Edit/>}>
              Edit
            </Button>
          </Link>
        </Box>

        <Box>
          <Button
            startIcon={<Delete/>}
            onClick={() => handleShow(outcome.id)}
          >
            Delete
          </Button>
        </Box>

        <Box>
          <Button
            color={"secondary"}
            onClick={() => changeOutcomeGroupCategoryStatus()}>
            {state.status}
          </Button>
        </Box>
      </Box>

    </Paper>
  )

  return (
    <div>
      <Accordion className={classes.panel}>
        <AccordionSummary
          expandIcon={<ExpandMoreOutlined/>}
          aria-controls={outcomeGroupCategory + "-content"}
          id={outcomeGroupCategory + "-header"}
        >
          <Box display="flex" flexDirection={"row"} className={classes.column}>
            <Typography className={classes.heading}>{outcomeGroupCategory}</Typography>
            {state.hasUrgentOutcome && <PriorityHigh className={classes.highPriority}></PriorityHigh>}
          </Box>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>{outcomes.length} outcome(s) inside </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.panelDetail}>
          <Box className={classes.outerBox}>
            {outcomesUnderCat}
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
  },
  column: {
    flexBasis: '50%',
  },
  panel: {
    width: '35%',
  },
  panelDetail: {
    padding: 0
  },
  outerBox: {
    width: '100%'
  },
  innerBox: {
    padding: "10px"
  },
  highPriority: {
    color: "#f44336"
  },


}));

function anyUrgentOutcome(outcomes) {
  for (let outcome of outcomes) {
    if (outcome.is_urgent) {
      return true;
    }
  }
  return false;
}
