import React, { useCallback, useEffect, useState } from "react";
import {
  InputLabel,
  Select,
  Input,
  Chip,
  MenuItem,
  InputBase,
  FormControl,
  FormHelperText
} from "@material-ui/core";
import { useTheme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 18,
    paddingBottom: 8,
    width: '100%',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
    zIndex: 100000,
  },
  select: {
    whiteSpace: 'initial',
    minWidth: 326,
    // minHeight: 36,
  },
  search: {
    padding: 4,
    paddingBottom: 6,
    width: '80%',
    verticalAlign: 'middle',
  },
  searchIcon: {
    marginLeft: 16,
    marginRight: 4,
    fill: '#787878',
    verticalAlign: 'middle',
  },
  options: {
    overflow: 'auto',
    maxHeight: '70vh',
  }
}));

const MenuProps = {
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  PaperProps: {
    style: {
      maxHeight: null,
      minWidth: null,
    },
  },
  MenuListProps: {
    autoFocus: false
  }
};

function getStyles(name, selected, theme) {
  const isSelected = selected.indexOf(name) !== -1;
  return {
    fontWeight:
      isSelected ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular,
    background: isSelected ? '#ccc' : '',
  };
}

export default function Dropdown(props) {
  // options is [value1, value2, ...]
  const {options, label, value, onChange, helperText} = props;

  const [values, setValues] = useState({
    selected: value ? value : [],
    filteredOptions: options ? [...options] : [],
    searchValue: '',
  });
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const theme = useTheme();

  useEffect(() => {
    setValues(values => ({
      ...values,
      searchValue: '',
      selected: [],
      filteredOptions: options ? [...options] : []}))
  }, [options]);

  const handleChange = useCallback((name, value) => {
    setValues(values => ({...values, [name]: value}));
    if (name === 'selected' && onChange)
      onChange({target: {value}});
  }, [onChange]);

  const handleItemClick = (value) => () => {
    const index = values.selected.indexOf(value);
    if (index === -1)
      handleChange('selected', [...values.selected, value]);
    else
      handleDelete(value)();
  };

  const handleDelete = useCallback(removeValue => () => {
    handleChange('selected', values.selected.filter(value => value !== removeValue));
  }, [handleChange, values.selected]);

  const handleSearch = useCallback(event => {
    handleChange('searchValue', event.target.value);
    let value = event.target.value || '';
    value = value.toLowerCase();
    const result = [];
    for (let i = 0, l = options.length; i < l; i++) {
      const option = options[i];
      // search engine here
      if (option.toLowerCase().includes(value))
        result.push(option);
    }
    handleChange('filteredOptions', result);
  }, [handleChange, options]);

  const renderValue = useCallback((selected) => {
    const values = [];
    options.forEach(value => {
      if (selected.indexOf(value) !== -1)
        values.push(
          <Chip key={value} label={value} className={classes.chip} onDelete={handleDelete(value)}/>)
    });
    return values;
  }, [classes.chip, handleDelete, options]);

  const renderMenu = () => {
    return (
      <div>
        <SearchIcon className={classes.searchIcon}/>
        <InputBase
          autoFocus
          className={classes.search}
          placeholder="Search"
          value={values.searchValue}
          onChange={handleSearch}
          onKeyDown={e => {
            e.stopPropagation()
          }} // fix bugs
        />
        <div className={classes.options}>
          {values.filteredOptions.map((value, index) => (
              <MenuItem key={index} value={value} onClick={handleItemClick(value)}
                        style={getStyles(value, values.selected, theme)}>
                {value}
              </MenuItem>
            )
          )}
        </div>
      </div>
    )
  };

  return (
    <div className={classes.root}>
      <FormControl error={props.error}>
        <InputLabel>{label}</InputLabel>
        <Select
          multiple
          value={values.selected}
          input={<Input/>}
          renderValue={renderValue}
          MenuProps={MenuProps}
          classes={{select: classes.select}}
          open={open}
          onOpen={e => {
            // do not open the select when click on the delete icon
            const {tagName} = e.target;
            if (tagName !== 'svg' && tagName !== 'path') {
              setOpen(true);
            }
          }}
          onClose={() => setOpen(false)}
        >
          {renderMenu()}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </div>
  )
}
