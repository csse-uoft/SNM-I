import { Container, Typography } from "@mui/material";
import SelectField from "../shared/fields/SelectField";
import React, { useState, useMemo } from "react";
import { allForms } from "../../constants/provider_fields";
import { CustomToolbar, DataTable, DropdownMenu } from "../shared";
import { useHistory } from "react-router-dom";


export default function ManageForms() {
  const [formType, setFormType] = useState('client');
  const [tableData, setTableData] = useState([]);
  const history = useHistory();

  const columns = useMemo(() => {
    return [
      {
        label: 'Form name',
      },
      {
        label: 'Form type'
      },
      {
        label: 'Modified on',
      },
    ]
  }, []);

  const tableOptions = useMemo(() => {
    return {
      customToolbar:
        <CustomToolbar
          handleAdd={() => history.push(`/settings/forms/${formType}/new`)}
        />,
    }
  }, [formType]);

  return (
    <Container maxWidth={"lg"} sx={{pt: 1}}>
      <Typography variant="h5">
        Manage Forms
      </Typography>

      <SelectField
        label="Form Type"
        value={formType}
        onChange={e => setFormType(e.target.value)}
        options={allForms}
        noEmpty
        sx={{mb: 2}}
      />

      <DataTable
        columns={columns}
        data={tableData}
        title={formType ? `All ${allForms[formType]} forms` : 'All forms'}
        {...tableOptions}
      />


    </Container>
  );
}