import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Button, DialogActions } from "@mui/material";
// import axios from 'axios'
import "../formik/FormStyles.css"
import ToastNotification from '../toast/ToastNotification';
import { RequestServer } from "../api/HttpReq";

const urlSendWhatsAppbulk = `/bulkewhatsapp`

const WhatAppModalPage = ({ data, handleModal, bulkMail }) => {

    const [parentRecord, setParentRecord] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // notification
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    useEffect(() => {
        console.log('whats app data', data);
        setParentRecord(data)

    }, [])

    const initialValues = {
        subject: '',
        recordsData: '',
        attachments: ''
    }

    const validationSchema = Yup.object({
        subject: Yup
            .string()
            .required('Required'),
    })


    const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);

        values.recordsData = parentRecord;
        console.log('len', values.recordsData.length > 0);

        let arr = [];
        arr.push((values.recordsData));
        console.log('arr', arr);
        let RecordConvert = (values.recordsData.length > 0 ? (values.recordsData) : (arr))
        console.log('RecordConvert', RecordConvert)


        RecordConvert.forEach(element => {
            onebyoneWhatsapp(element,values)
        });

    }

    const onebyoneWhatsapp=(values,element)=>{

    console.log('values',values);
    console.log('element',element)

    let mergeBody = `Hai ${values.fullName},`+ '\n'+"\n"+ element.subject

        let formData = new FormData();
        formData.append('subject', mergeBody);
        formData.append('phoneNumber',values.phone)
        // formData.append('recordsData', JSON.stringify(RecordConvert));
        formData.append('file', element.attachments);

        RequestServer(urlSendWhatsAppbulk, formData)
            .then((res) => {
                console.log('email send res', res)
               if(res.success){
                setNotify({
                    isOpen: true,
                    message: res.data,
                    type: 'success'
                })
                setTimeout(() => {
                    handleModal(false)
                }, 2000)
               }else{
                setNotify({
                    isOpen: true,
                    message: res.error.message,
                    type: 'success'
                })
                setTimeout(() => {
                    handleModal(false)
                }, 2000)
               }
                
            })
            .catch((error) => {
                console.log('email send error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
                setTimeout(() => {
                    handleModal(false)
                }, 2000)
            })
    }

    return (
        <>
            <Grid item xs={12} style={{ margin: "20px" }}>
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <h3>New Whats App</h3>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
                >
                    {(props) => {
                        const {isSubmitting, setFieldValue} = props;

                        return (
                            <>
                                <Form>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={12}>
                                            <label htmlFor="subject">Subject  <span className="text-danger">*</span></label>
                                            <Field name="subject" as="textarea" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="subject" />
                                            </div>
                                        </Grid>

                                        <Grid item xs={12} md={12}>
                                            <label htmlFor="attachments">Attachments</label>
                                            <input id="attachments" name="attachments" type="file"

                                                onChange={(event) => {
                                                    console.log('event', event.target.files[0]);
                                                    setFieldValue("attachments", event.target.files[0]);
                                                }} className="form-input" />

                                        </Grid>
                                    </Grid>
                                    <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>

                                            <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Send</Button>

                                            <Button type="reset" variant="contained" onClick={(e) => handleModal(false)} >Cancel</Button>

                                        </DialogActions>
                                    </div>
                                </Form>
                            </>
                        )
                    }}
                </Formik>
            </Grid>
            <ToastNotification notify={notify} setNotify={setNotify} />
        </>
    )
}
export default WhatAppModalPage

