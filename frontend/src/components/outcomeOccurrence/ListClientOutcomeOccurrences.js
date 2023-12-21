import {useEffect, useState} from "react";
import {Loading} from "../shared";
import {getInstancesInClass} from "../../api/dynamicFormApi";
import {fetchMultipleGeneric} from "../../api/genericDataApi";
import {Box, Fade, List, Button} from "@mui/material";

export function ListClientOutcomeOccurrences({clientId, outcomeId}) {
  const [outcomeOccurrences, setOutcomeOccurrences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMultipleGeneric('outcomeOccurrence')
      .then(options => {
        const data = options.data.filter(outcomeOccurrence => outcomeOccurrence.occurrenceOf.split('_')[1] == outcomeId)
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
            variant="outlined">
          Outcome Occurrence {outcomeOccurrence._id}
        </Button>;
      })}
    </List>}</>;
}
