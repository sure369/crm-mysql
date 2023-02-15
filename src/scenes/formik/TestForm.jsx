import React ,{useEffect, useState} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {Box,Button,TextField, Grid ,MenuItem,Select,InputLabel } from "@mui/material";
import axios from 'axios'
import Header from "../../components/Header";
import { mockAccountData } from "../../data/mockData";
const url =`${process.env.REACT_APP_SERVER_URL}/accountInsert`;




const initialValues = {
    accountName: '',
    accountNumber: '',}

const validationSchema = Yup.object({
    accountName: Yup
        .string()
        .required('Required'),
})

const onSubmit = (values, { resetForm }) => {
    console.log(values);
    resetForm({ values: '' })
}


const TestForm = () => {
    const[isMobile,setIsMobile]=useState(false)

    const handleResize =()=>{
        if(window.innerWidth<720){
            console.log('true');
            setIsMobile(true)
        }
        else{
            console.log('false');
            setIsMobile(false)
        }
    }
    useEffect(()=>{
        console.log('useEffect');
        window.addEventListener("resize",handleResize)
    })

    return (
        <Box m="20px">
        <Header title="New Account" subtitle="Create a New account records" />
  
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                   {(props) => {
                            const {
                                values,
                                dirty,
                                errors,
                                touched,
                                handleBlur,                                
                                isSubmitting,
                                handleChange,
                                handleSubmit,
                                handleReset,
                                setFieldValue,
                            } = props;

            return (
                <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={6} md={6}>
                                <label htmlFor="accountName" >Name  <span className="text-danger">*</span></label>
                                            <Field name="accountName" type="text" border="1px solid red" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="accountName" />
                                            </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                <label htmlFor="accountNumber">Account Number </label>
                                    <Field name="accountNumber" type="text" fulWidth/>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Submit</Button>
                                    <Button type="reset" variant="contained" onClick={handleReset}  disabled={!dirty || isSubmitting} >Clear</Button>
                                </Grid> 
                            </Grid>
                            </form>
            )
             }}
                </Formik>
        </Box>
    );
  }
export default TestForm;

