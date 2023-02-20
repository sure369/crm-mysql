import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, TextField, Forminput, Autocomplete, DialogActions, MenuItem } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
import "../formik/FormStyles.css"
import ToastNotification from '../toast/ToastNotification';
import { NameSalutionPickList, LeadSourcePickList, IndustryPickList, LeadStatusPicklist } from '../../data/pickLists';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';


const url = `${process.env.REACT_APP_SERVER_URL}/UpsertLead`;
const fetchUsersbyName = `${process.env.REACT_APP_SERVER_URL}/usersbyName`;

const LeadDetailPage = ({ item }) => {

    const [singleLead, setsingleLead] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()

    const [usersRecord, setUsersRecord] = useState([])
    // notification
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })


    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setsingleLead(location.state.record.item);
        setshowNew(!location.state.record.item)
        FetchUsersbyName('')
        // getTasks(location.state.record.item._id)
    }, [])

    const initialValues = {
        salutation: '',
        firstName: '',
        lastName: '',
        fullName: '',
        phone: '',
        leadSource: '',
        industry: '',
        leadStatus: '',
        email: '',
        createdbyId: '',
        createdDate: '',
        modifiedDate: '',
    }

    const savedValues = {
        salutation: singleLead?.salutation ?? "",
        firstName: singleLead?.firstName ?? "",
        lastName: singleLead?.lastName ?? "",
        fullName: singleLead?.fullName ?? "",
        phone: singleLead?.phone ?? "",
        leadSource: singleLead?.leadSource ?? "",
        industry: singleLead?.industry ?? "",
        leadStatus: singleLead?.leadStatus ?? "",
        email: singleLead?.email ?? "",
        createdbyId: singleLead?.createdbyId ?? "",
        createdDate: new Date(singleLead?.createdDate).toLocaleString(),
        modifiedDate: new Date(singleLead?.modifiedDate).toLocaleString(),
        _id: singleLead?._id ?? "",
        userDetails: singleLead?.userDetails ?? "",
    }

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const validationSchema = Yup.object({
        firstName: Yup
            .string()
            .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
            .max(15, 'lastName must be less than 15 characters'),
        lastName: Yup
            .string()
            .required('Required')
            .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
            .min(3, 'lastName must be more than 3 characters')
            .max(15, 'lastName must be less than 15 characters'),
        phone: Yup
            .string()
            .matches(phoneRegExp, 'Phone number is not valid')
            .min(10, "Phone number must be 10 characters, its short")
            .max(10, "Phone number must be 10 characters,its long"),

        leadStatus: Yup
            .string()
            .required('Required'),
        email: Yup
            .string()
            .email('Invalid email address')
            .required('Required'),
    })

    const FetchUsersbyName = (inputValue) => {
        console.log('inside FetchLeadsbyName fn');
        console.log('newInputValue', inputValue)
        axios.post(`${fetchUsersbyName}?searchKey=${inputValue}`)
            .then((res) => {
                console.log('res fetchLeadsbyName', res.data)
                if (typeof (res.data) === "object") {
                    setUsersRecord(res.data)
                }
            })
            .catch((error) => {
                console.log('error fetchLeadsbyName', error);
            })
    }

    const formSubmission = (values) => {
        console.log('form submission value', values);

        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()

        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.fullName = values.firstName + ' ' + values.lastName;
            values.UserName =values.userDetails.userName
            values.UserId =values.userDetails.id
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec;
            values.fullName = values.firstName + ' ' + values.lastName;
            values.UserName =values.userDetails.userName
            values.UserId =values.userDetails.id
        }
        console.log('after change form submission value', values);

        axios.post(url, values)
            .then((res) => {
                console.log('upsert record  response', res);
                setNotify({
                    isOpen: true,
                    message: res.data,
                    type: 'success'
                })
                setTimeout(() => {
                    navigate(-1);
                }, 2000)

            })
            .catch((error) => {
                console.log('upsert record error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
            })
    }
    const handleFormClose = () => {
        navigate(-1)
    }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h3>New Enquiry</h3> : <h3>Enquiry Detail Page </h3>
                }
            </div>
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={showNew ? initialValues : savedValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => { formSubmission(values) }}
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
                                <ToastNotification notify={notify} setNotify={setNotify} />
                                <Form>
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
                                        {!showNew && (
                                            <>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="fullName" >Full Name</label>
                                                    <Field name='fullName' type="text" class="form-input" disabled
                                                    />
                                                </Grid>
                                            </>
                                        )}
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="phone">Phone</label>
                                            <Field name="phone" type="phone" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="phone" />
                                            </div>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="email">Email <span className="text-danger">*</span></label>
                                            <Field name="email" type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="email" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="leadSource"> Lead Source</label>
                                            <Field name="leadSource" component={CustomizedSelectForFormik} className="form-customSelect">
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    LeadSourcePickList.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="industry">Industry</label>
                                            <Field name="industry" component={CustomizedSelectForFormik} className="form-customSelect">
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    IndustryPickList.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="leadStatus"> Lead Status <span className="text-danger">*</span> </label>
                                            <Field name="leadStatus" component={CustomizedSelectForFormik} className="form-customSelect">
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    LeadStatusPicklist.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="leadStatus" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="createdbyId">User Name </label>
                                            <Autocomplete
                                                name="createdbyId"
                                                options={usersRecord}
                                                //  defaultValue={values.userDetails.userName}
                                                value={values.userDetails}
                                                getOptionLabel={option => option.userName || ''}
                                                // isOptionEqualToValue={(option, value) => option.userName === value.userName}
                                                onChange={(e, value) => {
                                                    console.log('inside onchange values', value);
                                                    if (!value) {
                                                        console.log('!value', value);
                                                        setFieldValue("createdbyId", '')
                                                        setFieldValue("userDetails", '')
                                                    } else {
                                                        console.log('value', value);
                                                        setFieldValue("createdbyId", value.id)
                                                        setFieldValue("userDetails", value)
                                                    }
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    console.log('newInputValue', newInputValue);
                                                    if (newInputValue.length >= 3) {
                                                        FetchUsersbyName(newInputValue);
                                                    }
                                                    else if (newInputValue.length == 0) {
                                                        FetchUsersbyName(newInputValue);
                                                    }
                                                }}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="createdbyId" />
                                                )}
                                            />
                                        </Grid>
                                        {!showNew && (
                                            <>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="createdDate" >created Date</label>
                                                    <Field name='createdDate' type="text" class="form-input" disabled />
                                                </Grid>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="modifiedDate" >Modified Date</label>
                                                    <Field name='modifiedDate' type="text" class="form-input" disabled />
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>

                                    <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>
                                            {
                                                showNew ?
                                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>
                                                    :
                                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Update</Button>
                                            }
                                            <Button type="reset" variant="contained" onClick={handleFormClose}  >Cancel</Button>
                                        </DialogActions>
                                    </div>
                                </Form>
                            </>
                        )
                    }}
                </Formik>
            </div>
        </Grid>
    )

}
export default LeadDetailPage;