import React from "react";
import {  Select} from "@mui/material";
import "./FormStyles.css"

import { InvCitiesPickList,InvCountryPickList, InvStatusPicklist, InvTypePicklist } from '../../data/pickLists';

const  CustomizedControl2SelectForFormik = ({ children, form, field }) => {

    

  const { name, value } = field;
  const { setFieldValue } = form;

  const getCities = (country) => {
    return new Promise((resolve, reject) => {
        console.log("selected country", country);
        resolve(InvCitiesPickList[country] || []);
    });
};

  return (
    <Select        
    className="form-customSelect"
        name={name}
        value={value}
        onChange={async (e) => {
          const _cities = await getCities(e.target.value);
          setFieldValue(name, e.target.value);
          setFieldValue("city", "");
          setFieldValue("propertyCities", _cities);
        }}
  >
    {children}
  </Select>


  );
};
export default CustomizedControl2SelectForFormik