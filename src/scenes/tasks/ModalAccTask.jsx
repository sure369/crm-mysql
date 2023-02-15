import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Grid, Button, FormControl, Stack, Alert, DialogActions,
    Autocomplete, TextField
} from "@mui/material";
import axios from 'axios'
import "../formik/FormStyles.css"
import Notification from '../toast/Notification';
import { TaskSubjectPicklist } from "../../data/pickLists";

const UpsertUrl = `${process.env.REACT_APP_SERVER_URL}/UpsertTask`;

const ModalAccTask = ({ item, handleModal }) => {

    const [taskParentRecord, setTaskParentRecord] = useState();
    const[notify,setNotify]=useState({isOpen:false,message:'',type:''})

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log('passed record', location.state.record.item);
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
        AccountId: '',
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
        let account = taskParentRecord._id;
        let dateSeconds = new Date().getTime();
        let StartDateSec = new Date(values.StartDate).getTime()
        let EndDateSec = new Date(values.EndDate).getTime()
        
        values.modifiedDate = dateSeconds;
        values.createdDate = dateSeconds;
        values.AccountId = account;
        values.object = 'Account'
        values.accountDetails={
            leadName:taskParentRecord.accountName,
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

        await axios.post(UpsertUrl, values)

            .then((res) => {
                console.log('task form Submission  response', res);
                setNotify({
                    isOpen:true,
                    message:res.data,
                    type:'success'
                  })
                setTimeout(() => {
                     window.location.reload();
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
                                    <Grid item xs={6} md={4}>
                                        <label htmlFor="subject">Subject  <span className="text-danger">*</span></label>
                                        <Field name="subject" as="select" class="form-input">
                                        <option value=''><em>None</em></option>
                                              {
                                                TaskSubjectPicklist.map((i)=>{
                                                    return <option value={i.value}>{i.label}</option>
                                                })
                                              }  
                                        </Field>

                                        <div style={{ color: 'red' }}>
                                            <ErrorMessage name="subject" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <label htmlFor="assignedTo">assignedTo  </label>
                                        <Field name="assignedTo" type="text" class="form-input" />
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <label htmlFor="StartDate">startDate   </label>
                                        <Field name="StartDate" type="date" class="form-input" />
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <label htmlFor="StartTime">startTime   </label>
                                        <Field name="StartTime" type="time" class="form-input" />
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <label htmlFor="EndDate">EndDate   </label>
                                        <Field name="EndDate" type="date" class="form-input" />
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <label htmlFor="EndTime">EndTime   </label>
                                        <Field name="EndTime" type="time" class="form-input" />
                                    </Grid>
                                    <Grid item xs={12} md={12}>

                                        <label htmlFor="attachments">attachments</label>

                                        <Field name="attacgments" type="file"
                                            className="form-input"
                                            onChange={(event) => {
                                                setFieldValue("attachments", (event.currentTarget.files[0]));
                                            }}
                                        />
                                        <div style={{ color: 'red' }}>
                                            <ErrorMessage name="attachments" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <label htmlFor="description">Description</label>
                                        <Field as="textarea" name="description" class="form-input" />
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
export default ModalAccTask

