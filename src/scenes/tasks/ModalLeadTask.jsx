import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Grid, Button, FormControl, Stack, Alert, DialogActions,
    Autocomplete, TextField,MenuItem
} from "@mui/material";
import axios from 'axios'
import "../formik/FormStyles.css"
import Notification from '../toast/Notification';
import { TaskSubjectPicklist } from "../../data/pickLists";
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { LocalizationProvider   } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


const UpsertUrl = `${process.env.REACT_APP_SERVER_URL}/UpsertTask`;

const ModalTask = ({ item, handleModal }) => {

    const [taskParentRecord, setTaskParentRecord] = useState();
    const[notify,setNotify]=useState({isOpen:false,message:'',type:''})
   
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log('Task parent record', location.state.record.item);
        setTaskParentRecord(location.state.record.item)

    }, [])

    const initialValues = {
        subject: '',
        nameofContact: '',
        realatedTo: '',
        assignedTo: '',
        StartDate: '',
        StartTime: '',
        EndDate: '',
        EndTime: '',
        description: '',
        attachments: null,
        object: '',
        LeadId: '',
        createdbyId: '',
        createdDate: '',
        modifiedDate: '',
    }

    const validationSchema = Yup.object({
        subject: Yup
            .string()
            .required('Required'),
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
        let lead = taskParentRecord._id;
        let dateSeconds = new Date().getTime();
        let StartDateSec = new Date(values.StartDate).getTime()
        let EndDateSec = new Date(values.EndDate).getTime()

        values.modifiedDate = dateSeconds;
        values.createdDate = dateSeconds;        
        values.LeadId = lead;
        values.object = 'Lead'
        values.leadDetails={
            leadName:taskParentRecord.fullName,
            id:taskParentRecord._id
        }


        if (values.StartDate && values.EndDate) {
            values.StartDate = StartDateSec
            values.EndDate = EndDateSec
        }else if (values.StartDate) {
            values.StartDate = StartDateSec
        }else if (values.EndDate) {
            values.EndDate = EndDateSec
        }
        console.log('valuse after chg',values);
   
        await axios.post(UpsertUrl, values)

            .then((res) => {
                console.log('task form Submission  response', res);
                setNotify({
                    isOpen:true,
                    message:res.data,
                    type:'success'
                  })
                setTimeout(() => {
                    handleModal();
                }, 1000)
            })
            .catch((error) => {
                console.log('task form Submission  error', error);
                setNotify({
                    isOpen:true,
                    message:error.message,
                    type:'error'          
                  })
                  setTimeout(() => {
                    handleModal();
                }, 2000)
            })
    }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>New Task</h3>
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
  <Notification notify={notify} setNotify={setNotify}/>
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
                                        <label htmlFor="assignedTo">AssignedTo  </label>
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
                                         renderInput={(params) => <TextField  {...params} className='form-input' error={false} />}
                                     />

                                    </Grid>
                                  
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="EndDate">EndDate   </label> <br/>
                                        
                                        <DateTimePicker
                                                renderInput={(params) => <TextField {...params} className='form-input' error={false}/>}
                                                value={values.EndDate}
                                                onChange={(e) => {                                                  
                                                    setFieldValue('EndDate',e)                                            
                                                }}
                                                />

                                    </Grid>
                                  
                                    </LocalizationProvider>
                                    {/* <Grid item xs={12} md={12}>

                                        <label htmlFor="attachments">Attachments</label>

                                        <Field name="attacgments" type="file"
                                            className="form-input"
                                            onChange={(event) => {
                                                setFieldValue("attachments", (event.currentTarget.files[0]));
                                            }}
                                        />
                                        <div style={{ color: 'red' }}>
                                            <ErrorMessage name="attachments" />
                                        </div>
                                    </Grid> */}
                                    <Grid item xs={12} md={12}>
                                        <label htmlFor="description">Description</label>
                                        <Field as="textarea" name="description" class="form-input" />
                                    </Grid>
                                </Grid>

                                <div className='action-buttons'>
                                    <DialogActions sx={{ justifyContent: "space-between" }}>

                                        <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>

                                        <Button type="reset" variant="contained" onClick={handleModal}  >Cancel</Button>

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
export default ModalTask

