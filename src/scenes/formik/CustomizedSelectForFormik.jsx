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
    // console.log(props.onChange(e));
    if(props.onChange){
      props.onChange(e);
    }
    setFieldValue(name,e.target.value)
    
  }
 

  return (
    <Select
    className="form-customSelect"
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
export default CustomizedSelectForFormik