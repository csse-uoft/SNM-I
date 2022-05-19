import React from 'react';
import { Typography, Link, Box } from "@mui/material";

export default function () {
  return (
    <Box sx={{
      position: 'fixed',
      left: '0',
      bottom: '0',
      width: '100%',
      backgroundColor: '#222',
      color: '#aaa',
      textAlign: 'center',
      borderRadius: '2px 2px 0 0',
      alignContent: 'center',
      padding: '4px',
      '@media print': {
        display: 'none'
      }
    }}>
      <Typography variant="caption">
        <Link href="https://csse.utoronto.ca/" target="_blank" sx={{color: "#ababab", textDecoration: 'none'}}>
          Centre for Social Services Engineering
        </Link>, University of Toronto
      </Typography>
    </Box>
  );
};
