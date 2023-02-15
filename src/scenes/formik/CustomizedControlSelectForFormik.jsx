import React from "react";
import {  Select} from "@mui/material";
import "./FormStyles.css"
import { AccCitiesPickList } from "../../data/pickLists";

const  CustomizedControlSelectForFormik = ({ children, form, field }) => {

    

  const { name, value } = field;
  const { setFieldValue } = form;

  const getCities = (billingCountry) => {
    return new Promise((resolve, reject) => {
        console.log("billingCountry", billingCountry);
        resolve(AccCitiesPickList[billingCountry] || []);
    });
};

  return (
    <Select        
    className="form-customSelect"
        name={name}
        value={value}
        onChange={async (e) => {
          const _billingCities = await getCities(e.target.value);
          setFieldValue(name, e.target.value);
          setFieldValue("billingCity", "");
          setFieldValue("billingCities", _billingCities);
        }}
  >
    {children}
  </Select>


  );
};
export default CustomizedControlSelectForFormik