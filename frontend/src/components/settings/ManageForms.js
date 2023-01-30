import {Box, Container, IconButton, Tooltip, Typography} from "@mui/material";
import SelectField from "../shared/fields/SelectField";
import React, {useState, useMemo, useEffect} from "react";
import {allForms} from "../../constants/provider_fields";
import {CustomToolbar, DataTable, Link} from "../shared";
import {useParams, useNavigate} from "react-router-dom";
import {deleteDynamicForm, getDynamicFormsByFormType} from "../../api/dynamicFormApi";
import {Edit, Delete} from "@mui/icons-material";


export default function ManageForms() {
  const navigate = useNavigate();
  const {formType} = useParams();

  if (!formType) {
    navigate(`/settings/manage-forms/client`);
  }

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    getDynamicFormsByFormType(formType).then(({forms}) => setTableData(forms));
  }, [formType]);

  const handleDelete = (id) => () => {
    deleteDynamicForm(id).then(() => getDynamicFormsByFormType(formType).then(({forms}) => setTableData(forms)))
  };

  const columns = useMemo(() => {
    return [
      {
        label: 'Form name',
        body: ({name, _id}) => {
          return <Link color to={`/settings/forms/${formType}/edit/${_id}`}>
            {name}
          </Link>
        }
      },
      {
        label: 'Form type',
        body: () => formType
      },
      {
        label: 'Created By',
        body: ({createdBy}) => {
          const text = createdBy.familyName && createdBy.givenName && (createdBy.familyName + ', ' + createdBy.givenName)
            || createdBy.primaryEmail;
          return <Tooltip title={createdBy.primaryEmail || 'No Email'}><Box display={'inline'}>{text}</Box></Tooltip>
        }
      },
      {
        label: 'Modified At',
        body: ({modifiedAt}) => new Date(modifiedAt).toLocaleString(),
      },
      {
        label: ' ',
        body: ({_id}) => {
          return (
            <>
              <IconButton onClick={() => {
                console.log(formType);
                navigate(`/settings/forms/${formType}/edit/${_id}`);
              }}>
                <Edit fontSize="small" color="primary"/>
              </IconButton>
              <IconButton onClick={handleDelete(_id)}>
                <Delete fontSize="small" color="secondary"/>
              </IconButton>
            </>
          )
        },
      },
    ]
  }, [formType]);

  const tableOptions = useMemo(() => {
    return {
      customToolbar:
        <CustomToolbar
          handleAdd={() => navigate(`/settings/forms/${formType}/new`)}
        />,
    }
  }, [formType]);

  return (
    <Container maxWidth={"lg"} sx={{pt: 1}}>
      <Typography variant="h5" sx={{pb: 1}}>
        Manage Forms
      </Typography>

      <SelectField
        label="Form Type"
        value={formType}
        onChange={e => navigate(`/settings/manage-forms/${e.target.value}`)}
        options={allForms}
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