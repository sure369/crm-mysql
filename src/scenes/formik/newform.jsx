import React,{useState} from 'react';
import { Box, Button } from "@mui/material";
import { useFormik } from 'formik'

const FormikTest = () => {

    const[values,setValues] = useState({});


    const handleChange =(event)=>{
        console.log(event.target.value);
        // setValues(prevValues => ({
        //     ...prevValues,
           
        //     [event.target.name]: event.target.value
        //   })
        // )
    }

    const formik = useFormik({
        initialValues: {
          firstName: '',
          lastName: '',
          email: '',
        },
        onSubmit: values => {
          alert(JSON.stringify(values, null, 2));
        },
      });
      return (
        <Box m="20px">
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            onChange={handleChange}
            value={formik.values.firstName}
          />
    
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            onChange={handleChange}
            value={formik.values.lastName}
          />
    
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
    
          <button type="submit">Submit</button>
        </form>
        </Box>
      );
};

export default FormikTest;
