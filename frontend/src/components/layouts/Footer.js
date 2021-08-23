import React from 'react';
import { Typography, Link } from "@material-ui/core";

export default function () {
  return (
    <div className="footer">
      <Typography variant="caption">
        <Link href="http://csse.utoronto.ca/" target="_blank" style={{color: "#ababab"}}>
          Centre for Social Services Engineering
        </Link>, University of Toronto
      </Typography>
    </div>
  );
};
