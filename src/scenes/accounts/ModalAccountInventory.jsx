import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, Forminput, DialogActions, MenuItem } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
import "../formik/FormStyles.css"
import Notification from '../toast/Notification';
import {IndustryPickList, AccRatingPickList,AccTypePickList,AccCitiesPickList, AccCountryPickList} from '../../data/pickLists'
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';


const url = `${process.env.REACT_APP_SERVER_URL}/UpsertAccount`;


const ModalInventoryAccount = ({ item,handleModal }) => {

    const [inventoryParentRecord, setInventoryParentRecord] = useState();
    const location = useLocation();
    const navigate = useNavigate();
  // notification
    const[notify,setNotify]=useState({isOpen:false,message:'',type:''})
   
    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setInventoryParentRecord(location.state.record.item);      
    }, [])

    const initialValues = {
        accountName: '',
        accountNumber: '',
        InventoryId: '',
        annualRevenue: '',
        rating: '',
        type: '',
        phone: '',
        industry: '',
        billingAddress: '',
        billingCountry: '',
        billingCity: '',
        billingCities: [],
        createdbyId: '',
        createdDate:'',
        modifiedDate: '',
        inventoryDetails:'',
    }


    const getCities = (billingCountry) => {
        return new Promise((resolve, reject) => {
            console.log("billingCountry", billingCountry);
            resolve(AccCitiesPickList[billingCountry] || []);
        });
    };

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const validationSchema = Yup.object({
        accountName: Yup
            .string()
            .required('Required')
            .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
            .max(30, 'lastName must be less than 30 characters'),
        rating: Yup
            .string()
            .required('Required'),
        phone: Yup
            .string()
            .matches(phoneRegExp, 'Phone number is not valid')
            .min(10, "Phone number must be 10 characters, its short")
            .max(10, "Phone number must be 10 characters,its long"),
        annualRevenue:Yup
            .string()
            .matches(/^[0-9]+$/, "Must be only digits")
    })

    const formSubmission = (values) => {
   
        console.log('form submission value',values);


        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()

            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.InventoryId=inventoryParentRecord._id;
            values.inventoryDetails={
                propertyName:inventoryParentRecord.propertyName,
                id:inventoryParentRecord._id
            }
       
        console.log('after change form submission value',values);
        
        axios.post(url, values)
        .then((res) => {
            console.log('upsert record  response', res);
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
            console.log('upsert record  error', error);
            setNotify({
                isOpen:true,
                message:error.message,
                type:'error'
              })
              setTimeout(() => {
                handleModal();
            }, 1000)
        })
    }

    return (

        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>New Account</h3> 
            </div>
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => { formSubmission(values) }}
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
                                            <label htmlFor="accountName">Account Name  <span className="text-danger">*</span></label>
                                            <Field name="accountName" type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="accountName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="accountNumber">Account Number </label>
                                            <Field name="accountNumber" type="number" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="annualRevenue">Aannual Revenue</label>
                                            <Field class="form-input" type="text" name="annualRevenue" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="annualRevenue" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="phone">Phone</label>
                                            <Field name="phone" type="phone" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="phone" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="rating"> Rating<span className="text-danger">*</span></label>
                                            <Field name="rating" component={CustomizedSelectForFormik}  className="form-customSelect">	
                                               {	
                                                AccRatingPickList.map((i)=>{	
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>	
                                                })	
                                               }	
                                            </Field>	
                                            <div style={{ color: 'red' }} >
                                                <ErrorMessage name="rating" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="type">Type</label>
                                            <Field name="type" component={CustomizedSelectForFormik}>
                                              {
                                                AccTypePickList.map((i)=>{
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>	
                                                })
                                              }                                               
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="industry">Industry</label>
                                            <Field name="industry"  component={CustomizedSelectForFormik}>
                                          
                                          {
                                            IndustryPickList.map((i)=>{
                                                return <MenuItem value={i.value}>{i.text}</MenuItem>	
                                            })
                                          }  
                                        </Field>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="billingCountry">Billing Country</label>
                                            <Field
                                                className="form-input"
                                                id="billingCountry"
                                                name="billingCountry"
                                                component={CustomizedSelectForFormik}
                                                value={values.billingCountry}
                                                onChange={async (event) => {
                                                    const value = event.target.value;
                                                    const _billingCities = await getCities(value);
                                                    console.log('billingCities',_billingCities);
                                                    setFieldValue("billingCountry", value);
                                                    setFieldValue("billingCity", "");
                                                    setFieldValue("billingCities", _billingCities);
                                                }}
                                            >
                                               
                                              {
                                                AccCountryPickList.map((i)=>{
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                })
                                              }  
                                            </Field>
                                        </Grid>
                                        
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="billingCity">Billing City</label>
                                            <Field
                                                className="form-input"
                                                value={values.billingCity}
                                                id="billingCity"
                                                name="billingCity"
                                                component={CustomizedSelectForFormik}
                                                // onChange={handleChange}
                                            >
                                               
                                                {values.billingCities &&
                                                    values.billingCities.map((r) => (                                                      
                                                         <MenuItem key={r.value} value={r.value}>{r.text}</MenuItem>
                                                    )
                                                        
                                                    )}
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="billingAddress">Billing Address </label>
                                            <Field name="billingAddress" type="text" class="form-input" />
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
            </div>
        </Grid>
    )
}

export default ModalInventoryAccount;
