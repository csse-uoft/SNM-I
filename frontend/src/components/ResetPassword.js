import {makeStyles} from "@mui/styles";
import {useHistory, useParams} from "react-router";
import {useState} from "@types/react";
import {defaultFirstEntryFields} from "../constants/default_fields";

const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  }
}));

export default function ResetPassword(){
  const classes = useStyles();
  const history = useHistory();
  const {token} = useParams();

  const [state, setState] = useState({
    form: {
      ...defaultFirstEntryFields
    },
    errors: {},
    submitDialog: false,
    successDialog: false,
    failDialog: false,
    verified: false,
    loading: true,
    email: '',
    id:'',
    failMessage:''
  });
}