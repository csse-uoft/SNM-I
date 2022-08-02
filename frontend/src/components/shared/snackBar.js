import {Snackbar} from "@mui/material";

export function alertSnackBar(props){
  return(
    <Snackbar
      open={props.open}
      autoHideDuration={1000}
      message={props.message}>
    </Snackbar>
  );
}