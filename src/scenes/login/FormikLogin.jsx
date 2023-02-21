import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Button, DialogActions, } from "@mui/material";
import axios from 'axios'
import "../formik/FormStyles.css"
import ToastNotification from "../toast/ToastNotification";

const urlLogin = `${process.env.REACT_APP_SERVER_URL}/login`

const FormikLogin = () => {

    const navigate = useNavigate();
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })


    useEffect(() => {

    }, [])

    const initialValues = {
        userName: '',
        password: '',
    }

    const validationSchema = Yup.object({
        userName: Yup
            .string()
            .email()
            .required('Required'),
        password: Yup
            .string()
            .required('Required')
        ,
    })

    const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
     
        axios.post(urlLogin, values)
        .then((res) => {
            console.log('email send res', res)
            setNotify({
                isOpen: true,
                message: res.data,
                type: 'success'
            })
        })
        .catch((error) => {
            console.log('email send error', error);
            setNotify({
                isOpen: true,
                message: error.message,
                type: 'error'
            })
        })        
    }

    const handleFormClose =()=>{
        console.log('inside form close')
    }

    return (
        <>
            <Grid item xs={12} style={{ margin: "20px" }}>
               
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
                >
                    {(props) => {
                        const {
                            isSubmitting, setFieldValue
                        } = props;

                        return (
                            <>

                                <Form>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={12}>
                                            <label htmlFor="userName">User Name  <span className="text-danger">*</span></label>
                                            <Field name="userName" type="email" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="userName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                             <label htmlFor="password">Password <span className="text-danger">*</span> </label>
                                             <Field name="password"  type="password" class="form-input" 
                                             />
                                             <div style={{ color: 'red' }}>
                                                 <ErrorMessage name="password" />
                                             </div>
                                       </Grid>
                                       </Grid>
                                       <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>
                                            <Button type='success' variant="contained" color="secondary" >Login</Button>
                                          
                                        </DialogActions>
                                    </div>
                                </Form>
                            </>
                        )
                    }}
                </Formik>
            </Grid>

            <ToastNotification notify={notify} setNotify={setNotify} />
        </>
    )
}
export default FormikLogin



