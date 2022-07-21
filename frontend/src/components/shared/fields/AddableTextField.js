import {useState} from "react";
import {Button, TextField} from "@mui/material";
import {makeStyles} from "@mui/styles";


const useStyles = makeStyles(() => ({
  TextField: {

  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  },
}));


export default function AddableTextField({initOptions,onChange, ...props}){
  const [options, setOptions] = useState(initOptions);
  const classes = useStyles();



  const handleAdd = () => {
    setOptions(options => options.concat({label: ''}))
  }



  return(
    <div>
      <Button variant="contained" color="primary" className={classes.button} onClick={handleAdd}>
        Add
      </Button>
      {options.map((option, index) =>
       <TextField
        key={index}
        label={'Option Label ' + (index + 1)}
        value={options[index].label}
        required
        onChange={e => options[index].label = e.target.value}
        sx={{mt: '16px', minWidth: 350}}
        {...props}
      />)}
    </div>
  )
}