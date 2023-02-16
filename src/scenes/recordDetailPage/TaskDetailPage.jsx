import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {    Grid, Button, DialogActions,Autocomplete, TextField ,MenuItem} from "@mui/material";
import axios from 'axios'
import "../formik/FormStyles.css"
import PreviewFile from "../formik/PreviewFile";
import Notification from '../toast/Notification';
import { TaskObjectPicklist, TaskSubjectPicklist } from "../../data/pickLists";
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { LocalizationProvider   } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const UpdateUrl = `${process.env.REACT_APP_SERVER_URL}/UpdateTask`;
const InsertUrl = `${process.env.REACT_APP_SERVER_URL}/InsertTask`;



const fetchAccountUrl = `${process.env.REACT_APP_SERVER_URL}/accountsname`;
const fetchLeadUrl = `${process.env.REACT_APP_SERVER_URL}/LeadsbyName`;
const fetchOpportunityUrl = `${process.env.REACT_APP_SERVER_URL}/opportunitiesbyName`;

const TaskDetailPage = ({ item ,handleModal ,showModel }) => {

    const [url,setUrl]=useState();
    const [singleTask, setSingleTask] = useState();
    const [showNew, setshowNew] = useState()
    const [objectUrl, setObjectUrl] = useState();
    const navigate = useNavigate();
    const fileRef = useRef();
    const location = useLocation();
    const [parentObject, setParentObject] = useState('');
    const [relatedRecNames, setRelatedRecNames] = useState([]);
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [file, setFile] = useState()
    const[showModal1,setShowModal1]=useState(showModel)

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setSingleTask(location.state.record.item)
        console.log('true', !location.state.record.item);
        setshowNew(!location.state.record.item)
        if(location.state.record.item){
            callEvent(location.state.record.item.object)
        }
        (!location.state.record.item ? setUrl(InsertUrl) : setUrl(UpdateUrl))
    }, [])

    const initialValues = {
        subject: '',
        relatedTo: '',
        assignedTo: '',
        StartDate: '',
        // StartTime: '',
        EndDate: '',
        // EndTime: '',
        description: '',
        attachments: null,
        object: '',
        AccountId: '',
        LeadId: '',
        OpportunityId: '',
        createdbyId: '',
        createdDate: '',
        modifiedDate: '',
    }



    const savedValues = {
        subject: singleTask?.subject ?? "",
        relatedto: singleTask?.relatedto ?? "",
        assignedTo: singleTask?.assignedTo ?? "",
        // StartTime: singleTask?.StartTime ?? "",       
        // EndTime: singleTask?.EndTime ?? "",
        description: singleTask?.description ?? "",
        attachments: singleTask?.attachments ?? "",
        object: singleTask?.object ?? "",
        AccountId: singleTask?.AccountId ?? "",
        LeadId: singleTask?.LeadId ?? "",
        OpportunityId: singleTask?.OpportunityId ?? "",
        createdbyId: singleTask?.createdbyId ?? "",
        createdDate: new Date(singleTask?.createdDate).toLocaleString(),
        modifiedDate: new Date(singleTask?.modifiedDate).toLocaleString(),
        _id: singleTask?._id ?? "",
        StartDate:new Date(singleTask?.StartDate),
        EndDate:new Date(singleTask?.EndDate),
        // StartDate:new Date(singleTask?.StartDate).getUTCFullYear()
        // + '-' +  ('0'+ (new Date(singleTask?.StartDate).getUTCMonth() + 1)).slice(-2) 
        // + '-' + ('0'+ ( new Date(singleTask?.StartDate).getUTCDate())).slice(-2) ||'',
        // EndDate:  new Date(singleTask?.EndDate).getUTCFullYear()
        // + '-' +  ('0'+ (new Date(singleTask?.EndDate).getUTCMonth() + 1)).slice(-2) 
        // + '-' + ('0'+ ( new Date(singleTask?.EndDate).getUTCDate())).slice(-2) ||'',

        accountDetails:singleTask?.accountDetails ??"",
        leadDetails:singleTask?.leadDetails ??"",
        opportunityDetails:singleTask?.opportunityDetails ??"",

    }


    const validationSchema = Yup.object({
        subject: Yup
            .string()
            .required('Required'),
            // .notOneOf((Yup.ref('None'))),
        attachments: Yup
            .mixed()
            .nullable()
            .notRequired()
        //    .test('FILE_SIZE',"Too big !",(value)=>value <1024*1024)
        //   .test('FILE_TYPE',"Invalid!",(value)=> value && ['image/jpg','image/jpeg','image/gif','image/png'].includes(value.type))
        ,

    })

    const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);

        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()
        let StartDateSec = new Date(values.StartDate).getTime()
        let EndDateSec = new Date(values.EndDate).getTime()

        if (showNew) {

            console.log('dateSeconds',dateSeconds)
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;

            if (values.StartDate && values.EndDate) {
                values.StartDate = StartDateSec
                values.EndDate = EndDateSec
            }else if (values.StartDate) {
                values.StartDate = StartDateSec
            }else if (values.EndDate) {
                values.EndDate = EndDateSec
            }
            if (values.object === 'Account') {               
                delete values.OpportunityId; 
                delete values.LeadId; 
            }else if (values.object === 'Opportunity') {                
                 delete values.AccountId; 
                 delete values.LeadId;    
            }else if (values.object === 'Lead') {
                delete values.OpportunityId; 
                delete values.AccountId; 
            }else{
                delete values.OpportunityId; 
                delete values.AccountId; 
                delete values.LeadId; 
            }
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec

            if (values.StartDate && values.EndDate) {
                values.StartDate = StartDateSec
                values.EndDate = EndDateSec
            }
            else if (values.StartDate) {
                values.StartDate = StartDateSec
            }
            else if (values.EndDate) {
                values.EndDate = EndDateSec
            }
            if ( values.object === 'Account') {               
                delete values.OpportunityId; 
                delete values.LeadId;
                if(!values.AccountId){
                    delete values.AccountId
                }
            }else if ( values.object === 'Opportunity') {                
                 delete values.AccountId; 
                 delete values.LeadId;  
                 if(!values.OpportunityId){
                    delete values.OpportunityId
                }  
            }else if (values.object==='Lead') {
                delete values.OpportunityId; 
                delete values.AccountId; 
                if(!values.LeadId){
                    delete values.LeadId
                }
            }else{
                delete values.OpportunityId; 
                delete values.AccountId; 
                delete values.LeadId; 
            }
        }
        console.log('after change form submission value', values);

            await axios.post(url, values)
                .then((res) => {
                    console.log('task form Submission  response', res);
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
                    console.log('task form Submission  error', error);
                    setNotify({
                        isOpen: true,
                        message: error.message,
                        type: 'error'
                    })
                })
        }

       

    const callEvent = (e) => {

        console.log('inside call event',initialValues.object)

        let objurl1 = e === 'Account' ? fetchAccountUrl : e === 'Lead' ? fetchLeadUrl : e === 'Opportunity' ? fetchOpportunityUrl : null
        setObjectUrl(objurl1)
        FetchObjectsbyName('', objurl1);
        if (objectUrl == null) {
            console.log('objectUrl', objectUrl);
            setRelatedRecNames([])
        }
    }

    const FetchObjectsbyName = (newInputValue, objectUrl) => {

        console.log('passed url', objectUrl)
        console.log('new Input  value', newInputValue)

        axios.post(`${objectUrl}?searchKey=${newInputValue}`)
            .then((res) => {
                console.log('res Fetch Objects byName', res.data)
                if (typeof (res.data) === "object") {
                    setRelatedRecNames(res.data)
                }
            })
            .catch((error) => {
                console.log('error fetchAccountsbyName', error);
            })
    }

    const handleClosePage = () => {
        navigate(-1)
    }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h3>New Task</h3> : <h3>Task Detail Page </h3>
                }
            </div>

            <Formik
                enableReinitialize={true}
                // initialValues={initialValues}
                initialValues={showNew ? initialValues : savedValues}
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
                            <Notification notify={notify} setNotify={setNotify} />

                            <Form>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="subject">Subject  <span className="text-danger">*</span></label>
                                        <Field name="subject" component={CustomizedSelectForFormik}  className="form-customSelect">
                                                    {
                                                        TaskSubjectPicklist.map((i)=>{
                                                            return <MenuItem value={i.value}>{i.text}</MenuItem>	
                                                        })
                                                    }
                                                </Field>
                                        <div style={{ color: 'red' }}>
                                            <ErrorMessage name="subject" />
                                        </div>
                                    </Grid>                            
                                    
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="object">object  </label>
                                        <Field 
                                            name="object"
                                            component={CustomizedSelectForFormik} 
                                            testprop="testing" 
                                            onChange = {(e) => {
                                                console.log('customSelect value', e.target.value)
                                                
                                                setFieldValue('object', e.target.value)
                                                callEvent(e.target.value)
                                            }}
                                        >
                                                                                        
                                              {
                                                TaskObjectPicklist.map((i)=>{
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                })
                                              } 
                                        </Field>
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="relatedto"> Realated To  </label>
                                        <Autocomplete
                                            name="relatedto"
                                            options={relatedRecNames}
                                            value={values.accountDetails ||values.opportunityDetails ||values.leadDetails  }

                                            getOptionLabel={option => option.leadName || option.accountName || option.opportunityName || ''}

                                            isOptionEqualToValue={(option, value) =>
                                                option.id === value
                                            }
                                            onChange={(e, value) => {

                                                console.log('inside onchange values', value);
                                                if(!value){                                
                                                    console.log('!value',value);
                                                    if (values.object === 'Account') {
                                                        setFieldValue('AccountId', '')
                                                        setFieldValue('accountDetails','')
                                                    } else if (values.object === 'Opportunity') {
                                                        setFieldValue('OpportunityId', '')
                                                        setFieldValue('opportunityDetails','')
                                                    } else if (values.object === 'Lead') {
                                                        setFieldValue('LeadId', '')
                                                        setFieldValue('leadDetails','')
                                                    }

                                                  }else{
                                                    console.log('value',value);
                                                    if (values.object === 'Account') {
                                                        setFieldValue('AccountId', value.id)
                                                        setFieldValue('accountDetails',value)
                                                    } else if (values.object === 'Opportunity') {
                                                        setFieldValue('OpportunityId', value.id)
                                                        setFieldValue('opportunityDetails',value)
                                                    } else if (values.object === 'Lead') {
                                                        setFieldValue('LeadId', value.id)
                                                        setFieldValue('leadDetails',value)
                                                    }
                                                  }
                                            }}

                                            onInputChange={(event, newInputValue) => {
                                                if (newInputValue.length >= 3) {
                                                    FetchObjectsbyName(newInputValue, url)
                                                }
                                            }}
                                            renderInput={params => (
                                                <Field component={TextField} {...params} name="realatedTo" />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="assignedTo">assignedTo  </label>
                                        <Field name="assignedTo" type="text" class="form-input" />
                                    </Grid>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        
                                      
                                    <Grid item xs={6} md={6}>
                                    <label htmlFor="StartDate">Start Date </label> <br/>
                                    <DateTimePicker 
                                     name="StartDate"
                                        value={values.StartDate}
                                        onChange={(e)=>{
                                            setFieldValue('StartDate',e)
                                        }}
                                         renderInput={(params) => <TextField  {...params} className='form-input'  />}
                                     />

                                    </Grid>
                                  
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="EndDate">EndDate   </label> <br/>
                                        
                                        <DateTimePicker
                                                renderInput={(params) => <TextField {...params} className='form-input' />}
                                                value={values.EndDate}
                                                onChange={(e) => {                                                  
                                                    setFieldValue('EndDate',e)                                            
                                                }}
                                                />

                                    </Grid>
                                  
                                    </LocalizationProvider>
                                    {/* <Grid item xs={12} md={12}>

                                        <label htmlFor="attachments">attachments</label>

                                        <Field name="attachments" type="file"
                                            className="form-input"
                                            onChange={(event) => {

                                                // var reader = new FileReader();
                                                // var url = reader.readAsDataURL(event.currentTarget.files[0]);
                                                // console.log('url ',url);
                                                console.log('ee', event.currentTarget.files[0]);
                                                setFieldValue("attachments", (event.currentTarget.files[0]));
                                                setFile(URL.createObjectURL(event.currentTarget.files[0]));


                                            }}
                                        />
                                        {
                                            file && <img src={file} />
                                        }

                                                //  <input id="attachments" name="attachments" type="file"
                                                //         ref={fileRef}
                                                //         onChange={(event) => {
                                                        
                                                //             setFieldValue("attachments", (event.target.files[0]));
                                                //         }} className="form-input" />
                                                        
                                                //       reader.readAsDataURL 
                                                //        {values.attachments && <PreviewFile file={values.attachments} />} 

                                        <div style={{ color: 'red' }}>
                                            <ErrorMessage name="attachments" />
                                        </div>
                                    </Grid> */}

                                    <Grid item xs={12} md={12}>
                                        <label htmlFor="description">Description</label>
                                        <Field as="textarea" name="description" class="form-input" />
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
                                        <Button type="reset" variant="contained" onClick={handleClosePage}  >Cancel</Button>

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
export default TaskDetailPage


// const formSubmission = async (values, { resetForm }) => {
//     console.log('inside form Submission', values);

//     let dateSeconds = new Date().getTime();
//     let createDateSec = new Date(values.createdDate).getTime()
//     let StartDateSec = new Date(values.StartDate).getTime()
//     let EndDateSec = new Date(values.EndDate).getTime()

//     if (showNew) {

//         console.log('dateSeconds',dateSeconds)
//         values.modifiedDate = dateSeconds;
//         values.createdDate = dateSeconds;

//         if (values.StartDate && values.EndDate) {
//             values.StartDate = StartDateSec
//             values.EndDate = EndDateSec
//         }else if (values.StartDate) {
//             values.StartDate = StartDateSec
//         }else if (values.EndDate) {
//             values.EndDate = EndDateSec
//         }
//         if (values.AccountId != '') {               
//             delete values.OpportunityId; 
//             delete values.LeadId; 
//         }else if (values.OpportunityId != '') {                
//              delete values.AccountId; 
//              delete values.LeadId;    
//         }else if (values.LeadId != '') {
//             delete values.OpportunityId; 
//             delete values.AccountId; 
//         }else{
//             delete values.OpportunityId; 
//             delete values.AccountId; 
//             delete values.LeadId; 
//         }
      
//         console.log("test" ,values);
//         await axios.post(UpsertUrl, values)           

//             .then((res) => {
//                 console.log('task form Submission  response', res);
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
//                 console.log('task form Submission  error', error);
//                 setNotify({
//                     isOpen: true,
//                     message: error.message,
//                     type: 'error'
//                 })
//             })

//     }
//     else if (!showNew) {
//         values.modifiedDate = dateSeconds;
//         values.createdDate = createDateSec

//         if (values.StartDate && values.EndDate) {
//             values.StartDate = StartDateSec
//             values.EndDate = EndDateSec
//         }
//         else if (values.StartDate) {
//             values.StartDate = StartDateSec
//         }
//         else if (values.EndDate) {
//             values.EndDate = EndDateSec
//         }
//         if (values.AccountId != '') {               
//             delete values.OpportunityId; 
//             delete values.LeadId; 
//         }else if (values.OpportunityId != '') {                
//              delete values.AccountId; 
//              delete values.LeadId;    
//         }else if (values.LeadId != '') {
//             delete values.OpportunityId; 
//             delete values.AccountId; 
//         }else{
//             delete values.OpportunityId; 
//             delete values.AccountId; 
//             delete values.LeadId; 
//         }

//         await axios.post(UpsertUrl, values)

//             .then((res) => {
//                 console.log('task form Submission  response', res);
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
//                 console.log('task form Submission  error', error);
//                 setNotify({
//                     isOpen: true,
//                     message: error.message,
//                     type: 'error'
//                 })
//             })
//     }
// }
// ff

// const formSubmission = async (values, { resetForm }) => {
//     console.log('inside form Submission', values);

//     let dateSeconds = new Date().getTime();
//     let createDateSec = new Date(values.createdDate).getTime()
//     let StartDateSec = new Date(values.StartDate).getTime()
//     let EndDateSec = new Date(values.EndDate).getTime()

//     if (showNew) {

//         console.log('dateSeconds',dateSeconds)
//         values.modifiedDate = dateSeconds;
//         values.createdDate = dateSeconds;

//         if (values.StartDate && values.EndDate) {
//             values.StartDate = StartDateSec
//             values.EndDate = EndDateSec
//         }else if (values.StartDate) {
//             values.StartDate = StartDateSec
//         }else if (values.EndDate) {
//             values.EndDate = EndDateSec
//         }
//         if (values.AccountId != '') {               
//             delete values.OpportunityId; 
//             delete values.LeadId; 
//         }else if (values.OpportunityId != '') {                
//              delete values.AccountId; 
//              delete values.LeadId;    
//         }else if (values.LeadId != '') {
//             delete values.OpportunityId; 
//             delete values.AccountId; 
//         }else{
//             delete values.OpportunityId; 
//             delete values.AccountId; 
//             delete values.LeadId; 
//         }
//     }
//     else if (!showNew) {
//         values.modifiedDate = dateSeconds;
//         values.createdDate = createDateSec

//         if (values.StartDate && values.EndDate) {
//             values.StartDate = StartDateSec
//             values.EndDate = EndDateSec
//         }
//         else if (values.StartDate) {
//             values.StartDate = StartDateSec
//         }
//         else if (values.EndDate) {
//             values.EndDate = EndDateSec
//         }
//         if (values.AccountId != '') {               
//             delete values.OpportunityId; 
//             delete values.LeadId; 
//         }else if (values.OpportunityId != '') {                
//              delete values.AccountId; 
//              delete values.LeadId;    
//         }else if (values.LeadId != '') {
//             delete values.OpportunityId; 
//             delete values.AccountId; 
//         }else{
//             delete values.OpportunityId; 
//             delete values.AccountId; 
//             delete values.LeadId; 
//         }
//     }
//     console.log('after change form submission value', values);

//         await axios.post(UpsertUrl, values)
//             .then((res) => {
//                 console.log('task form Submission  response', res);
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
//                 console.log('task form Submission  error', error);
//                 setNotify({
//                     isOpen: true,
//                     message: error.message,
//                     type: 'error'
//                 })
//             })
//     }
