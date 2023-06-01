import React from "react";
import { Select } from "@mui/material";
import "./FormStyles.css"


const CustomizedMultiSelectForFormik = ({ children, form, field, ...props }) => {

  if (props.readOnly) {
    console.log('inside read only')
  }  
  const { name,value } = field;
  const { setFieldValue } = form;

  const changeFunc = (e) => {
    if (props.onChange) {
      props.onChange(e);
    }
    setFieldValue(name, e.target.value.slice(0, 2));
  };

  // Check if the value is an array
  const isArrayValue = Array.isArray(value);


  return (
    <Select
      style={{ width: '100%' }}
      multiple
      name={name}
      value={isArrayValue ? value.slice(0, 2) : []} // Ensure the initial value is an array
      onChange={changeFunc}
    >
      {children}
    </Select>
  );
};
export default CustomizedMultiSelectForFormik