import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, TextField, Forminput, Autocomplete, DialogActions, MenuItem } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
// import "../formik/FormStyles.css"
import ToastNotification from '../toast/ToastNotification';
import { NameSalutionPickList, LeadSourcePickList, IndustryPickList, LeadStatusPicklist ,LeadsDemoPicklist,LeadMonthPicklist } from '../../data/pickLists';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import './Form.css'


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
        // getTasks(location.state.record.item._id)
    }, [])

    const initialValues = {
        
        fullName: '',
        companyName:'',
        designation:'',
        phone: '',    
        leadSource: '',
        industry: '',
        leadStatus: '',
        email: '',
        linkedinProfile:'',
        location:'',
        appointmentDate:'',
        demo:'',
        month:'',
        remarks:'',
        primaryPhone:'',
        secondaryPhone:'',
        createdDate: '',
        modifiedDate: '',
    }

    const savedValues = {
       
        fullName: singleLead?.fullName ?? "",
        companyName:singleLead?.companyName ?? "",
        designation:singleLead?.designation??"",
        phone: singleLead?.phone ?? "",
        leadSource: singleLead?.leadSource ?? "",
        industry: singleLead?.industry ?? "",
        leadStatus: singleLead?.leadStatus ?? "",
        email: singleLead?.email ?? "",      
        linkedinProfile: singleLead?.linkedinProfile ?? "",
        location: singleLead?.location ?? "",
        primaryPhone:singleLead?.primaryPhone ??"",
        secondaryPhone:singleLead?.secondaryPhone??"",
        appointmentDate: new Date(singleLead?.appointmentDate).getUTCFullYear()
        + '-' + ('0' + (new Date(singleLead?.appointmentDate).getUTCMonth() + 1)).slice(-2)
        + '-' + ('0' + (new Date(singleLead?.appointmentDate).getUTCDate())).slice(-2) ||  "",
        demo: singleLead?.demo ?? "",
        month:singleLead?.month ??"",
        remarks: singleLead?.remarks ?? "",
        createdDate: new Date(singleLead?.createdDate).toLocaleString(),
        modifiedDate: new Date(singleLead?.modifiedDate).toLocaleString(),
        _id: singleLead?._id ?? "",
        createdBy: (() => {
            try {
              return JSON.parse(singleLead?.createdBy);
            } catch {
              return "";
            }
          })(),
        modifiedBy: (() => {
            try {
              return JSON.parse(singleLead?.modifiedBy);
            } catch {
              return "";
            }
          })(),
    }

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const phoneRegex = /^\d{10}$/; // matches 10 digits
    const landlineRegex = /^\d{2,5}-\d{6,8}$/; // matches 2-5 digits, hyphen, 6-8 digits

    const validationSchema = Yup.object({
        fullName: Yup
            .string()
            .required('Required')
            // .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
            .max(15, 'lastName must be less than 15 characters'),
            companyName: Yup
            .string()
            .required('Required')
            .max(25, 'lastName must be less than 15 characters'),
        phone: Yup
            .string()
            .matches(phoneRegex, 'Phone number is not valid')
            .min(10, "Phone number must be 10 characters, its short")
            .max(10, "Phone number must be 10 characters,its long"),

        leadStatus: Yup
            .string()
            .required('Required'),
        email: Yup
            .string()
            .email('Invalid email address')
            .required('Required'),

        // primaryPhone: Yup
        //     .string()
        //     .matches(phoneRegex, 'Phone number is not valid'),
        // secondaryPhone:Yup
        //     .string()
        //     .matches(landlineRegex,'Phone number is not valid'),
    })


    const formSubmission = (values) => {
        console.log('form submission value', values);

        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()
        let appointmentDateSec = new Date (values.appointmentDate).getTime()
        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
           values.appointmentDate = appointmentDateSec;
           values.createdBy = (sessionStorage.getItem("loggedInUser"));
           values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
          
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec;
            values.appointmentDate = appointmentDateSec;
            values.createdBy = singleLead.createdBy;
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
          
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

    const openInNewTab = (url) => {
        window.open(url, '_blank');
      }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h3>New Lead</h3> : <h3>Lead Detail Page </h3>
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
                                <Form className="my-form">
                                    <Grid container spacing={2}>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="fullName">Full Name<span className="text-danger">*</span></label>
                                            <Field name='fullName' type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="fullName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="companyName" >Company Name<span className="text-danger">*</span> </label>
                                            <Field name='companyName' type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="companyName" />
                                            </div>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="designation" >Designation</label>
                                            <Field name='designation' type="text" class="form-input" />
                                        </Grid>

                                        
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
                                            <label htmlFor="linkedinProfile">Linkedin Profile</label>
                                            <Field name="linkedinProfile" type="url" class="form-input" 
                                            style={{color: 'blue', textDecoration: 'underline'}}
                                             onClick={() => {
                                                const linkedinProfile = values.linkedinProfile;
                                                if (linkedinProfile) {
                                                //   window.location.href = linkedinProfile;
                                                  openInNewTab(linkedinProfile)
                                                }
                                              }}
                                              />
                                        
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="location">Location</label>
                                            <Field name="location" type="text" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="appointmentDate">Appointment Date</label>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        name="appointmentDate"
                                                        value={values.appointmentDate}
                                                        onChange={(e) => {
                                                            setFieldValue('appointmentDate', e)
                                                        }}
                                                        renderInput={(params) => <TextField  {...params} style={{width:'100%'}} error={false} />}
                                                    />

                                                </LocalizationProvider>
                                            {/* <Field name="appointmentDate" type="date" class="form-input" /> */}
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="demo">Demo</label>
                                            <Field name="demo" component={CustomizedSelectForFormik} className="form-customSelect">
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    LeadsDemoPicklist.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="month">Pipeline Month</label>
                                            <Field name="month" component={CustomizedSelectForFormik} className="form-customSelect">
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    LeadMonthPicklist.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="primaryPhone">Primary Phone</label>
                                            <Field name="primaryPhone" type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="primaryPhone" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="secondaryPhone">Secondary Phone</label>
                                            <Field name="secondaryPhone" type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="secondaryPhone" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="remarks">Remarks</label>
                                            <Field name="remarks" as="textarea" rows="6" class="form-input-textarea" style={{width:'100%'}} />
                                        </Grid>
                                        {!showNew && (
                                            <>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="createdDate" >Created Date</label>
                                                    <Field name='createdDate' type="text" class="form-input" 
                                                    value={values.createdBy.userFullName +" , "+ values.createdDate}
                                                    disabled />
                                                </Grid>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="modifiedDate" >Modified Date</label>
                                                    <Field name='modifiedDate' type="text" class="form-input"
                                                    value={values.modifiedBy.userFullName +" , "+ values.modifiedDate} disabled />
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>

                                    <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>
                                            {
                                                showNew ?
                                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty}>Save</Button>
                                                    :
                                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty}>Update</Button>
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

// import React, { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom';
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { Grid, Button, TextField, Forminput, Autocomplete, DialogActions, MenuItem } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom"
// import axios from 'axios'
// // import "../formik/FormStyles.css"
// import ToastNotification from '../toast/ToastNotification';
// import { NameSalutionPickList, LeadSourcePickList, IndustryPickList, LeadStatusPicklist } from '../../data/pickLists';
// import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
// import './Form.css'

// const url = `${process.env.REACT_APP_SERVER_URL}/UpsertLead`;
// const fetchUsersbyName = `${process.env.REACT_APP_SERVER_URL}/usersbyName`;

// const LeadDetailPage = ({ item }) => {

//     const [singleLead, setsingleLead] = useState();
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [showNew, setshowNew] = useState()

//     const [usersRecord, setUsersRecord] = useState([])
//     // notification
//     const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })


//     useEffect(() => {
//         console.log('passed record', location.state.record.item);
//         setsingleLead(location.state.record.item);
//         setshowNew(!location.state.record.item)
//         FetchUsersbyName('')
//         // getTasks(location.state.record.item._id)
//     }, [])

//     const initialValues = {
//         salutation: '',
//         firstName: '',
//         lastName: '',
//         fullName: '',
//         phone: '',
//         leadSource: '',
//         industry: '',
//         leadStatus: '',
//         email: '',
//         createdbyId: '',
//         createdBy: "",
//         modifiedBy: "",
//         createdDate: '',
//         modifiedDate: '',
//     }

//     const savedValues = {
//         salutation: singleLead?.salutation ?? "",
//         firstName: singleLead?.firstName ?? "",
//         lastName: singleLead?.lastName ?? "",
//         fullName: singleLead?.fullName ?? "",
//         phone: singleLead?.phone ?? "",
//         leadSource: singleLead?.leadSource ?? "",
//         industry: singleLead?.industry ?? "",
//         leadStatus: singleLead?.leadStatus ?? "",
//         email: singleLead?.email ?? "",
//         createdbyId: singleLead?.createdbyId ?? "",
//         createdDate: new Date(singleLead?.createdDate).toLocaleString(),
//         modifiedDate: new Date(singleLead?.modifiedDate).toLocaleString(),
//         _id: singleLead?._id ?? "",
//         userDetails: singleLead?.userDetails ?? "",
//         createdBy:(()=>{
//             try{ return JSON.parse(singleLead?.createdBy)}
//             catch{return ""}
//         })(),
//         modifiedBy:(()=>{
//             try{return JSON.parse(singleLead?.modifiedBy)}
//             catch{return ""}
//         })(),
//     }

//     const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

//     const validationSchema = Yup.object({
//         firstName: Yup
//             .string()
//             .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
//             .max(15, 'lastName must be less than 15 characters'),
//         lastName: Yup
//             .string()
//             .required('Required')
//             .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
//             .min(3, 'lastName must be more than 3 characters')
//             .max(15, 'lastName must be less than 15 characters'),
//         phone: Yup
//             .string()
//             .matches(phoneRegExp, 'Phone number is not valid')
//             .min(10, "Phone number must be 10 characters, its short")
//             .max(10, "Phone number must be 10 characters,its long"),

//         leadStatus: Yup
//             .string()
//             .required('Required'),
//         email: Yup
//             .string()
//             .email('Invalid email address')
//             .required('Required'),
//     })

//     const FetchUsersbyName = (inputValue) => {
//         console.log('inside FetchLeadsbyName fn');
//         console.log('newInputValue', inputValue)
//         axios.post(`${fetchUsersbyName}?searchKey=${inputValue}`)
//             .then((res) => {
//                 console.log('res fetchLeadsbyName', res.data)
//                 if (typeof (res.data) === "object") {
//                     setUsersRecord(res.data)
//                 }
//             })
//             .catch((error) => {
//                 console.log('error fetchLeadsbyName', error);
//             })
//     }

//     const formSubmission = (values) => {
//         console.log('form submission value', values);

//         let dateSeconds = new Date().getTime();
//         let createDateSec = new Date(values.createdDate).getTime()

//         if (showNew) {
//             values.modifiedDate = dateSeconds;
//             values.createdDate = dateSeconds;
//             values.fullName = values.firstName + ' ' + values.lastName;
//             values.createdBy = (sessionStorage.getItem("loggedInUser"));
//             values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
//            // values.UserName =values.userDetails.userName
//             // values.UserId =values.userDetails.id
//         }
//         else if (!showNew) {
//             values.modifiedDate = dateSeconds;
//             values.createdDate = createDateSec;
//             values.fullName = values.firstName + ' ' + values.lastName;
//             values.createdBy = singleLead.createdBy;
//             values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
//             // values.UserName =values.userDetails.userName
//             // values.UserId =values.userDetails.id
//         }
//         console.log('after change form submission value', values);

//         axios.post(url, values)
//             .then((res) => {
//                 console.log('upsert record  response', res);
//                 setNotify({
//                     isOpen: true,
//                     message: res.data,
//                     type: 'success'
//                 })
//                 setTimeout(() => {
//                     navigate(-1);
//                 }, 2000)

//             })
//             .catch((error) => {
//                 console.log('upsert record error', error);
//                 setNotify({
//                     isOpen: true,
//                     message: error.message,
//                     type: 'error'
//                 })
//             })
//     }
//     const handleFormClose = () => {
//         navigate(-1)
//     }

//     return (
//         <Grid item xs={12} style={{ margin: "20px" }}>
//             <div style={{ textAlign: "center", marginBottom: "10px" }}>
//                 {
//                     showNew ? <h2>New Enquiry</h2> : <h2>Enquiry Detail Page </h2>
//                 }
//             </div>
//             <div>
//                 <Formik
//                     enableReinitialize={true}
//                     initialValues={showNew ? initialValues : savedValues}
//                     validationSchema={validationSchema}
//                     onSubmit={(values) => { formSubmission(values) }}
//                 >
//                     {(props) => {
//                         const {
//                             values,
//                             dirty,
//                             isSubmitting,
//                             handleChange,
//                             handleSubmit,
//                             handleReset,
//                             setFieldValue,
//                         } = props;

//                         return (
//                             <>
//                                 <ToastNotification notify={notify} setNotify={setNotify} />
//                                 <Form className='my-form'>
//                                     <Grid container spacing={2}>

//                                         <Grid item xs={6} md={2}>
//                                             <label htmlFor="salutation">Salutation  </label>
//                                             <Field name="salutation" component={CustomizedSelectForFormik} className="form-customSelect">
//                                                 <MenuItem value=""><em>None</em></MenuItem>
//                                                 {
//                                                     NameSalutionPickList.map((i) => {
//                                                         return <MenuItem value={i.value}>{i.text}</MenuItem>
//                                                     })
//                                                 }
//                                             </Field>
//                                         </Grid>
//                                         <Grid item xs={6} md={4}>
//                                             <label htmlFor="firstName" >First Name</label>
//                                             <Field name='firstName' type="text" class="form-input" />
//                                             <div style={{ color: 'red' }}>
//                                                 <ErrorMessage name="firstName" />
//                                             </div>
//                                         </Grid>
//                                         <Grid item xs={6} md={6}>
//                                             <label htmlFor="lastName" >Last Name<span className="text-danger">*</span> </label>
//                                             <Field name='lastName' type="text" class="form-input" />
//                                             <div style={{ color: 'red' }}>
//                                                 <ErrorMessage name="lastName" />
//                                             </div>
//                                         </Grid>
//                                         {!showNew && (
//                                             <>
//                                                 <Grid item xs={6} md={6}>
//                                                     <label htmlFor="fullName" >Full Name</label>
//                                                     <Field name='fullName' type="text" class="form-input" disabled
//                                                     />
//                                                 </Grid>
//                                             </>
//                                         )}
//                                         <Grid item xs={6} md={6}>
//                                             <label htmlFor="phone">Phone</label>
//                                             <Field name="phone" type="phone" class="form-input" />
//                                             <div style={{ color: 'red' }}>
//                                                 <ErrorMessage name="phone" />
//                                             </div>
//                                         </Grid>

//                                         <Grid item xs={6} md={6}>
//                                             <label htmlFor="email">Email <span className="text-danger">*</span></label>
//                                             <Field name="email" type="text" class="form-input" />
//                                             <div style={{ color: 'red' }}>
//                                                 <ErrorMessage name="email" />
//                                             </div>
//                                         </Grid>
//                                         <Grid item xs={6} md={6}>
//                                             <label htmlFor="leadSource"> Lead Source</label>
//                                             <Field name="leadSource" component={CustomizedSelectForFormik} className="form-customSelect">
//                                                 <MenuItem value=""><em>None</em></MenuItem>
//                                                 {
//                                                     LeadSourcePickList.map((i) => {
//                                                         return <MenuItem value={i.value}>{i.text}</MenuItem>
//                                                     })
//                                                 }
//                                             </Field>
//                                         </Grid>
//                                         <Grid item xs={6} md={6}>
//                                             <label htmlFor="industry">Industry</label>
//                                             <Field name="industry" component={CustomizedSelectForFormik} className="form-customSelect">
//                                                 <MenuItem value=""><em>None</em></MenuItem>
//                                                 {
//                                                     IndustryPickList.map((i) => {
//                                                         return <MenuItem value={i.value}>{i.text}</MenuItem>
//                                                     })
//                                                 }
//                                             </Field>
//                                         </Grid>
//                                         <Grid item xs={6} md={6}>
//                                             <label htmlFor="leadStatus"> Lead Status <span className="text-danger">*</span> </label>
//                                             <Field name="leadStatus" component={CustomizedSelectForFormik} className="form-customSelect">
//                                                 <MenuItem value=""><em>None</em></MenuItem>
//                                                 {
//                                                     LeadStatusPicklist.map((i) => {
//                                                         return <MenuItem value={i.value}>{i.text}</MenuItem>
//                                                     })
//                                                 }
//                                             </Field>
//                                             <div style={{ color: 'red' }}>
//                                                 <ErrorMessage name="leadStatus" />
//                                             </div>
//                                         </Grid>
//                                         {/* <Grid item xs={6} md={6}>
//                                             <label htmlFor="createdbyId">User Name </label>
//                                             <Autocomplete
//                                                 name="createdbyId"
//                                                 options={usersRecord}
//                                                 //  defaultValue={values.userDetails.userName}
//                                                 value={values.userDetails}
//                                                 getOptionLabel={option => option.userName || ''}
//                                                 // isOptionEqualToValue={(option, value) => option.userName === value.userName}
//                                                 onChange={(e, value) => {
//                                                     console.log('inside onchange values', value);
//                                                     if (!value) {
//                                                         console.log('!value', value);
//                                                         setFieldValue("createdbyId", '')
//                                                         setFieldValue("userDetails", '')
//                                                     } else {
//                                                         console.log('value', value);
//                                                         setFieldValue("createdbyId", value.id)
//                                                         setFieldValue("userDetails", value)
//                                                     }
//                                                 }}
//                                                 onInputChange={(event, newInputValue) => {
//                                                     console.log('newInputValue', newInputValue);
//                                                     if (newInputValue.length >= 3) {
//                                                         FetchUsersbyName(newInputValue);
//                                                     }
//                                                     else if (newInputValue.length == 0) {
//                                                         FetchUsersbyName(newInputValue);
//                                                     }
//                                                 }}
//                                                 renderInput={params => (
//                                                     <Field component={TextField} {...params} name="createdbyId" />
//                                                 )}
//                                             />
//                                         </Grid> */}
//                                         {!showNew && (
//                                             <>
//                                                 <Grid item xs={6} md={6}>
//                                                     <label htmlFor="createdDate" >Created Date</label>
//                                                     <Field name='createdDate' type="text" class="form-input"
//                                                     value={values.createdBy.userFullName +" , "+ values.createdDate}
//                                                      disabled />
//                                                 </Grid>
//                                                 <Grid item xs={6} md={6}>
//                                                     <label htmlFor="modifiedDate" >Modified Date</label>
//                                                     <Field name='modifiedDate' type="text" class="form-input" 
//                                                     value={values.modifiedBy.userFullName+" , "+ values.modifiedDate}
//                                                     disabled />
//                                                 </Grid>
//                                             </>
//                                         )}
//                                     </Grid>

//                                     <div className='action-buttons'>
//                                         <DialogActions sx={{ justifyContent: "space-between" }}>
//                                             {
//                                                 showNew ?
//                                                     <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty}>Save</Button>
//                                                     :
//                                                     <Button type='success' variant="contained" color="secondary" disabled={isSubmitting|| !dirty}>Update</Button>
//                                             }
//                                             <Button type="reset" variant="contained" onClick={handleFormClose}  >Cancel</Button>
//                                         </DialogActions>
//                                     </div>
//                                 </Form>
//                             </>
//                         )
//                     }}
//                 </Formik>
//             </div>
//         </Grid>
//     )

// }
// export default LeadDetailPage;