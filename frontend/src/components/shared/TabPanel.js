import React from 'react';
import {Box, Typography} from "@mui/material";

export default function TabPanel(props) {
  const {children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
    >
      {value === index && (
        <Box>
          <Typography>
            {children}
          </Typography>
        </Box>
      )}

    </div>
  );
}