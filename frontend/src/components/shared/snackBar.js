import {Snackbar} from "@mui/material";

export function snackBar(props){
  return(
    <Snackbar
      open={props.open}
      autoHideDuration={6000}
      message={props.message}
      action={props.button}>
    </Snackbar>
  );
}