import React, {useState} from 'react';
import {
    Menu,
    MenuItem,
    CircularProgress,
    Typography,
    Chip,
    TextField,
    Button,
    Popover,
    Popper,
    Box, Container
} from '@mui/material';
import {makeStyles} from "@mui/styles";
import {Link as DomLink, useNavigate} from 'react-router-dom';
import {Add as AddIcon, CloudUpload as UploadIcon} from '@mui/icons-material';
import GoogleMap from './GoogleMap';
import CSVUploadModal from './CSVUploadModal';
import DeleteModal from './DeleteModal';
import DropdownMenu from './DropdownMenu';
import GenericPage from './GenericPage';
import FormStepper from './FormStepper';
import FieldsWrapper from "./FieldsWrapper";
import OtherLocationsFields from "./OtherLocationsFields";
import SearchIcon from '@mui/icons-material/Search';

import {providerFormTypes} from '../../constants/provider_fields.js'
import AdvancedSearchBar from "../advancesearch/advancesearchbar";

const useStyles = makeStyles((theme) => ({
    link: {
        color: 'inherit',
        textDecorationLine: 'none',
    },
    linkWithHover: {
        fontWeight: 500,
        color: 'inherit',
        // textDecorationLine: 'none',
        '&:hover': {
            textDecorationLine: 'underline',
            color: '#2f5ac7'
        }
    },
    progress: {
        margin: theme.spacing(2),
        marginTop: 50,
    },
    chipButton: {
        paddingLeft: 6,
        marginLeft: 6,
    }
}));

export function Link({className = '', color, ...props}) {
    const classes = useStyles();
    return <DomLink {...props} className={color ? classes.linkWithHover : classes.link + ' ' + className}/>
}


/**
 * Used by DataTable. Add "add button" and "upload by CSV button"
 * @param onClick
 * @returns {*}
 * @constructor
 */
export function CustomToolbar({handleAdd, handleUpload, handleSearch, handleAdvancedSearch, type}) {
    const navigate = useNavigate();
    const classes = useStyles();

    const [anchorEl_provider, setAnchorEl_provider] = useState(null);
    const [anchorEl_search, setAnchorEl_search] = useState(null);
    const open_add_provider = Boolean(anchorEl_provider);
    const open_search = Boolean(anchorEl_search);

    const handleProviderAddClick = event => {
        setAnchorEl_provider(event.currentTarget);
    };

    const handleAdvanceSearchClick = event => {
        setAnchorEl_search(event.currentTarget);
    }

    const handleProviderClose = () => {
        setAnchorEl_provider(null);
    };

    const handleAdvanceSearchClose = () => {
        setAnchorEl_search(null);
    }

    const handleLink = link => () => {
        navigate(link);
    };

    const [searchItem, setSearchItem] = useState("");

    const handleInputChange = (event) => {
        setSearchItem(event.target.value);
    };




    return (
        <>
            <TextField
                label="Search"
                variant="outlined"
                size="small"
                // value={searchItem}
                onChange={handleInputChange}
            />

            <Button size="small" onClick={() => handleSearch(searchItem)}>Search</Button>

            {/*handleDelete*/}
            {handleUpload && <Chip onClick={handleUpload}
                                   color="default"
                                   icon={<UploadIcon/>}
                                   label="Upload"
                                   variant="outlined"
                                   className={classes.chipButton}
            />}

            <Chip onClick={handleAdvanceSearchClick}
                  color="primary"
                  icon={<SearchIcon/>}
                  label="Advance Search"
                  variant="outlined"
                  className={classes.chipButton}
            />

            <Popper open={open_search} anchorEl={anchorEl_search} keepMounted={true}
                    sx={{zIndex: 2}}>
                <AdvancedSearchBar handleAdvanceSearchClose={handleAdvanceSearchClose} handleAdvancedSearch={handleAdvancedSearch} type={type} />
            </Popper>

            <Chip onClick={type === 'providers' ? handleProviderAddClick : handleAdd}
                  color="primary"
                  icon={<AddIcon/>}
                  label="Add"
                  variant="outlined"
                  className={classes.chipButton}
            />

            {/*For Providers */}
            {type === 'providers' &&
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl_provider}
                    keepMounted
                    open={open_add_provider}
                    onClose={handleProviderClose}
                >
                    {Object.entries(providerFormTypes).map(([value, formType]) =>
                        <MenuItem disabled={formType !== 'Organization' && formType !== 'Volunteer'} key={formType}
                                  onClick={handleLink(`/providers/${value}/new`)}>
                            {formType}
                        </MenuItem>)
                    }
                </Menu>
            }
        </>
    );
}

export function Loading({message = 'Loading Components...'}) {
    const classes = useStyles();
    return (
        <div style={{textAlign: 'center'}}>
            <CircularProgress className={classes.progress}/>
            <Typography variant="subtitle2" color={"textSecondary"}>
                {message}
            </Typography>
        </div>
    );
}


export {
    GoogleMap, CSVUploadModal, DeleteModal, DropdownMenu, GenericPage, FormStepper, FieldsWrapper,
    OtherLocationsFields
}
export {EnhancedTable as DataTable} from './Table';
