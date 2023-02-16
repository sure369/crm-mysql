import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Button, DialogActions, } from "@mui/material";
import axios from 'axios'
import "../formik/FormStyles.css"
import Notification from '../toast/Notification';
import CustomizedRichTextField from "../formik/CustomizedRichTextField";

const urlSendEmailbulk = `${process.env.REACT_APP_SERVER_URL}/bulkemail`

const EmailModalPage = ({ data, handleModal, bulkMail }) => {

    const [parentRecord, setParentRecord] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // notification
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

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

        var p= values.htmlBody
        var parser = new DOMParser();
var htmlDoc = parser.parseFromString(p, 'text/html');
console.log('html body',htmlDoc.body.getElementsByTagName("P")[0].innerText);



        let mergeBody = `Hai ${element.fullName},`+ '\n'+"\n"+ values.htmlBody

        let formData = new FormData();
        formData.append('subject', values.subject);
        formData.append('htmlBody', mergeBody);
        formData.append('emailId',element.email)
        // formData.append('recordsData', JSON.stringify(element));
        formData.append('file', values.attachments);

        axios.post(urlSendEmailbulk, formData)
            .then((res) => {
                console.log('email send res', res)
                setNotify({
                    isOpen: true,
                    message: res.data,
                    type: 'success'
                })
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
                            isSubmitting, setFieldValue
                        } = props;

                        return (
                            <>

                                <Form>
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

            <Notification notify={notify} setNotify={setNotify} />
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
        // import Notification from '../toast/Notification';
        // import { CKEditor } from '@ckeditor/ckeditor5-react';
        // import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

        // const urlSendEmailbulk = `${process.env.REACT_APP_SERVER_URL}/bulkemail`

        // const EmailModalPage = ({ data, handleModal, bulkMail }) => {

        //     const [parentRecord, setParentRecord] = useState([]);
        //     const navigate = useNavigate();
        //     const location = useLocation();

        //     // notification
        //     const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

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

        //         let mergeBody = `Hai ${element.fullName},`+ '\n'+"\n"+ values.htmlBody

        //         let formData = new FormData();
        //         formData.append('subject', values.subject);
        //         formData.append('htmlBody', mergeBody);
        //         formData.append('emailId',element.email)
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
        //                                         {/* <Grid item xs={12} md={12}>
        //                                             <label htmlFor="htmlBody">Email Body <span className="text-danger">*</span> </label>
        //                                             <Field name="htmlBody" >

        //                                                 {({ field, meta }) => (
        //            <div>
        //                                         <CKEditor
        //                     editor={ ClassicEditor }
        //                     data="<p>Hello from CKEditor 5!</p>"
        //                     onReady={ editor => {
        //                         // You can store the "editor" and use when it is needed.
        //                         console.log( 'Editor is ready to use!', editor );
        //                     } }
        //                     onChange={ ( event, editor ) => {
        //                         const data = editor.getData();

        //                         console.log('onchange data',data);
        //                         setFieldValue('htmlBody',data)
                                
        //                     } }
        //                     onBlur={ ( event, editor ) => {
        //                         console.log( 'Blur.', editor );
        //                     } }
        //                     onFocus={ ( event, editor ) => {
        //                         console.log( 'Focus.', editor );
        //                     } }
        //                 />
        //                 </div>
        //      )}
        //                  </Field>
        //                  </Grid> */}

        //                                      {/*    <Grid item xs={12} md={12}>
        //                                             <label htmlFor="htmlBody">Email Body <span className="text-danger">*</span> </label>
        //                                             <Field name="htmlBody" >

        //                                                 {({ field, meta }) => (
        //            <div>
        //             <Editor
        //                 id='article_body'
        //                 apiKey='ihg59e2qbasf2ckpjsc4yl8fwgpfliyvl40e203kuiolaa71'
        //                 initialValue='Write...'
        //                 init={{
        //                   height: 500,
        //                   menubar: true,
        //                   plugins: [
        //                     'advlist autolink lists link image charmap print preview anchor',
        //                     'searchreplace visualblocks code fullscreen',
        //                     'insertdatetime media table paste code help wordcount',
        //                   ],
        //                   toolbar:
        //                     'undo redo | formatselect | bold italic backcolor |  alignleft aligncenter|alignright alignjustify |  bullist numlist outdent indent | removeformat |help',
        //                 }}
        //                 onEditorChange={(content, editor) => {
        //                   console.log('content',content);
        //                 }}
        //                 textareaName='htmlBody'
        //                 onChange={field.onChange}
        //                 onBlur={field.onBlur}
        //                 value={values.htmlBody}
        //               />
        //           </div>
        //                                                 )} 
        //         </Field>
        //                                         </Grid>
        //                                         */}
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

        //             <Notification notify={notify} setNotify={setNotify} />
        //         </>
        //     )
        // }
        // export default EmailModalPage


// import React, { useEffect, useState, useRef } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Grid, Button, DialogActions, } from "@mui/material";
// import axios from 'axios'
// import "../formik/FormStyles.css"
// import Notification from '../toast/Notification';
// import { Editor } from "tinymce";

// const urlSendEmailbulk = `${process.env.REACT_APP_SERVER_URL}/bulkemail`

// const EmailModalPage = ({ data, handleModal, bulkMail }) => {

//     const [parentRecord, setParentRecord] = useState([]);
//     const navigate = useNavigate();
//     const location = useLocation();

//     // notification
//     const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

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

//         let mergeBody = `Hai ${element.fullName},`+ '\n'+"\n"+ values.htmlBody

//         let formData = new FormData();
//         formData.append('subject', values.subject);
//         formData.append('htmlBody', mergeBody);
//         formData.append('emailId',element.email)
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
//                                             <label htmlFor="htmlBody">Email Body <span className="text-danger">*</span> </label>
//                                             <Field name="htmlBody" as="textarea" class="form-input" />
//                                             <div style={{ color: 'red' }}>
//                                                 <ErrorMessage name="htmlBody" />
//                                             </div>
//                                         </Grid>
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

//             <Notification notify={notify} setNotify={setNotify} />
//         </>
//     )
// }
// export default EmailModalPage

