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
import Iframe from 'react-iframe'

import ToastNotification from "../toast/ToastNotification";
// import download from 'downloadjs';
// import { saveAs } from 'file-saver'
// import fileDownload from "js-file-download";

const UpsertUrl = `${process.env.REACT_APP_SERVER_URL}/uploadfile`; 
const urlFiles =`${process.env.REACT_APP_SERVER_URL}/files`
const urlDownloadFiles =  `${process.env.REACT_APP_SERVER_URL}/download?searchKey=`



const DropFileInput = () => {

    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    // file upload response
    const[fileUploadRes,setFileUploadResponse]= useState()
    console.log('fileUploadRes',fileUploadRes)
    useEffect(() => {

       
    }, [])



    const initialValues = {
       photo:null,
    }

     const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
      

        let formData = new FormData();
        formData.append('file',values.photo);


        await axios.post(UpsertUrl, formData ,{
            headers:{'Content-Type':'multipart/form-data'}
        }) 
    
            .then((res) => {
                console.log('file Submission  response', res);
                 setFileUploadResponse(res.data)
                setNotify({
                    isOpen: true,
                    message: res.data.insertedId,
                    type: 'success'
                })            
            })
            .catch((error) => {
                console.log('file  Submission  error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
            })
    }

    const hanlePreview=()=>{
        console.log('inside hanlePreview')       
        return <div style={{position: "fixed", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.5)"}}>
           <iframe 
            src={`${fileUploadRes}`} 
            width='100%' height='1000%'
            embedded='true'
            allowfullscreen 
    ></iframe>
      </div>
    }


    return (
        <>
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>File Uploader</h3>                 
            </div>

            <Formik
                initialValues={initialValues}
                onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
            >
                {(props) => {
                    const {
                        values,
                        isSubmitting,
                        setFieldValue,
                      
                    } = props;

                    return (
                        <>
                                <ToastNotification notify={notify} setNotify={setNotify} />

                            <Form>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={12}>
                                        <label htmlFor="file">file</label>
                                        <Field id="file" name="file" type="file" 
                                        className="form-input"
                                        onChange={(event)=>{
                                            setFieldValue("photo", (event.currentTarget.files[0]));
                                        }} 
                                        />
                                    </Grid>
                                 </Grid>
                                <div className='action-buttons'>
                                    <DialogActions sx={{ justifyContent: "space-between" }}>
                                        <Button type='success' variant="contained" color="secondary"disabled={isSubmitting}>Save</Button>
                                    </DialogActions>
                                </div>
                            </Form>
                        </>
                    )
                }}
            </Formik>
                <Button onClick={hanlePreview} >View File</Button>
            
            {/* <iframe 
                    src={`${fileUploadRes}`} 
                    width='100%' height='1000%'
                    embedded='true'
                    allowfullscreen 
            /> */}
           <iframe src={`https://docs.google.com/gview?url=${fileUploadRes}&embedded=true`}></iframe>

            <iframe src={`https://view.officeapps.live.com/op/view.aspx?src=${fileUploadRes}`}></iframe>
         
         
            <img src={fileUploadRes} />
            
            </Grid>
        </>
    )

}
export default DropFileInput
