import { Draggable } from "react-beautiful-dnd";
import { IconButton, FormControl, FormLabel } from "@mui/material";
import { Close as DeleteIcon, DragHandle as DragHandleIcon } from "@mui/icons-material";
import React from "react";
import RequiredSwitch from "./RequiredSwitch";

export default function StepFields({stepFields, characteristics, stepIndex, handleDeleteField}) {
  return stepFields.map((field, index) => {
    const {id, required, type, implementation, content, _id} = field;
    const label = implementation ? implementation.label : content;

    // A unique key for frontend
    const frontendKey = id? type + '-' + id: type + '-' + _id;

    return (
      <Draggable key={frontendKey} draggableId={frontendKey} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
              backgroundColor: snapshot.isDragging ? '#bbb' : null,
              ...provided.draggableProps.style,
              display: 'flex',
              alignItems: 'center'
            }}>

            <span {...provided.dragHandleProps}>
               <DragHandleIcon fontSize="large" color="disabled"/>
            </span >

            <FormControl sx={{flexDirection: 'row', alignItems: 'center',  position: 'relative'}}>
              <FormLabel component="legend" sx={{pr: 3, minWidth: '170px'}}>{label}</FormLabel>
              <RequiredSwitch checked={required} onChange={(checked) => field.required = checked}/>
            </FormControl>

            <IconButton
              onClick={() => !snapshot.isDragging && handleDeleteField(stepIndex, index)}
              size="medium">
              <DeleteIcon/>
            </IconButton>
          </div>
        )}
      </Draggable>
    );
  });
}
