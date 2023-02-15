import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid,Button ,FormControl,Stack ,Alert} from "@mui/material";
import axios from 'axios'
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormStyles.css"

const url =`${process.env.REACT_APP_SERVER_URL}/accountInsert`;

const initialValues = {
    accountName: '',
    accountNumber: '',
    annualRevenue: '',
    rating: '',
    type: '',
    phone: '',
    industry: '',
    billingAddress: '',
    billingCountry:'',
    billingCity:'',
    billingCities:[],
    shippingAddress: '',
    description: '',
    createdbyId: '',
    createdDate: '',
}



const citiesList = {
    UAE: [
      { value: "Dubai", label: "Dubai" },
      { value: "Abu Dhabi", label: "Abu Dhabi" },
      { value: "Sharjah", label: "Sharjah" },
      { value: "Ajman", label: "Ajman" },
    ],
    "Saudi Arabia": [
      { value: "Mecca", label: "Mecca" },
      { value: "Jeddah", label: "Jeddah" },
    ],
    India: [
      { value: "Chennai", label: "Chennai" },
      { value: "Bangalore", label: "Bangalore" },
      { value: "Coimabatore", label: "Coimabatore" },
    ],
  };

  const getCities = (billingCountry) => {
    return new Promise((resolve, reject) => {
      console.log("billingCountry", billingCountry);
      resolve(citiesList[billingCountry]||[]);
    });
  };

const validationSchema = Yup.object({
    accountName: Yup
        .string()
        .required('Required'),
    rating: Yup
        .string()
        .required('Required'),
})

const onSubmit = (values, { resetForm }) => {
    console.log(values);
    resetForm({ values: '' })
}



const AccountForm = () => {


    const navigate =useNavigate();



    return (
        <div className="container mb-10">
            <div className="col-lg-12 text-center mb-3">
                <h3>New Account</h3>
            </div>

            <div class="container overflow-hidden ">

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values,{resetForm }) => {
                        await new Promise((resolve) => setTimeout(resolve, 500));
                        console.log("values", values);

                        axios.post(url,values)
                        .then((res)=>{
                            
                            console.log('post response',res.data);
                            // setAlertNotes({
                            //     isShow:true,
                            //     message:res.data,
                            //     severity:'success',
                            //     mode:toastCloseCallback()
                            // })
                           

                            setTimeout(() => {
                                navigate(-1);
                            }, 2000);
                          
                           
                            resetForm({ values: '' })
                        })
                        .catch((error)=> {
                            console.log('error',error);
                     
                            // setAlertNotes({
                            //     isShow:true,
                            //     message:error.message,
                            //     severity:'error',
                            //     mode:toastCloseCallback()
                            // })
                         
                          })
                      }}
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

       
                <Form>
                            <Grid container spacing={2}>
                                 <Grid item xs={6} md={6}>
                                    <label htmlFor="accountName">Name  <span className="text-danger">*</span></label>
                                    <Field name="accountName" type="text" class="form-input" />
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="accountName" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="accountNumber">Account Number </label>
                                    <Field name="accountNumber" type="text" class="form-input" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="annualRevenue">Aannual Revenue</label>
                                   
                                    <Field name="annualRevenue" type="number" class="form-input"/>
                                 </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="phone">Phone</label>
                                    <Field name="phone" type="phone" class="form-input" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="date">date</label>
                                    <Field name="date" type="date" class="form-input" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="rating"> Rating
                                        <span className="text-danger">*</span>
                                    </label>
                                    <Field name="rating" as="select" class="form-input">
                                        
                                    </Field>
                                    <div style={{ color: 'red' }} >
                                        <ErrorMessage name="rating" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="type">Type</label>
                                    <Field name="type" as="select" class="form-input">
                                        <option value="">--Select--</option>
                                        <option value="Prospect">Prospect</option>
                                        <option value="Customer - Direct">Customer - Direct</option>
                                        <option value="Customer - Channel">Customer - Channel</option>
                                        <option value="Channel Partner / Reseller">Channel Partner / Reseller</option>
                                        <option value="Installation Partner"> Installation Partner</option>
                                        <option value="Technology Partner">Technology Partner</option>
                                        <option value="Other" >Other</option>
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
                                    <label htmlFor="noofEmployees">Number of Employees</label>
                                    <Field name="noofEmployees" type="text" class="form-input" />
                                </Grid>
                               
                             
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="billingAddress">Billing Address </label>
                                    <Field name="billingAddress" type="text" class="form-input" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="shippingAddress">Shipping Address </label>
                                    <Field name="shippingAddress" type="text" class="form-input" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                <label htmlFor="billingCountry">Billing Country</label>
                                    <Field
                                        className="form-input"
                                        id="billingCountry"
                                        name="billingCountry"
                                        as="select"
                                        value={values.billingCountry}
                                        onChange={async (event) => {
                                        const value = event.target.value;
                                        const _billingCities = await getCities(value);
                                        console.log(_billingCities);
                                        setFieldValue("billingCountry", value);
                                        setFieldValue("billingCity", "");
                                        setFieldValue("billingCities", _billingCities);
                                        }}
                                    >
                                        <option value="None">--Select--</option>
                                        <option value="UAE">UAE</option>
                                        <option value="Saudi Arabia">Saudi Arabia</option>
                                        <option value="India">India</option>
                                    </Field>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                <label htmlFor="billingCity">Billing City</label>
                                    <Field
                                        className="form-input"
                                        value={values.billingCity}
                                        id="billingCity"
                                        name="billingCity"
                                        as="select"
                                        onChange={handleChange}
                                    >
                                        <option value="None">--Select billingCity--</option>
                                        {values.billingCities &&
                                        values.billingCities.map((r) => (
                                            <option key={r.value} value={r.vlue}>
                                            {r.label}
                                            </option>
                                        ))}
                                    </Field>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="lookup">Lookup</label>
                                    <Field name="lookup" type="text" class="form-input" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="website">Website</label>
                                    <Field name="website" type="text" class="form-input" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="fax">Fax</label>
                                    <Field name="fax" type="text" class="form-input" />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <label htmlFor="comments">Comments</label>
                                    <Field as="textarea" name="comments" class="form-input" />
                                </Grid> 
                                <Grid item xs={12} md={12}>
                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>
                                    <Button type="reset" variant="contained" onClick={handleReset}  disabled={!dirty || isSubmitting} >Cancel</Button>
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

    // return 
    // (
    //     showAlert&&
    //     <Stack sx={{ width: '100%' }} spacing={2}>
    //     <Alert severity="success">{showAlert}</Alert>
    // </Stack>
    // )

  }
export default AccountForm


// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { Grid,Button ,FormControl} from "@mui/material";
// import DependentPicklist from "./dependentPicklist";


// const initialValues = {
//     accountName: '',
//     accountNumber: '',
//     annualRevenue: '',
//     rating: '',
//     type: '',
//     phone: '',
//     industry: '',
//     noofEmployees: '',
//     fax: '',
//     billingAddress: '',
//     billingCounty:'',
//     billingCity:'',
//     billingCities:[],
//     shippingAddress: '',
//     website: '',
//     description: '',
//     accountOwnerId: '',
//     createdbyId: '',
//     createdDate: '',

// }

// const billingCitiesList = {
//     "United States": [
//       { value: "Washington", label: "Washington" },
//       { value: "California", label: "California" },
//     ],
//     Canada: [
//       { value: "Alberta", label: "Alberta" },
//       { value: "NovaScotia", label: "NovaScotia" },
//     ],
//     India: [
//       { value: "Coimabatore", label: "Coimabatore" },
//       { value: "Bangalore", label: "Bangalore" },
//       { value: "Chennai", label: "Chennai" },
//     ],
//   };

//   const getBillingCities = (country) => {
//     return new Promise((resolve, reject) => {
//       console.log("country", country);
//       resolve(billingCitiesList[country]||[]);
//     });
//   };

// const validationSchema = Yup.object({
//     accountName: Yup
//         .string()
//         .required('Required'),
//     rating: Yup
//         .string()
//         .required('Required'),
// })

// const onSubmit = (values, { resetForm }) => {
//     console.log(values);
//     resetForm({ values: '' })
// }

// const AccountForm = () => {
//     return (
//         <div className="container mb-10">
//             <div className="col-lg-12 text-center mb-3">
//                 <h3>New Account</h3>
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

//                             <Grid item xs={6} md={6}>
//                                     <label htmlFor="billingCountry">Billing Country </label>
//                                     <DependentPicklist  name="billingCountry" className="form-input"/>

//                                      {/* <Field name="billingCountry" as="select" class="form-select">
//                                         <option value="">--Select--</option>
//                                         <option value="UAE">UAE</option>
//                                         <option value="Saudi Arabia">Saudi Arabia</option>
//                                         <option value="India">India</option>
//                                     </Field> */}
//                                 </Grid>
//                                 {/* <Grid item xs={6} md={6}>
//                                     <label htmlFor="billingCity">Billing City </label>
//                                     <Field name="billingCity" as="select" class="form-select">
//                                         <option value="">--Select--</option>
//                                         <option value="Dubai">Dubai</option>
//                                         <option value="Abu Dhabi">Abu Dhabi</option>
//                                         <option value="Sharjah">Sharjah</option>
//                                         <option value="Ajman">Ajman</option>
//                                         <option value="Mecca">Mecca</option>
//                                         <option value="Jeddah">Jeddah</option>
//                                         <option value="Chennai">Chennai</option>
//                                         <option value="Bangalore">Bangalore</option>
//                                         <option value="Coimabatore">Coimabatore</option>
//                                     </Field>
//                                 </Grid> */}


//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="accountName">Name  <span className="text-danger">*</span></label>
//                                     <Field name="accountName" type="text" class="form-input" />
//                                     <div style={{ color: 'red' }}>
//                                         <ErrorMessage name="accountName" />
//                                     </div>
//                                 </Grid>

//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="accountNumber">Account Number </label>
//                                     <Field name="accountNumber" type="text" class="form-input" />
//                                 </Grid>
//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="annualRevenue">Aannual Revenue</label>
//                                   
//                                     {/* <Field name="annualRevenue" type="number" class="form-input"/> */}
//                                 </Grid>
//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="phone">Phone</label>
//                                     <Field name="phone" type="phone" class="form-input" />
//                                 </Grid>
//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="rating"> Rating
//                                         <span className="text-danger">*</span>
//                                     </label>
//                                     <Field name="rating" as="select" class="form-select">
//                                         <option value="">--Select--</option>
//                                         <option value="Hot">Hot</option>
//                                         <option value="Warm">Warm</option>
//                                         <option value="Cold">Cold</option>
//                                     </Field>
//                                     <div style={{ color: 'red' }} >
//                                         <ErrorMessage name="rating" />
//                                     </div>
//                                 </Grid>
//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="type">Type</label>
//                                     <Field name="type" as="select" class="form-select">
//                                         <option value="">--Select--</option>
//                                         <option value="Prospect">Prospect</option>
//                                         <option value="Customer - Direct">Customer - Direct</option>
//                                         <option value="Customer - Channel">Customer - Channel</option>
//                                         <option value="Channel Partner / Reseller">Channel Partner / Reseller</option>
//                                         <option value="Installation Partner"> Installation Partner</option>
//                                         <option value="Technology Partner">Technology Partner</option>
//                                         <option value="Other" >Other</option>
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
//                                     <label htmlFor="noofEmployees">Number of Employees</label>
//                                     <Field name="noofEmployees" type="text" class="form-input" />
//                                 </Grid>
                               
                             
//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="billingAddress">Billing Address </label>
//                                     <Field name="billingAddress" type="text" class="form-input" />
//                                 </Grid>
//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="shippingAddress">Shipping Address </label>
//                                     <Field name="shippingAddress" type="text" class="form-input" />
//                                 </Grid>
//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="website">Website</label>
//                                     <Field name="website" type="text" class="form-input" />
//                                 </Grid>
//                                 <Grid item xs={6} md={6}>
//                                     <label htmlFor="fax">Fax</label>
//                                     <Field name="fax" type="text" class="form-input" />
//                                 </Grid>
//                                 <Grid item xs={12} md={12}>
//                                     <label htmlFor="comments">Comments</label>
//                                     <Field as="textarea" name="comments" class="form-input" />
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
// export default AccountForm