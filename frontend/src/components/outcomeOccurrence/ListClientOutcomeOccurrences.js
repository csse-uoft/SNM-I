import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Loading} from "../shared";
import {getInstancesInClass} from "../../api/dynamicFormApi";
import {fetchMultipleGeneric} from "../../api/genericDataApi";
import {Box, Fade, List, Button} from "@mui/material";

export function ListClientOutcomeOccurrences({clientId, outcomeId}) {
  const [outcomeOccurrences, setOutcomeOccurrences] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMultipleGeneric('outcomeOccurrence')
      .then(options => {
        const data = options.data.filter(outcomeOccurrence => (outcomeOccurrence.occurrenceOf._id == outcomeId) && (outcomeOccurrence.client?._id == clientId));
        setOutcomeOccurrences(data)
      })
      .then(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />
  }

  return <>{outcomeOccurrences.length === 0
    ? ''
    : <List sx={{ml: 4}}>
      {outcomeOccurrences.map((outcomeOccurrence, idx) => {
        return <Button key={idx} sx={{textTransform: 'none', mr: 1, mb: 1}}
            variant="outlined" onClick={() => navigate(`/outcomeOccurrences/${outcomeOccurrence._id}`)}>
          Outcome Occurrence {outcomeOccurrence._id}
        </Button>;
      })}
    </List>}</>;
}
