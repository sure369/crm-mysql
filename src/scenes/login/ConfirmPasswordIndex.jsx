import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { Grid, Button, DialogActions, InputAdornment, IconButton, Paper, Avatar, Typography, TextField } from "@mui/material";
import axios from 'axios'
import '../recordDetailPage/Form.css'
import Cdlogo from '../assets/cdlogo.jpg';
import ToastNotification from "../toast/ToastNotification";

const singupUrl = `${process.env.REACT_APP_SERVER_URL}/UpsertUser`

export default function ConfirmPasswordIndex({ item }) {


    const paperStyle = { padding: 20, height: '100%', width: 280, margin: "20px auto" }
    const avatarStyle = { width: 100, height: 100 }
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    const [userRecord, setUserRecord] = useState();

    const location = useLocation();
    const navigate = useNavigate()

    useEffect(() => {
        console.log(location.state.record.item[0], "uselocation")
        setUserRecord(location.state.record.item[0]);
    })


    const initialValues = {
        userName: location.state.record.item[0].userName,
        email: location.state.record.item[0].email,
        password: '',
        confirmPassword: '',
        departmentName: location.state.record.item[0].departmentName,
        roleDetails: location.state.record.item[0].roleDetails,
        access: location.state.record.item[0].access,
        phone: location.state.record.item[0].phone,
        role: location.state.record.item[0].role,
        _id: location.state.record.item[0]._id,
        firstName: location.state.record.item[0].firstName,
        lastName: location.state.record.item[0].lastName,
        createdDate: location.state.record.item[0].createdDate,
        modifiedDate: location.state.record.item[0].modifiedDate,
        createdBy: location.state.record.item[0].createdBy,
        modifiedBy: location.state.record.item[0].modifiedBy,

    }

    // const initialValues = {
    //     userName: userRecord.userName,
    //     email: userRecord.email,
    //     password: '',
    //     confirmPassword: '',
    //     access:userRecord.access,
    //     createdDate:userRecord.createdDate,     
    //     createdbyId:userRecord.createdbyId,
    //     firstName:userRecord.firstName,
    //     lastName:userRecord.lastName,
    //     fullName:userRecord.fullName,
    //     modifiedDate:userRecord.modifiedDate,
    //     phone:userRecord.phone,
    //     role:userRecord.role,
    //     _id:userRecord._id,
    // }
    const validationSchema = Yup.object({
        email: Yup
            .string()
            .email('Enter Valid Email Id')
            .required('Required'),

        password: Yup
            .string()
            .min(6, "Minimum 6 characters exist")
            .max(15, "Maximum 15 characters exist")
            .required('Please enter your password.')
        ,
        confirmPassword: Yup.string()
            .required('Please re-enter your password.')
            .oneOf([Yup.ref('password')], 'Your passwords do not match.')
    })
    const formSubmission = async (values,) => {
        console.log('inside form Submission', values);
        values.userName = values.email;
        delete values.confirmPassword;

        console.log('after ', values);

        axios.post(singupUrl, values)
            .then((res) => {
                console.log(res.data, "UpsertUser response")
                setNotify({
                    isOpen: true,
                    message: res.data,
                    type: "success",
                })
                setTimeout(() => {
                    navigate('/');
                }, 2000)
            })
            .catch((error) => {
                console.log(error, "error")
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
            })
    }
    return (
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <ToastNotification notify={notify} setNotify={setNotify} />
                <Grid align='center'>
                    <Avatar style={avatarStyle}>
                        <img src={Cdlogo} alt="cdlogo" style={avatarStyle} />
                    </Avatar>
                    <h2>Setup New Password</h2>
                </Grid>
                {/* <FormikLogin/>              */}
                <Grid item xs={12} style={{ margin: "20px" }}>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values) => formSubmission(values)}
                    >
                        {(props) => {
                            const { isValid, values } = props;
                            return (
                                <>
                                    <Form >
                                        <Grid container spacing={2}>

                                            <Grid item xs={12} md={12}>
                                                <label htmlFor="email">Email/User Name  <span className="text-danger">*</span></label>
                                                <Field name="email" type="email" class="login-form-input" readOnly />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="email" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <label htmlFor="password">New Password <span className="text-danger">*</span> </label>
                                                <Field name="password" type='password' class="login-form-input" />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="password" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <label htmlFor="confirmPassword">Confirm New Password <span className="text-danger">*</span> </label>
                                                <Field name="confirmPassword" type='password' class="login-form-input" />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="confirmPassword" />
                                                </div>
                                            </Grid>
                                        </Grid>
                                        <div className='action-buttons'>
                                            <DialogActions sx={{ justifyContent: "space-between", marginTop: '10px' }}>
                                                <Button type='success' color="secondary" variant="contained" disabled={!isValid} >Sign Up</Button>
                                            </DialogActions>
                                        </div>
                                    </Form>
                                </>
                            )
                        }}
                    </Formik>
                </Grid>
                <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    <Typography component={Link} to='/'>Login Page</Typography>
                </div>
            </Paper>
        </Grid>
    )
}
