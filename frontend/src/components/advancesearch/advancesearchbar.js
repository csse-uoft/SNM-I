import {Button, Container, TextField} from "@mui/material";
import React, {useState} from "react";

const formFields = {
    services: {
        fieldName1: "name",
        fieldName2: "eligibilityCondition",
        // Add more fields as needed
    },
    programs: {
        fieldName1: "name",
    }


};

export default function AdvancedSearchBar({ handleAdvanceSearchClose, handleAdvancedSearch, type}) {
    const [formData, setFormData] = useState({});

    return (
        <Container style={{display: 'flex', flexDirection: 'column'}}
                       sx={{bgcolor: 'background.paper', border: 1, borderRadius: 5, marginTop: 1}}>
            {Object.entries(formFields[type]).map(([fieldName, displayName]) => (
                <TextField
                    key={fieldName}
                    label={displayName}
                    variant="standard"
                    size="small"
                    style={{ marginBottom: 10 }}
                    onChange = {(event) => setFormData({...formData, [displayName]: event.target.value})}
                    // You can add more props or customize as needed
                />
            ))}

            <div style={{marginTop: '20px', padding: '10px', border: '1px solid #ccc'}}>
                <h2>Debug Form Data:</h2>
                <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div>

            <Container>
                <Button onClick={handleAdvanceSearchClose}>Close</Button>
                <Button onClick={() => handleAdvancedSearch(formData)}>Submit</Button>
            </Container>

        </Container>
    )
}


