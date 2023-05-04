import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage,FieldArray } from "formik";
import * as Yup from "yup";
import {
    Grid, Button, Forminput, DialogActions, MenuItem,
    AccordionDetails,Typography,TextField, 
    Autocomplete, Select,Accordion,AccordionSummary,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
// import "../formik/FormStyles.css"
import ToastNotification from '../toast/ToastNotification';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { RolesDepartment, UserAccessPicklist, UserRolePicklist } from '../../data/pickLists';
import './Form.css'
import { UserInitialValues, UserSavedValues } from '../formik/InitialValues/formValues';


const url = `${process.env.REACT_APP_SERVER_URL}/UpsertUser`;
const urlgetRolesByDept=`${process.env.REACT_APP_SERVER_URL}/roles`;
const urlSendEmailbulk = `${process.env.REACT_APP_SERVER_URL}/bulkemail`


const UserDetailPage = ({ item }) => {

    const [singleUser, setsingleUser] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    const [usersRecord, setUsersRecord] = useState([])
    const [roleRecords,setRoleRecords]=useState([])

    useEffect(() => {
        console.log('passed record', location.state.record.item);
       
        setsingleUser( location.state?.record?.item ?? {});
        setshowNew(!location.state.record.item)
    }, [])

    const initialValues = UserInitialValues
    const savedValues =UserSavedValues(singleUser)

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

    const sendInviteEmail=(values)=>{

        const obj ={
            emailId:`${values.email}`,
            subject:'Welcome to CloudDesk CRM',
            htmlBody: ` Dear ${values.fullName}, `+'\n'+'\n'+
            `Welcome to Clouddesk CRM you can access.`  +'\n'+'\n'+

            `Your UserName is ${values.userName}` +'\n'+'\n'+
            
            `To generate your ClouDesk-CRM password, click here ${process.env.REACT_APP_FORGOT_EMAIL_LINK} `  + '\n'+'\n'+
            
            `Note this Link will expire in 4 days.` +'\n'+'\n'+

            `if you have any trouble logging in, write to us at ${process.env.REACT_APP_ADMIN_EMAIL_ID}`+ '\n'+'\n'+

            `Thanks and Regards, `+ '\n'+
            `Clouddesk.`
        }
        console.log(obj,"sendInviteEmail")

        axios.post(urlSendEmailbulk,obj)
        .then((res)=>{
            console.log("eamil res",res.data)
            if(res.data){
                setNotify({
                    isOpen: true,
                    message: res.data,
                    type: 'success'
                })
            }else{
                setNotify({
                    isOpen: true,
                    message: "Mail sent Succesfully",
                    type: 'success'
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
            values.userName=values.email
            values.createdBy = (sessionStorage.getItem("loggedInUser"));
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));    
            values.roleDetails=JSON.stringify(values.roleDetails)
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec;
            values.userName=values.email
            values.fullName = values.firstName + ' ' + values.lastName;
            values.createdBy = singleUser.createdBy;
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
            values.roleDetails=JSON.stringify(values.roleDetails)
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
                if(showNew){
                    sendInviteEmail(values)
                }
                setTimeout(() => {
                    navigate(-1);
                }, 2000)

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

    const FetchRolesbyName=(dpt,newInputValue)=>{
        
        console.log(dpt, "dpt")
        console.log(newInputValue, 'role inputValue')
        let payloadObj = { departmentName: dpt, role: newInputValue }


        // axios.post(`${urlgetRolesByDept}?searchKey=${newInputValue}`)
        axios.post(urlgetRolesByDept, payloadObj)
            .then((res) => {
                console.log('res FetchRolesbyName', res.data)
                if (res.status === 200) {                  
                    setRoleRecords(res.data)
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
                                <Form className='my-form'>
                                    <Grid container spacing={2}>

                                        <Grid item xs={6} md={6}>

                                            <label htmlFor="firstName" >First Name</label>
                                            <Field name='firstName' type="text" class="form-input" />
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
                                            <label htmlFor="email">Email <span className="text-danger">*</span> </label>
                                            <Field name="email" type="text" class="form-input" />
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
                                            onChange={e=>{
                                                let dpt=e.target.value
                                                if(dpt.length>0){
                                                    FetchRolesbyName(dpt,null)
                                                }else{
                                                    setRoleRecords([])
                                                }
                                               }}>
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
                                            <label htmlFor="role">Role Name </label>
                                            <Autocomplete
                                                name="role"
                                                options={roleRecords}
                                                value={values.roleDetails}
                                                getOptionLabel={option => option.roleName || ''}
                                                onChange={(e, value) => {
                                                    console.log('inside onchange values', value);
                                                    if (!value) {
                                                        console.log('!value', value);
                                                        setFieldValue("roleDetails", '')
                                                        // setFieldValue("roleDetails", '')
                                                    } else {
                                                        console.log('value', value);
                                                        setFieldValue("roleDetails", value)
                                                        // setFieldValue("roleDetails", value)
                                                    }
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    console.log('newInputValue', newInputValue);
                                                    if (newInputValue.length >= 3) {
                                                        FetchRolesbyName(newInputValue);
                                                    }
                                                    else if (newInputValue.length === 0) {
                                                        FetchRolesbyName(newInputValue);
                                                    }
                                                }}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="role" />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="phone">Phone<span className="text-danger">*</span> </label>
                                            <Field name="phone" type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="phone" />
                                            </div>
                                        </Grid>
                                        {/* <Grid item xs={12} md={12}>
                                            <Accordion>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography variant='h4' className="accordion-Header">Access Settings</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>

                                                    <FieldArray name="access">
                                                        {({ remove, push }) => (
                                                            <>
                                                                {values.access && values.access.length > 0 &&
                                                                    values.access.map((obj, index) => (
                                                                        <div key={index} style={{ margin: '5px' }}>
                                                                            <Grid container spacing={2} alignItems="center">
                                                                                <Grid item xs={4} md={4}>
                                                                                    <h3>{obj.object}</h3>
                                                                                </Grid>
                                                                                <Grid item xs={8} md={8}>
                                                                                    <Grid container spacing={2} alignItems="center">
                                                                                        <Grid item xs={3} md={3}>
                                                                                            <label htmlFor={`permissionSets.${index}.permissions.read`} className="checkbox-label">
                                                                                                Read
                                                                                            </label>
                                                                                            <Field
                                                                                                type="checkbox"
                                                                                                id={`permissionSets.${index}.permissions.read`}
                                                                                                name={`permissionSets.${index}.permissions.read`}
                                                                                                onChange={(e) => {
                                                                                                    if (e.target.checked) {
                                                                                                        console.log(e.target.checked, "if")
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.read`, e.target.value)
                                                                                                    } else {
                                                                                                        console.log(e.target.checked, "else")
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.read`, !e.target.value)
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.create`, !e.target.value)
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.edit`, !e.target.value)
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.delete`, !e.target.value)
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                        <Grid item xs={3} md={3}>
                                                                                            <label htmlFor={`permissionSets.${index}.permissions.create`} className="checkbox-label">
                                                                                                Create
                                                                                            </label>
                                                                                            <Field
                                                                                                type="checkbox"
                                                                                                id={`permissionSets.${index}.permissions.create`}
                                                                                                name={`permissionSets.${index}.permissions.create`}
                                                                                                onChange={(e) => {
                                                                                                    if (e.target.checked) {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.create`, e.target.checked);
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.read`, e.target.checked);
                                                                                                    } else {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.create`, e.target.checked);
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        </Grid>

                                                                                        <Grid item xs={3} md={3}>
                                                                                            <label htmlFor={`permissionSets.${index}.permissions.edit`} className="checkbox-label">
                                                                                                Edit
                                                                                            </label>
                                                                                            <Field
                                                                                                type="checkbox"
                                                                                                id={`permissionSets.${index}.permissions.edit`}
                                                                                                name={`permissionSets.${index}.permissions.edit`}
                                                                                                onChange={(e) => {
                                                                                                    if (e.target.checked) {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.read`, e.target.checked);
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.edit`, e.target.checked);
                                                                                                    } else {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.edit`, e.target.checked);
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.delete`, e.target.checked)
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                        <Grid item xs={3} md={3}>
                                                                                            <label htmlFor={`permissionSets.${index}.permissions.delete`} className="checkbox-label">
                                                                                                Delete
                                                                                            </label>
                                                                                            <Field
                                                                                                type="checkbox"
                                                                                                id={`permissionSets.${index}.permissions.delete`}
                                                                                                name={`permissionSets.${index}.permissions.delete`}
                                                                                                onChange={(e) => {
                                                                                                    console.log(e.target.checked, "checkbox")
                                                                                                    if (e.target.checked) {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.read`, e.target.checked);
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.edit`, e.target.checked);
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.delete`, e.target.checked);
                                                                                                    }
                                                                                                    else {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.delete`, e.target.checked);
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </div>
                                                                    ))}
                                                            </>
                                                        )}
                                                    </FieldArray>

                                                </AccordionDetails>
                                            </Accordion>
                                        </Grid> */}
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

