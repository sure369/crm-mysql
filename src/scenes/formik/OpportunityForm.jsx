import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, FormControl, InputAdornment } from "@mui/material";
import CurrencyInput from 'react-currency-input-field';
import DatePickerField from "./datePick";
import axios from 'axios'
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import "./FormStyles.css"

const url = `${process.env.REACT_APP_SERVER_URL}/opportunityInsert`;

const initialValues = {
    accountName: '',
    opportunityName: '',
    type: '',
    leadSource: '',
    amount: '',
    closeDate: '',
    stage: '',
    description: '',
    createdbyId: '',
    createdDate: '',
}

const validationSchema = Yup.object({
    opportunityName: Yup
        .string()
        .required('Required'),
})

const onSubmit = (values, { resetForm }) => {
    console.log(values);
    resetForm({ values: '' })
}

const OpportunityForm = () => {

    const [startDate, setStartDate] = useState(new Date())
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
                <h3>New Opportunity</h3>
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
                                navigate(-1)
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
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="opportunityName" >Opportunity Name<span className="text-danger">*</span> </label>
                                                <Field name='opportunityName' type="text" class="form-input" />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="opportunityName" />
                                                </div>
                                            </Grid>

                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="accountName">Account Name </label>
                                                <Field name="accountName" type="text" class="form-input" />
                                            </Grid>

                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="stage">Opportunity Stage</label>
                                                <Field name="stage" as="select" class="form-input">
                                                    <option value="">--Select--</option>
                                                    <option value="Prospecting">Prospecting</option>
                                                    <option value="Needs Analysis">Needs Analysis</option>
                                                    <option value="Value Proposition">Value Proposition</option>
                                                    <option value="Perception Analysis">Perception Analysis</option>
                                                    <option value="Proposal Quote">Proposal Quote</option>
                                                    <option value="Negotiation">Negotiation</option>
                                                    <option value="Closed Won">Closed Won</option>
                                                    <option value="Closed Lost">Closed Lost</option>
                                                </Field>
                                            </Grid>

                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="type">Type</label>
                                                <Field name="type" as="select" class="form-input">
                                                    <option value="">--Select--</option>
                                                    <option value="New Customer">New Customer</option>
                                                    <option value="Existing Customer - Upgrade">Existing Customer - Upgrade</option>
                                                    <option value="Existing Customer - Replacement">Existing Customer - Replacement</option>
                                                    <option value="Existing Customer - Downgrade">Existing Customer - Downgrade</option>
                                                </Field>
                                            </Grid>



                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="leadSource"> Lead Source</label>
                                                <Field name="leadSource" as="select" class="form-input">
                                                    <option value="">--Select--</option>
                                                    <option value="web">Web</option>
                                                    <option value="phone Inquiry">phone Inquiry</option>
                                                    <option value="Partner Referral">Partner Referral</option>
                                                    <option value="Purchased List">Purchased List</option>
                                                    <option value="other">Other</option>
                                                </Field>
                                            </Grid>
                                            {/* 
                 <Grid item xs={6} md={6}>
                <label htmlFor="closeDate" >Close Date <span className="text-danger">*</span></label>
               // <Field name="date"  component={DatePickerField} class="form-input"/>  
                <DatePickerField  name="date" className="form-input"/>
                
                // <DatePickerField  name="date" className="form-input"/> 
             </Grid>
              */}



                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="closeDate">Close Date <span className="text-danger">*</span></label>
                                                <Field name="closeDate" type="date" class="form-input" />
                                            </Grid>

                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="amount">Amount</label>
                                                <CurrencyInput class="form-input" intlConfig={{ locale: 'en-US', currency: 'USD' }} />
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
export default OpportunityForm

// import { Box, Button, TextField,Grid } from "@mui/material";
// import { Formik,Form, Field, ErrorMessage } from "formik";
// import * as yup from "yup";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import Header from "../../components/Header";

// const initialValues = {
//     opportunityName: "",
//     accountName: "",
//     type: "",
//     leadSource: "",
//     closeDate: "",
//     stage: "",
//     description:"",
//   };


// const validationSchema = yup.object().shape({
//     opportunityName: yup.string().required("required"),
//     stage: yup.string().required("required"),

// });


// const OpportunityForm = () => {
//   const isNonMobile = useMediaQuery("(min-width:600px)");

//   const handleFormSubmit = (values) => {
//     console.log(values);
//   };

//   return (
//     <Box m="20px">
//       <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleFormSubmit}
//       >
//        <Form>
//        <Grid container spacing={2}>
//                 <Grid item xs={6} md={6}>
//                <label htmlFor="opportunityName" >Opportunity Name<span className="text-danger">*</span> </label>
//                     <Field name='opportunityName' type="text" class="form-input"/>
//                     <div style={{ color: 'red'}}>
//                          <ErrorMessage name="opportunityName" />
//                      </div>
//               </Grid>
//        </Form>
//                  <TextField
//                 fullWidth
//                 type="text"
//                 variant="filled"
//                 label="opportunity Name"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 value={values.opportunityName}
//                 name="opportunityName"
//                 error={!!touched.opportunityName && !!errors.opportunityName}
//                 helperText={touched.opportunityName && errors.opportunityName}
//                 sx={{ gridColumn: "span 2" }}
//               />
//               <TextField
//                 fullWidth
//                 type="text"
//                 variant="filled"
//                 label="Account Name"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 value={values.accountName}
//                 name="accountName"
//                 error={!!touched.accountName && !!errors.accountName}
//                 helperText={touched.accountName && errors.accountName}
//                 sx={{ gridColumn: "span 2" }}
//               />
//               <TextField
//                 fullWidth
//                 variant="filled"
//                 type="text"
//                 label="Last Name"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 value={values.lastName}
//                 name="lastName"
//                 error={!!touched.lastName && !!errors.lastName}
//                 helperText={touched.lastName && errors.lastName}
//                 sx={{ gridColumn: "span 2" }}
//               />
//               <TextField
//                 fullWidth
//                 variant="filled"
//                 type="text"
//                 label="Email"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 value={values.email}
//                 name="email"
//                 error={!!touched.email && !!errors.email}
//                 helperText={touched.email && errors.email}
//                 sx={{ gridColumn: "span 4" }}
//               />
//               <TextField
//                 fullWidth
//                 variant="filled"
//                 type="text"
//                 label="Contact Number"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 value={values.contact}
//                 name="contact"
//                 error={!!touched.contact && !!errors.contact}
//                 helperText={touched.contact && errors.contact}
//                 sx={{ gridColumn: "span 4" }}
//               />
//               <TextField
//                 fullWidth
//                 variant="filled"
//                 type="text"
//                 label="Address 1"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 value={values.address1}
//                 name="address1"
//                 error={!!touched.address1 && !!errors.address1}
//                 helperText={touched.address1 && errors.address1}
//                 sx={{ gridColumn: "span 4" }}
//               />
//               <TextField
//                 fullWidth
//                 variant="filled"
//                 type="text"
//                 label="Address 2"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 value={values.address2}
//                 name="address2"
//                 error={!!touched.address2 && !!errors.address2}
//                 helperText={touched.address2 && errors.address2}
//                 sx={{ gridColumn: "span 4" }}
//               />
//             </Box>
//             <Box display="flex" justifyContent="end" mt="20px">
//               <Button type="submit" color="secondary" variant="contained">
//                 Create New User
//               </Button>
//             </Box>
//           </form>
//         )}
//       </Formik>
//     </Box>
//   );
// };



// export default OpportunityForm;