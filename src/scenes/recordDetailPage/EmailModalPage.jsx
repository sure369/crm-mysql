import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Button, DialogActions, } from "@mui/material";
import axios from 'axios'
// import "../formik/FormStyles.css"
import ToastNotification from "../toast/ToastNotification";
import { convert } from "html-to-text";
import CustomizedRichTextField from "../formik/CustomizedRichTextField";
 import '../recordDetailPage/Form.css'

const urlSendEmailbulk = `${process.env.REACT_APP_SERVER_URL}/bulkemail`

const EmailModalPage = ({ data, handleModal, bulkMail }) => {

    const [parentRecord, setParentRecord] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    // notification
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    const HTMLbodyOptions = {
        wordwrap: 130,
        // ...
      };
    useEffect(() => {
        console.log('data', data);
        console.log('bulkMail', bulkMail);
        setParentRecord(data)

    }, [])

    const initialValues = {
        subject: '',
        htmlBody: '',
        recordsData: '',
        attachments: ''
    }

    const validationSchema = Yup.object({
        subject: Yup
            .string()
            .required('Required'),
        htmlBody: Yup
            .string()
            .required('Required')
        ,
    })

    const onebyoneMail=(values,element)=>{
        console.log('values',values);
        console.log('element',element)


        const convertText = convert(values.htmlBody, HTMLbodyOptions);
        console.log('convertText',convertText)
//         var p= values.htmlBody
//         var parser = new DOMParser();
// var htmlDoc = parser.parseFromString(p, 'text/html');
// console.log('html body',htmlDoc.body.getElementsByTagName("P")[0].innerText);



        let mergeBody = `Hai ${element.fullName},`+ '\n'+"\n"+ convertText

        let formData = new FormData();
        formData.append('subject', values.subject);
        formData.append('htmlBody', mergeBody);
        formData.append('emailId',element.email)
        // formData.append('recordsData', JSON.stringify(element));
        formData.append('file', values.attachments);

        axios.post(urlSendEmailbulk, formData)
            .then((res) => {
                console.log('email send res', res)
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
               
                setTimeout(() => {
                    handleModal(false)
                }, 2000)
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

    const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
     
        values.recordsData = parentRecord;

        let arr = [];
        arr.push((values.recordsData));
        console.log('arr', arr);
        let RecordConvert = (values.recordsData.length > 0 ? (values.recordsData) : (arr))
     
        RecordConvert.forEach(element => {
            onebyoneMail(values,element)
        });

        
    }

    return (
        <>
            <Grid item xs={12} style={{ margin: "20px" }}>
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <h3>New Email</h3>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
                >
                    {(props) => {
                        const {
                            isSubmitting, setFieldValue,dirty,isValid
                        } = props;

                        return (
                            <>

                                <Form className="my-form">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={12}>
                                            <label htmlFor="subject">Subject  <span className="text-danger">*</span></label>
                                            <Field name="subject" type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="subject" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                             <label htmlFor="htmlBody">Email Body <span className="text-danger">*</span> </label>
                                             <Field name="htmlBody" component={CustomizedRichTextField}
                                             />
                                             <div style={{ color: 'red' }}>
                                                 <ErrorMessage name="htmlBody" />
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

                                            <Button type='success' variant="contained" color="secondary" disabled={isSubmitting} >Send</Button>

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
export default EmailModalPage


// import React, { useEffect, useState, useRef } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Grid, Button, DialogActions, } from "@mui/material";
// import axios from 'axios'
// import "../formik/FormStyles.css"
// import ToastNotification from "../toast/ToastNotification";
// import CustomizedRichTextField from "../formik/CustomizedRichTextField";
// import { convert } from "html-to-text";


// const urlSendEmailbulk = `${process.env.REACT_APP_SERVER_URL}/bulkemail`

// const EmailModalPage = ({ data, handleModal, bulkMail }) => {

//     const [parentRecord, setParentRecord] = useState([]);
//     const navigate = useNavigate();
//     const location = useLocation();
//     // notification
//     const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

//     const HTMLbodyOptions = {
//         wordwrap: 130,
//         // ...
//       };
//     useEffect(() => {
//         console.log('data', data);
//         console.log('bulkMail', bulkMail);
//         setParentRecord(data)

//     }, [])

//     const initialValues = {
//         subject: '',
//         htmlBody: '',
//         recordsData: '',
//         attachments: ''
//     }

//     const validationSchema = Yup.object({
//         subject: Yup
//             .string()
//             .required('Required'),
//         htmlBody: Yup
//             .string()
//             .required('Required')
//         ,
//     })

//     const onebyoneMail=(values,element)=>{
//         console.log('values',values);
//         console.log('element',element)


//         const convertText = convert(values.htmlBody, HTMLbodyOptions);
//         console.log('convertText',convertText)
// //         var p= values.htmlBody
// //         var parser = new DOMParser();
// // var htmlDoc = parser.parseFromString(p, 'text/html');
// // console.log('html body',htmlDoc.body.getElementsByTagName("P")[0].innerText);



//         let mergeBody = `Hai ${element.fullName},`+ '\n'+"\n"+ convertText

//         let formData = new FormData();
//         formData.append('subject', values.subject);
//         formData.append('content', mergeBody);
//         formData.append('toEmailId',element.email)
//         // formData.append('recordsData', JSON.stringify(element));
//         formData.append('file', values.attachments);

//         axios.post(urlSendEmailbulk, formData)
//             .then((res) => {
//                 console.log('email send res', res)
//                 setNotify({
//                     isOpen: true,
//                     message: res.data,
//                     type: 'success'
//                 })
//                 setTimeout(() => {
//                     handleModal(false)
//                 }, 2000)
//             })
//             .catch((error) => {
//                 console.log('email send error', error);
//                 setNotify({
//                     isOpen: true,
//                     message: error.message,
//                     type: 'error'
//                 })
//             })
       
//     }

//     const formSubmission = async (values, { resetForm }) => {
//         console.log('inside form Submission', values);
     
//         values.recordsData = parentRecord;

//         let arr = [];
//         arr.push((values.recordsData));
//         console.log('arr', arr);
//         let RecordConvert = (values.recordsData.length > 0 ? (values.recordsData) : (arr))
     
//         RecordConvert.forEach(element => {
//             onebyoneMail(values,element)
//         });

        
//     }

//     return (
//         <>
//             <Grid item xs={12} style={{ margin: "20px" }}>
//                 <div style={{ textAlign: "center", marginBottom: "10px" }}>
//                     <h3>New Email</h3>
//                 </div>

//                 <Formik
//                     initialValues={initialValues}
//                     validationSchema={validationSchema}
//                     onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
//                 >
//                     {(props) => {
//                         const {
//                             isSubmitting, setFieldValue
//                         } = props;

//                         return (
//                             <>

//                                 <Form>
//                                     <Grid container spacing={2}>
//                                         <Grid item xs={12} md={12}>
//                                             <label htmlFor="subject">Subject  <span className="text-danger">*</span></label>
//                                             <Field name="subject" type="text" class="form-input" />
//                                             <div style={{ color: 'red' }}>
//                                                 <ErrorMessage name="subject" />
//                                             </div>
//                                         </Grid>
//                                         <Grid item xs={12} md={12}>
//                                              <label htmlFor="htmlBody">Email Body <span className="text-danger">*</span> </label>
//                                              <Field name="htmlBody" component={CustomizedRichTextField} 
//                                              />
//                                              <div style={{ color: 'red' }}>
//                                                  <ErrorMessage name="htmlBody" />
//                                              </div>
//                                        </Grid>
//                                         <Grid item xs={12} md={12}>
//                                             <label htmlFor="attachments">Attachments</label>
//                                             <input id="attachments" name="attachments" type="file"

//                                                 onChange={(event) => {
//                                                     console.log('event', event.target.files[0]);
//                                                     setFieldValue("attachments", event.target.files[0]);
//                                                 }} className="form-input" />

//                                         </Grid>
//                                     </Grid>
//                                     <div className='action-buttons'>
//                                         <DialogActions sx={{ justifyContent: "space-between" }}>

//                                             <Button type='success' variant="contained" color="secondary" disabled={isSubmitting} >Send</Button>

//                                             <Button type="reset" variant="contained" onClick={(e) => handleModal(false)} >Cancel</Button>

//                                         </DialogActions>
//                                     </div>
//                                 </Form>
//                             </>
//                         )
//                     }}
//                 </Formik>
//             </Grid>

//             <ToastNotification notify={notify} setNotify={setNotify} />
//         </>
//     )
// }
// export default EmailModalPage

