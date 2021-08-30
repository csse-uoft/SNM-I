import React, { useState} from "react";
import { useDispatch } from "react-redux";
import makeStyles from '@material-ui/styles/makeStyles';
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box';
import { Link } from '../shared'
import { updateClientNeedGroup } from "../../store/actions/needActions";

//icons
import { Edit, PriorityHigh, Delete, Alarm, ExpandMoreOutlined} from '@material-ui/icons';

//Expansion Panel
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Grid } from "@material-ui/core";





export default function NeedGroupPanel(props) {
  const {needGroupCategory, needs, needGroupId, status,
    clientId, handleShow} = props;
  const dispatch = useDispatch();


  const [state, setState] = useState({
    status: status,
    hasUrgentNeed: anyUrgentNeed(needs)
  })
  const changeNeedGroupCategoryStatus = () => {
    const need_group = {
      category: needGroupCategory,
      status: (state.status === "Unmet") ? "Met" : "Unmet",
      client_id: clientId,
      id: needGroupId
    }
    setState(state => ({...state, status: need_group.status}))
    dispatch(updateClientNeedGroup(clientId, need_group.id, need_group));

  }

  const classes = useStyles();

  const needsUnderCat = needs.map(need =>
      <Paper key={need.id}
        variant={"outlined"}
        >
          <Grid container spacing={3} className={classes.innerBox}>
            <Grid item xs>
              <Typography color={'primary'}>{need.type}</Typography>
            </Grid>
            <Grid item xs>
            </Grid>
            {need.is_urgent && (
              <Grid item xs>
                <Box display="flex" flexDirection={"row"}>
                  <Alarm className={classes.highPriority}></Alarm>
                  <Typography className={classes.highPriority}>Urgent</Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          <Box className={classes.innerBox}>
            <Link color to={`/needs/${need.id}`}>
              Find Services/Goods
            </Link>
            <p>{need.description}</p>
          </Box>

          <Box display = 'flex' className={classes.innerBox}>
            <Box>
              <Link to={`/needs/${need.id}/edit`}>
                <Button
                  startIcon={<Edit/>}>
                  Edit
                </Button>
              </Link>
            </Box>

            <Box>
              <Button
                startIcon={<Delete/>}
                onClick={() => handleShow(need.id)}
              >
                Delete
              </Button>
            </Box>

            <Box>
              <Button
                color={"secondary"}
                onClick={() => changeNeedGroupCategoryStatus()}>
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
          expandIcon={<ExpandMoreOutlined />}
          aria-controls={needGroupCategory+"-content"}
          id={needGroupCategory+"-header"}
        >
          <Box display="flex" flexDirection={"row"} className={classes.column}>
            <Typography className={classes.heading}>{needGroupCategory}</Typography>
            {state.hasUrgentNeed && <PriorityHigh className={classes.highPriority}></PriorityHigh>}
          </Box>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>{needs.length} need(s) inside </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.panelDetail}>
          <Box className={classes.outerBox}>
            {needsUnderCat}
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
  panelDetail:{
    padding: 0
  },
  outerBox:{
    width:'100%'
  },
  innerBox: {
    padding: "10px"
  },
  highPriority: {
    color: "#f44336"
  },


}));

function anyUrgentNeed(needs){
  for (let need of needs){
    if (need.is_urgent){
      return true;
    }
  }
  return false;
}