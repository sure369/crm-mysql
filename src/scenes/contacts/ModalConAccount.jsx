import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Grid, Button, FormControl, Stack, Alert, DialogActions,
    Autocomplete, TextField ,MenuItem
} from "@mui/material";
import axios from 'axios'
// import "../formik/FormStyles.css"
import ToastNotification from "../toast/ToastNotification";
import { LeadSourcePickList, NameSalutionPickList} from '../../data/pickLists'
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../recordDetailPage/Form.css'

const UpsertUrl = `${process.env.REACT_APP_SERVER_URL}/UpsertContact`;

const ModalConAccount = ({ item, handleModal }) => {

    const [accountParentRecord, setAccountParentRecord] = useState();
    const[notify,setNotify]=useState({isOpen:false,message:'',type:''})

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setAccountParentRecord(location.state.record.item)

    }, [])

    const initialValues = {
        AccountId: "",
        salutation: '',
        firstName: '',
        lastName: '',
        fullName: '',
        dob: '',
        phone: '',
        department: '',
        leadSource: '',
        email: '',
        fullAddress: '',
        description: '',
        createdbyId: '',
        createdDate: '',
        modifiedDate: '',
    }
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const validationSchema = Yup.object({
        firstName: Yup
            .string()
            // .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
            .max(30, 'lastName must be less than 15 characters'),
        lastName: Yup
            .string()
            .required('Required')
            // .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
            .min(3, 'lastName must be more than 3 characters')
            .max(30, 'lastName must be less than 15 characters'),
        phone: Yup
            .string()
            .matches(phoneRegExp, 'Phone number is not valid')
            .min(10, "Phone number must be 10 characters, its short")
            .max(10, "Phone number must be 10 characters,its long"),

        email: Yup
            .string()
            .email('Invalid email address')
            .required('Required'),
    })

    const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
        let dateSeconds = new Date().getTime();
        let dobSec = new Date(values.dob).getTime()

        values.modifiedDate = dateSeconds;
        values.createdDate = dateSeconds;
        values.AccountId = accountParentRecord._id;
        values.AccountName =accountParentRecord.accountName
        values.createdBy = (sessionStorage.getItem("loggedInUser"));
        values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
       
        // values.accountDetails={
        //     accountName:accountParentRecord.accountName,
        //     id:accountParentRecord._id
        // }
        values.fullName = values.firstName + ' ' + values.lastName;
        if (values.dob) {
            values.dob = dobSec;
        }

        await axios.post(UpsertUrl, values)

            .then((res) => {
                console.log('task form Submission  response', res);
                setNotify({
                    isOpen:true,
                    message:res.data,
                    type:'success'
                  })
                setTimeout(() => {
                    handleModal()
                }, 1000)
            })
            .catch((error) => {
                console.log('task form Submission  error', error);
                setNotify({
                    isOpen:true,
                    message:error.message,
                    type:'error'          
                  })
            })
    }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>New Contact</h3>
            </div>

            <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
            >
                {(props) => {
                    const {
                        values,
                        dirty,
                        isSubmitting,
                        handleChange,
                        handleSubmit,
                        handleReset,
                        setFieldValue,
                    } = props;

                    return (
                        <>
                          <ToastNotification notify={notify} setNotify={setNotify}/>
                          <Form className="my-form">
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} md={2}>
                                                <label htmlFor="salutation">Salutation  </label>
                                                <Field name="salutation" component={CustomizedSelectForFormik} className="form-customSelect">
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                 {
                                                        NameSalutionPickList.map((i) => {
                                                            return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                        })
                                                    }
                                                </Field>
                                            </Grid>
                                            <Grid item xs={6} md={4}>
                                                <label htmlFor="firstName" >First Name</label>
                                                <Field name='firstName' type="text" class="form-input" />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="firstName" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="lastName" >Last Name<span className="text-danger">*</span> </label>
                                                <Field name='lastName' type="text" class="form-input" />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="lastName" />
                                                </div>
                                            </Grid>

                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="phone">Phone</label>
                                                <Field name="phone" type="phone" class="form-input" />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="phone" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                {/* <label htmlFor="dob">Date of Birth</label>
                                                <Field name="dob" type="date" class="form-input" /> */}
                                                <label htmlFor="dob">Date of Birth</label><br />
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        name="dob"
                                                        value={values.dob}
                                                        onChange={(e) => {
                                                            setFieldValue('dob', e)
                                                        }}
                                                        renderInput={(params) => <TextField  {...params} style={{width:'100%'}} error={false} />}
                                                    />

                                                </LocalizationProvider>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="email">Email <span className="text-danger">*</span></label>
                                                <Field name="email" type="text" class="form-input" />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="email" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="leadSource"> lead Source</label>
                                                <Field name="leadSource" component={CustomizedSelectForFormik} className="form-customSelect">
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                    {
                                                        LeadSourcePickList.map((i) => {
                                                            return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                        })
                                                    }
                                                </Field>
                                            </Grid>

                                            <Grid Grid item xs={6} md={12}>
                                                <label htmlFor="description">Description</label>
                                                <Field as="textarea" name="description" class="form-input-textarea" style={{width:'100%'}} />
                                            </Grid>

                                </Grid>

                                <div className='action-buttons'>
                                    <DialogActions sx={{ justifyContent: "space-between" }}>

                                        <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>

                                        <Button type="reset" variant="contained" onClick={(e) => handleModal(false)} >Cancel</Button>

                                    </DialogActions>
                                </div>
                            </Form>
                        </>
                    )
                }}
            </Formik>
        </Grid>
    )

}
export default ModalConAccount

