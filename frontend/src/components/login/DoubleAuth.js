import {makeStyles} from "@mui/styles";
import {useHistory} from "react-router";

const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  }
}));

export default function ForgotPassword() {
  const classes = useStyles();
  const history = useHistory();
}