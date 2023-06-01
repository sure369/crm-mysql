import React from "react";
import {TextField,InputAdornment} from "@mui/material";
import "./FormStyles.css"
import DashboardIcon from '@mui/icons-material/Dashboard';

const  CustomizedTextFieldForFormik = ({ children, form, field,...props }) => {

     if(props.readOnly){
      console.log('inside read only')
     }

  const { name, value } = field;
  const { setFieldValue } = form;
  const changeFunc = (e)=>{
    // console.log(props.onChange(e));
    if(props.onChange){
      props.onChange(e);
    }
    setFieldValue(name,e.target.value)
    
  }
 

  return (
    <TextField
      className="form-customSelect"
      name={name}
      value={value}
      onChange={ (e) => {
        changeFunc(e);
      }}
      InputProps={{
        startAdornment: (
            <InputAdornment position="start">
                <DashboardIcon fontSize="small" />
            </InputAdornment>
        ),
    }}
    >
      {children}
    </TextField>
  );
};
export default CustomizedTextFieldForFormik