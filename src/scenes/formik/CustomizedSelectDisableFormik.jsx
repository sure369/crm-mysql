import React from "react";
import {Select} from "@mui/material";
import "./FormStyles.css"


const  CustomizedSelectDisableForFormik = ({ children, form, field,...props }) => {

    //  console.log('form',form);
    //  console.log('field',field);
     console.log('props',props)
    
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
    <Select
      className="form-customSelect"
      disabled
      name={name}
      value={value}
      onChange={ (e) => {
        changeFunc(e);
        

      }}
    >
      {children}
    </Select>
  );
};
export default CustomizedSelectDisableForFormik