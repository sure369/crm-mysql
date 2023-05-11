import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import {
    Grid, Button, Forminput, DialogActions, MenuItem,
    AccordionDetails, Typography, TextField,
    Autocomplete, Select, Accordion, AccordionSummary,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams, useNavigate } from "react-router-dom"
// import axios from 'axios'
// import "../formik/FormStyles.css"
import ToastNotification from '../toast/ToastNotification';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { RolesDepartment, UserAccessPicklist, UserRolePicklist } from '../../data/pickLists';
import './Form.css'
import { UserInitialValues, UserSavedValues } from '../formik/InitialValues/formValues';
import { RequestServer } from '../api/HttpReq';
import {apiCheckPermission} from '../Auth/apiCheckPermission'
import { getLoginUserRoleDept } from '../Auth/userRoleDept';


const UserDetailPage = ({ item }) => {

    const OBJECT_API = "User"
    const url = `/UpsertUser`;
    const urlgetRolesByDept = `/roles`;
    const urlSendEmailbulk = `/bulkemail`

    const [singleUser, setsingleUser] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    const [usersRecord, setUsersRecord] = useState([])
    const [roleRecords, setRoleRecords] = useState([])
    const [permissionValues, setPermissionValues] = useState({})
   
    const userRoleDpt= getLoginUserRoleDept(OBJECT_API)
    console.log(userRoleDpt,"userRoleDpt")

    useEffect(() => {
        console.log('passed record', location.state.record.item);

        setsingleUser(location.state?.record?.item ?? {});
        setshowNew(!location.state.record.item)
        fetchObjectPermissions()
    }, [])


    const fetchObjectPermissions =()=>{
        if(userRoleDpt){
            apiCheckPermission(userRoleDpt)
            .then(res=>{
                setPermissionValues(res)
            })
            .catch(err=>{
                console.log(err,"res apiCheckPermission error")
                setPermissionValues({})
            })
        }
    }

    const initialValues = UserInitialValues
    const savedValues = UserSavedValues(singleUser)

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const validationSchema = Yup.object({
        lastName: Yup
            .string()
            .required('Required'),
        email: Yup
            .string()
            .email('invalid Format')
            .required('Required'),
        phone: Yup
            .string()
            .matches(phoneRegExp, 'Phone number is not valid')
            .min(10, "Phone number must be 10 characters, its short")
            .max(10, "Phone number must be 10 characters,its long"),
        departmentName: Yup
            .string()
            .required('Required'),
        // access: Yup
        //     .string()
        //     .required('Required'),
    })

    const sendInviteEmail = (values) => {

        const obj = {
            emailId: `${values.email}`,
            subject: 'Welcome to CloudDesk CRM',
            htmlBody: ` Dear ${values.fullName}, ` + '\n' + '\n' +
                `Welcome to Clouddesk CRM you can access.` + '\n' + '\n' +

                `Your UserName is ${values.userName}` + '\n' + '\n' +

                `To generate your ClouDesk-CRM password, click here ${process.env.REACT_APP_FORGOT_EMAIL_LINK} ` + '\n' + '\n' +

                `Note this Link will expire in 4 days.` + '\n' + '\n' +

                `if you have any trouble logging in, write to us at ${process.env.REACT_APP_ADMIN_EMAIL_ID}` + '\n' + '\n' +

                `Thanks and Regards, ` + '\n' +
                `Clouddesk.`
        }
        console.log(obj, "sendInviteEmail")

        RequestServer(urlSendEmailbulk, obj)
            .then((res) => {
                console.log("eamil res", res.data)
                if (res.success) {
                    setNotify({
                        isOpen: true,
                        message: "Mail sent Succesfully",
                        type: 'success'
                    })
                } else {
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: 'error'
                    })
                }
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


    const formSubmission = (values) => {

        console.log('form submission value', values);
        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()
        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.fullName = values.firstName + ' ' + values.lastName;
            values.userName = values.email
            values.createdBy = (sessionStorage.getItem("loggedInUser"));
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
            values.roleDetails = JSON.stringify(values.roleDetails)
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec;
            values.userName = values.email
            values.fullName = values.firstName + ' ' + values.lastName;
            values.createdBy = singleUser.createdBy;
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
            values.roleDetails = JSON.stringify(values.roleDetails)
        }
        console.log('after change form submission value', values);

        RequestServer(url, values)
            .then((res) => {
                console.log('upsert record  response', res);
                if (res.success) {
                    setNotify({
                        isOpen: true,
                        message: res.data,
                        type: 'success'
                    })
                    if (showNew) {
                        sendInviteEmail(values)
                    }
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000)
                } else {
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: 'error'
                    })
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000)
                }

            })
            .catch((error) => {
                console.log('upsert record  error', error);
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

    const FetchRolesbyName = (dpt, newInputValue) => {

        console.log(dpt, "dpt")
        console.log(newInputValue, 'role inputValue')
        let payloadObj = { departmentName: dpt, role: newInputValue }


        // axios.post(`${urlgetRolesByDept}?searchKey=${newInputValue}`)
        RequestServer(urlgetRolesByDept, payloadObj)
            .then((res) => {
                console.log('res FetchRolesbyName', res.data)
                if (res.success) {
                    setRoleRecords(res.data)
                } else {
                    console.log("FetchRolesbyName status error", res.error.message)
                }
            })
            .catch((error) => {
                console.log('error FetchRolesbyName', error);
            })
    }



    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h3>New User</h3> : <h3>User Detail Page </h3>
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
                        const { values, dirty, isSubmitting, handleChange, handleSubmit, handleReset, setFieldValue, errors, touched, } = props;

                        return (
                            <>
                                <ToastNotification notify={notify} setNotify={setNotify} />
                                <Form className='my-form'>
                                    <Grid container spacing={2}>

                                        <Grid item xs={6} md={6}>

                                            <label htmlFor="firstName" >First Name</label>
                                            <Field name='firstName' type="text" class="form-input"
                                             disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="lastName" >Last Name<span className="text-danger">*</span> </label>
                                            <Field name='lastName' type="text" class="form-input" 
                                             disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            />
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
                                            <label htmlFor="email">Email <span className="text-danger">*</span> </label>
                                            <Field name="email" type="text" class="form-input" 
                                             disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                             />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="email" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="userName">User Name<span className="text-danger">*</span> </label>
                                            <Field name="userName" type="text" class="form-input" value={values.email} readOnly />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="username" />
                                            </div>
                                        </Grid>
                                        {/* <Grid item xs={6} md={6}>
                                            <label htmlFor="access">Access <span className="text-danger">*</span> </label>
                                            <Field name="access" component={CustomizedSelectForFormik}>
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    UserAccessPicklist.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="access" />
                                            </div>
                                        </Grid> */}
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="departmentName">Department <span className="text-danger">*</span> </label>
                                            <Field name="departmentName" component={CustomizedSelectForFormik}
                                                onChange={e => {
                                                    let dpt = e.target.value
                                                    if (dpt.length > 0) {
                                                        FetchRolesbyName(dpt, null)
                                                    } else {
                                                        setRoleRecords([])
                                                    }
                                                }}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    RolesDepartment.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="departmentName" />
                                            </div>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="roleId">Role Name </label>
                                            <Autocomplete
                                                name="roleId"
                                                options={roleRecords}
                                                value={values.roleDetails}
                                                getOptionLabel={option => option.roleName || ''}
                                                onChange={(e, value) => {
                                                    console.log('inside onchange values', value);
                                                    if (!value) {
                                                        console.log('!value', value);
                                                        // setFieldValue("roleDetails", '')
                                                        setFieldValue("roleDetails", '')
                                                    } else {
                                                        console.log('value', value);
                                                        setFieldValue("roleDetails", value)
                                                        // setFieldValue("roleDetails", value)
                                                    }
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    console.log('newInputValue', newInputValue);
                                                    if (newInputValue.length >= 1) {
                                                        FetchRolesbyName(values.departmentName,newInputValue);
                                                    }
                                                    else if (newInputValue.length === 0) {
                                                        FetchRolesbyName(values.departmentName,newInputValue);
                                                    }
                                                }}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="role" />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="phone">Phone<span className="text-danger">*</span> </label>
                                            <Field name="phone" type="text" class="form-input" 
                                             disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                             />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="phone" />
                                            </div>
                                        </Grid>
                     
                                        {!showNew && (
                                            <>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="createdDate" >Created Date</label>
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
                                            <Button type="reset" variant="contained" onClick={handleFormClose}   >Cancel</Button>
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
export default UserDetailPage;

