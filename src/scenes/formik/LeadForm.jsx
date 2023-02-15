import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, FormControl, Box, TextField } from "@mui/material";
import axios from 'axios'
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import "./FormStyles.css"
const url = `${process.env.REACT_APP_SERVER_URL}/leadInsert`;

const initialValues = {
    salutation: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    leadSource: '',
    industry: '',
    leadStatus: '',
    email: '',
    fax: '',
    description: '',
    createdbyId: '',
    createdDate: '',
}

const validationSchema = Yup.object({
    lastName: Yup
        .string()
        .required('Required'),
    company: Yup
        .string()
        .required('Required'),
    leadStatus: Yup
        .string()
        .required('Required'),
})

const onSubmit = (values, { resetForm }) => {
    console.log(values);
    resetForm({ values: '' })
}

const LeadForm = () => {

    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();
    const [alertNotes, setAlertNotes] = useState({
        isShow: false,
        message: '',
        severity: ''
    })

    const toastCloseCallback = () => {
        setShowAlert(false)
    }
    return (

        <div className="container mb-10">
            <div className="col-lg-12 text-center mb-3">
                <h3>New Lead</h3>
            </div>
            <div class="container overflow-hidden ">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        axios.post(url, values)
                            .then((res) => {
                                console.log('post response', res);
                                console.log('post ', 'data send');
                                resetForm({ values: '' })
                                navigate(-1);
                            })
                            .catch((error) => {
                                console.log('error', error);
                            })
                    }}
                >

                    {
                        (props) => {
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
                                    <Form>
                                        <Grid container spacing={2}>

                                            <Grid item xs={6} md={2}>
                                                <label htmlFor="salutation">Salutation  </label>
                                                <Field name="salutation" as="select" class="form-input">
                                                    <option value="">--Select--</option>
                                                    <option value="Mr.">Mr.</option>
                                                    <option value="Ms.">Ms.</option>
                                                    <option value="Mrs.">Mrs.</option>
                                                    <option value="Dr.">Dr.</option>
                                                    <option value="Prof.">Prof.</option>
                                                </Field>
                                            </Grid>
                                            <Grid item xs={6} md={4}>

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
                                            <Grid item xs={6} md={6}>

                                                <label htmlFor="company">Company</label>
                                                <Field name="company" type="text" class="form-input" />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="company" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="phone">Phone</label>
                                                <Field name="phone" type="phone" class="form-input" />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="email">Email <span className="text-danger">*</span></label>
                                                <Field name="email" type="text" class="form-input" />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="email" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="leadSource"> lead Source</label>
                                                <Field name="leadSource" as="select" class="form-input">
                                                    <option value="">--Select--</option>
                                                    <option value="web">Web</option>
                                                    <option value="phone Inquiry">phone Inquiry</option>
                                                    <option value="Partner Referral">Partner Referral</option>
                                                    <option value="Purchased List">Purchased List</option>
                                                    <option value="other">Other</option>
                                                </Field>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="industry">Industry</label>
                                                <Field name="industry" as="select" class="form-input">
                                                    <option value="">--Select--</option>
                                                    <option value="Agriculture" >Agriculture</option>
                                                    <option value="Banking" >Banking</option>
                                                    <option value="Communications" >Communications</option>
                                                    <option value="Construction" >Construction</option>
                                                    <option value="Consulting" >Consulting</option>
                                                    <option value="Education" >Education</option>
                                                    <option value="Engineering" >Engineering</option>
                                                    <option value="Government" >Government</option>
                                                    <option value="Manufacturing" >Manufacturing</option>
                                                    <option value="Hospitality" >Hospitality</option>
                                                    <option value="Insurance" >Insurance</option>
                                                    <option value="Technology" >Technology</option>
                                                    <option value="Transportation" >Transportation</option>
                                                    <option value="Other" >Other</option>
                                                </Field>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="leadStatus"> Lead Status <span className="text-danger">*</span> </label>
                                                <Field name="leadStatus" as="select" class="form-input">
                                                    <option value="">--Select--</option>
                                                    <option value="open-not contacted">Open-Not Contacted</option>
                                                    <option value="working-contacted">Working-Contacted</option>
                                                    <option value="closed-converted">Closed-Converted</option>
                                                    <option value="closed-not converted">closed-Not Converted</option>
                                                </Field>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="fax">Fax</label>
                                                <Field name="fax" type="text" class="form-input" />
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <label htmlFor="description">Description</label>
                                                <Field as="textarea" name="description" class="form-input" />
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <Button type='success' variant="contained" color="secondary">Save</Button>
                                                <Button type="reset" variant="contained" >Cancel</Button>
                                            </Grid>
                                        </Grid>

                                    </Form>
                                </>
                            )
                        }}
                </Formik>
            </div>
        </div>
    );
}
export default LeadForm


// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { Grid, Button, FormControl } from "@mui/material";

// const initialValues = {
//     salutation: '',
//     firstName: '',
//     lastName: '',
//     company: '',
//     phone: '',
//     leadSource: '',
//     industry: '',
//     leadStatus: '',
//     email: '',
//     fax: '',
//     description: '',
// }

// const validationSchema = Yup.object({
//     lastName: Yup
//         .string()
//         .required('Required'),
//     company: Yup
//         .string()
//         .required('Required'),
//     leadStatus: Yup
//         .string()
//         .required('Required'),
// })

// const onSubmit = (values, { resetForm }) => {
//     console.log(values);
//     resetForm({ values: '' })
// }

// const LeadForm = () => {
//     return (
//         <div className="container mb-10">
//             <div className="col-lg-12 text-center mb-3">
//                 <h3>New Lead</h3>
//             </div>
//             <div class="container overflow-hidden ">
//                 <Formik
//                     initialValues={initialValues}
//                     validationSchema={validationSchema}
//                     onSubmit={onSubmit}
//                 >

//                     <Form >
//                         <FormControl>
//                             <Grid container spacing={2}>
//                                 <Grid item xs={6} md={6}>
//                                     <h6><label htmlFor="name">Name <span className="text-danger">*</span></label></h6>
//                                     <label htmlFor="salutation">Salutation  </label>
//                                     <Field name="salutation" as="select" class="form-input">
//                                         <option value="">--Select--</option>
//                                         <option value="Mr.">Mr.</option>
//                                         <option value="Ms.">Ms.</option>
//                                         <option value="Mrs.">Mrs.</option>
//                                         <option value="Dr.">Dr.</option>
//                                         <option value="Prof.">Prof.</option>
//                                     </Field>
//                                     <label htmlFor="firstName" >First Name</label>
//                                     <Field name='firstName' type="text" class="form-input" />
//                                     <label htmlFor="lastName" >Last Name<span className="text-danger">*</span> </label>
//                                     <Field name='lastName' type="text" class="form-input" />
//                                     <div style={{ color: 'red' }}>
//                                         <ErrorMessage name="lastName" />
//                                     </div>
//                                 </Grid>
//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="company">Company</label>
//                                     <Field name="company" type="text" class="form-input" />
//                                     <div style={{ color: 'red' }}>
//                                         <ErrorMessage name="company" />
//                                     </div>
//                                 </Grid>
//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="phone">Phone</label>
//                                     <Field name="phone" type="phone" class="form-input" />
//                                 </Grid>
//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="email">Email <span className="text-danger">*</span></label>
//                                     <Field name="email" type="text" class="form-input" />
//                                     <div style={{ color: 'red' }}>
//                                         <ErrorMessage name="email" />
//                                     </div>
//                                 </Grid>
//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="leadSource"> lead Source</label>
//                                     <Field name="leadSource" as="select" class="form-select">
//                                         <option value="">--Select--</option>
//                                         <option value="web">Web</option>
//                                         <option value="phone Inquiry">phone Inquiry</option>
//                                         <option value="Partner Referral">Partner Referral</option>
//                                         <option value="Purchased List">Purchased List</option>
//                                         <option value="other">Other</option>
//                                     </Field>
//                                 </Grid>
//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="industry">Industry</label>
//                                     <Field name="industry" as="select" class="form-select">
//                                         <option value="">--Select--</option>
//                                         <option value="Agriculture" >Agriculture</option>
//                                         <option value="Banking" >Banking</option>
//                                         <option value="Communications" >Communications</option>
//                                         <option value="Construction" >Construction</option>
//                                         <option value="Consulting" >Consulting</option>
//                                         <option value="Education" >Education</option>
//                                         <option value="Engineering" >Engineering</option>
//                                         <option value="Government" >Government</option>
//                                         <option value="Manufacturing" >Manufacturing</option>
//                                         <option value="Hospitality" >Hospitality</option>
//                                         <option value="Insurance" >Insurance</option>
//                                         <option value="Technology" >Technology</option>
//                                         <option value="Transportation" >Transportation</option>
//                                         <option value="Other" >Other</option>
//                                     </Field>
//                                 </Grid>
//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="leadStatus"> Lead Status <span className="text-danger">*</span> </label>
//                                     <Field name="leadStatus" as="select" class="form-select">
//                                         <option value="">--Select--</option>
//                                         <option value="open-not contacted">Open-Not Contacted</option>
//                                         <option value="working-contacted">Working-Contacted</option>
//                                         <option value="closed-converted">Closed-Converted</option>
//                                         <option value="closed-not converted">closed-Not Converted</option>
//                                     </Field>
//                                 </Grid>
//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="fax">Fax</label>
//                                     <Field name="fax" type="text" class="form-input" />
//                                 </Grid>
//                                 <Grid item xs={12} md={12}>
//                                     <label htmlFor="description">Description</label>
//                                     <Field as="textarea" name="description" class="form-input" />
//                                 </Grid>
//                                 <Grid item xs={12} md={12}>
//                                     <Button type='success' variant="contained" color="secondary">Submit</Button>
//                                     <Button type="reset" variant="contained" >Clear</Button>
//                                 </Grid>
//                             </Grid>
//                         </FormControl>
//                     </Form>
//                 </Formik>
//             </div>
//         </div>
//     );
//   }
// export default LeadForm
