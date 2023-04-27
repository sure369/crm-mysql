import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {    Grid, Button, DialogActions,Autocomplete, TextField ,MenuItem} from "@mui/material";
import axios from 'axios'
import "../formik/FormStyles.css"
import PreviewFile from "../formik/PreviewFile";
import ToastNotification from "../toast/ToastNotification";
import { TaskObjectPicklist, TaskSubjectPicklist } from "../../data/pickLists";
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { LocalizationProvider   } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CustomizedSelectDisableForFormik from "../formik/CustomizedSelectDisableFormik";
import './Form.css'


const UpsertUrl = `${process.env.REACT_APP_SERVER_URL}/UpsertTask`;
const fetchAccountUrl = `${process.env.REACT_APP_SERVER_URL}/accountsname`;
const fetchLeadUrl = `${process.env.REACT_APP_SERVER_URL}/LeadsbyName`;
const fetchOpportunityUrl = `${process.env.REACT_APP_SERVER_URL}/opportunitiesbyName`;

const TaskDetailPage = ({ item ,handleModal ,showModel }) => {

    const [singleTask, setSingleTask] = useState();
    const [showNew, setshowNew] = useState()
    const [url, setUrl] = useState();
    const navigate = useNavigate();
    const fileRef = useRef();
    const location = useLocation();
    const [parentObject, setParentObject] = useState('');
    const [relatedRecNames, setRelatedRecNames] = useState([]);
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [file, setFile] = useState()
    const[showModal1,setShowModal1]=useState(showModel)
    
    const[autocompleteReadOnly,setAutoCompleteReadOnly]=useState(false)

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setSingleTask(location.state.record.item)
        console.log('true', !location.state.record.item);
        setshowNew(!location.state.record.item)
     
        if(location.state.record.item){
            console.log('inside condition')
            callEvent(location.state.record.item.object)
            setAutoCompleteReadOnly(true)
        }
        
    }, [])

    const initialValues = {
        subject: '',
        relatedTo: '',
        assignedTo: '',
        StartDate: '',
        EndDate: '',
        description: '',
        // attachments: null,
        object: '',
        // AccountId: '',
        // LeadId: '',
        // OpportunityId: '',        
        createdBy: "",
        modifiedBy: "",
        createdbyId: '',
        createdDate: '',
        modifiedDate: '',
    }

    const savedValues = {
        subject: singleTask?.subject ?? "",
        relatedto: singleTask?.relatedto ?? "",
        assignedTo: singleTask?.assignedTo ?? "",
        description: singleTask?.description ?? "",
        // attachments: singleTask?.attachments ?? "",
        object: singleTask?.object ?? "",
        // AccountId: singleTask?.AccountId ?? "",
        // LeadId: singleTask?.LeadId ?? "",
        // OpportunityId: singleTask?.OpportunityId ?? "",
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
        createdBy: (() => {
            try {
              return JSON.parse(singleTask?.createdBy);
            } catch {
              return "";
            }
          })(),
        modifiedBy: (() => {
            try {
              return JSON.parse(singleTask?.modifiedBy);
            } catch {
              return "";
            }
          })(),
    }

    const validationSchema = Yup.object({
        subject: Yup
            .string()
            .required('Required'),
            // .notOneOf((Yup.ref('None'))),
        // attachments: Yup
        //     .mixed()
        //     .nullable()
        //     .notRequired()
        // //    .test('FILE_SIZE',"Too big !",(value)=>value <1024*1024)
        // //   .test('FILE_TYPE',"Invalid!",(value)=> value && ['image/jpg','image/jpeg','image/gif','image/png'].includes(value.type))
        // ,

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
            values.createdBy = (sessionStorage.getItem("loggedInUser"));
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));    

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
                values.accountId= values.accountDetails.id;
                values.accountName= values.accountDetails.accountName;
            }else if (values.object === 'Opportunity') {                
                 delete values.AccountId; 
                 delete values.LeadId;    
                 values.opportunityId = values.opportunityDetails.id;
                 values.opportunityName = values.opportunityDetails.opportunityName
            }else if (values.object === 'Lead') {
                console.log('else')
                delete values.OpportunityId; 
                delete values.AccountId; 
                values.leadName = values.leadDetails.leadName
                values.leadId = values.leadDetails.id
            }else{
                delete values.opportunityId; 
                delete values.accountId; 
                delete values.leadId;
                delete values.accountName;
                delete values.leadName;
                delete values.opportunityName; 
            }
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec
            values.createdBy = singleTask.createdBy;
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
           
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
                values.accountId= values.accountDetails.id;
                values.accountName= values.accountDetails.accountName;
               
            }else if ( values.object === 'Opportunity') {                
                 delete values.AccountId; 
                 delete values.LeadId;  
                 values.opportunityId = values.opportunityDetails.id;
                 values.opportunityName = values.opportunityDetails.opportunityName 
            }else if (values.object==='Lead') {
                console.log('inside')
                delete values.OpportunityId; 
                delete values.AccountId; 
                delete values.opportunityDetails
                delete values.accountDetails
                values.leadName = values.leadDetails.leadName
                values.leadId = values.leadDetails.id
            }else{
                delete values.OpportunityId; 
                delete values.AccountId; 
                delete values.LeadId; 
                delete values.AccountName;
                delete values.LeadName;
                delete values.OpportunityName;
            }
        }
        console.log('after change form submission value', values);

            await axios.post(UpsertUrl, values)
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

        let url1 = e === 'Account' ? fetchAccountUrl : e === 'Lead' ? fetchLeadUrl : e === 'Opportunity' ? fetchOpportunityUrl : null
        setUrl(url1)
        FetchObjectsbyName('', url1);
        if (url == null) {
            console.log('url', url);
            setRelatedRecNames([])
        }
    }

    const FetchObjectsbyName = (newInputValue, url) => {

        console.log('passed url', url)
        console.log('new Input  value', newInputValue)

        axios.post(`${url}?searchKey=${newInputValue}`)
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
                            <ToastNotification notify={notify} setNotify={setNotify} />
                            <Form className="my-form">
                                <Grid container spacing={2}>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="subject">Subject  <span className="text-danger">*</span></label>
                                        <Field name="subject" component={CustomizedSelectForFormik}  className="form-customSelect">
                                        <MenuItem value=""><em>None</em></MenuItem>
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
                                        <label htmlFor="object">Object  </label>
                                        <Field 
                                            name="object"
                                            component={autocompleteReadOnly ? CustomizedSelectDisableForFormik :CustomizedSelectForFormik } 
                                            testprop="testing" 
                                            onChange = {(e) => {
                                                console.log('customSelect value', e.target.value)
                                                callEvent(e.target.value)
                                                setFieldValue('object', e.target.value)
                                            }}                                       
                                        >    
                                         <MenuItem value=""><em>None</em></MenuItem>                                    
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
                                                readOnly={autocompleteReadOnly}
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
                                                            // setFieldValue('AccountId', '')
                                                            setFieldValue('accountDetails','')
                                                        } else if (values.object === 'Opportunity') {
                                                            // setFieldValue('OpportunityId', '')
                                                            setFieldValue('opportunityDetails','')
                                                        } else if (values.object === 'Lead') {
                                                            // setFieldValue('LeadId', '')
                                                            setFieldValue('leadDetails','')
                                                        }
                                                    }
                                                    else{
                                                        console.log('value',value);
                                                        if (values.object === 'Account') {
                                                            // setFieldValue('AccountId', value.id)
                                                            setFieldValue('accountDetails',value)
                                                        } else if (values.object === 'Opportunity') {
                                                            // setFieldValue('OpportunityId', value.id)
                                                            setFieldValue('opportunityDetails',value)
                                                        } else if (values.object === 'Lead') {
                                                            // setFieldValue('LeadId', value.id)
                                                            setFieldValue('leadDetails',value)
                                                        }
                                                    }
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    if (newInputValue.length >= 3) {
                                                        FetchObjectsbyName(newInputValue, url)
                                                    }
                                                    else  if (newInputValue.length ==0) {
                                                        FetchObjectsbyName(newInputValue, url)
                                                    }
                                                }}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="realatedTo" />
                                                )}
                                                />                                         
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="assignedTo">Assigned To  </label>
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
                                         renderInput={(params) => <TextField  {...params} style={{width:'100%'}} error={false} />}
                                     />
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="EndDate">EndDate   </label> <br/>
                                        <DateTimePicker
                                                renderInput={(params) => <TextField {...params} style={{width:'100%'}} error={false}/>}
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
                                        <Field as="textarea" name="description" class="form-input-textarea" style={{width:'100%'}}/>
                                    </Grid>
                                    {!showNew && (
                                        <>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="createdDate" >Created Date</label>
                                                <Field name='createdDate' type="text" class="form-input" 
                                                value={values.createdBy.userFullName+" , "+ values.createdDate} disabled />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="modifiedDate" >Modified Date</label>
                                                <Field name='modifiedDate' type="text" class="form-input" 
                                                value={values.createdBy.userFullName+" , "+values.createdDate} disabled />
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

