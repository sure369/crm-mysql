import React from "react";
import {Select} from "@mui/material";
import "./FormStyles.css"


const  CustomizedSelectForFormik = ({ children, form, field,...props }) => {

    //  console.log('form',form);
    //  console.log('field',field);
    //  console.log('props',props)
    

  const { name, value } = field;
  const { setFieldValue } = form;

  const changeFunc = (e)=>{

    if(props.onChange){
      props.onChange(e);
    }
    if(props.onBlur){
      props.onBlur(e)
    }
    if(props.disabled){
    }
    setFieldValue(name,e.target.value)
    
  }
 

  return (
    <Select
   style={{width:'100%'}}
      name={name}
      value={value}
      disabled={props.disabled?props.disabled:false}
      onChange={ (e) => {
        changeFunc(e);
      }}
    >
      {children}
    </Select>
  );
};
export default CustomizedSelectForFormik