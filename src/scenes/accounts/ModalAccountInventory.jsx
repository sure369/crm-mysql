import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, Forminput, DialogActions, MenuItem } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import ToastNotification from '../toast/ToastNotification';
import {IndustryPickList, AccRatingPickList,AccTypePickList,AccCitiesPickList, AccCountryPickList} from '../../data/pickLists'
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { RequestServer } from '../api/HttpReq';
import "../recordDetailPage/Form.css"
import { AccountInitialValues } from '../formik/InitialValues/formValues';

const url = `/UpsertAccount`;
const getCountryPicklists= `/getpicklistcountry`;
const getCityPicklists = `/getpickliststate?country=`;


const ModalInventoryAccount = ({ item,handleModal }) => {

    const [inventoryParentRecord, setInventoryParentRecord] = useState();
    const location = useLocation();
    const navigate = useNavigate();
  // notification
    const[notify,setNotify]=useState({isOpen:false,message:'',type:''})
    //const city
    const[countryPicklist,setCountriesPicklist]=useState([])
    const[cityPicklist,setCitiesPicklist]=useState([])

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setInventoryParentRecord(location.state.record.item);      
        getCountriesPicklist()
    }, [])

    const initialValues=AccountInitialValues;
   
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const validationSchema = Yup.object({
        accountName: Yup
            .string()
            .required('Required')
            // .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
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
            values.InventoryName=inventoryParentRecord.propertyName;
            values.createdBy = (sessionStorage.getItem("loggedInUser"));
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
       

        console.log('after change form submission value',values);
        
        RequestServer(url, values)
        .then((res) => {
            console.log('upsert record  response', res);
            if(res.success){
                setNotify({
                    isOpen:true,
                    message:res.data,
                    type:'success',          
                  })
            }else{
                setNotify({
                    isOpen:true,
                    message:res.error.message,
                    type:'error',
                  })
            }
        })
        .catch((error) => {
            console.log('upsert record  error', error);
            setNotify({
                isOpen:true,
                message:error.message,
                type:'error'
              })
        })
        .finally(()=>{           
            setTimeout(() => {
                handleModal();
            }, 2000)
        })
    }

    const getCountriesPicklist=()=>{
        RequestServer(getCountryPicklists)
        .then((res)=>{
            console.log(res,"getCountryPicklists res")
            if(res.success){
                setCountriesPicklist(res.data)
            }else{
                setCountriesPicklist()
            }
        })
        .catch((error)=>{
            console.log('get country error',error)
        })
    }
    const getCitiesPicklist=(country)=>{
        console.log('selected country',country)
        RequestServer(`${getCityPicklists}${country}&table=Account`)
        .then((res)=>{
            console.log(res,"getCityPicklists res")
            if(res.success){
                setCitiesPicklist(res.data)
            }else{
                setCitiesPicklist()
            }
        })
        .catch((error)=>{
            console.log('get city error',error)
        })
    }
    return (

        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h2>New Account</h2> 
            </div>
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => { formSubmission(values) }}
                >
                    {(props) => {
                        const {values,dirty, isSubmitting, handleChange,handleSubmit,handleReset,setFieldValue,errors,touched,} = props;

                        return (
                            <>                                
                                <ToastNotification notify={notify} setNotify={setNotify}/>

                                <Form className='my-form'>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="accountName">Account Name  <span className="text-danger">*</span></label>
                                            <Field name="accountName" type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="accountName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="accountNumber">Account Number <span className="text-danger">*</span></label>
                                            <Field name="accountNumber" type="number" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="annualRevenue">Annual Revenue <span className="text-danger">*</span></label>
                                            <Field class="form-input" type="text" name="annualRevenue" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="annualRevenue" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="phone">Phone<span className="text-danger">*</span></label>
                                            <Field name="phone" type="phone" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="phone" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="rating"> Rating<span className="text-danger">*</span></label>
                                            <Field name="rating" component={CustomizedSelectForFormik}  className="form-customSelect">	
                                            <MenuItem value=""><em>None</em></MenuItem>
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
                                            <MenuItem value=""><em>None</em></MenuItem>                                             
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
                                            <MenuItem value=""><em>None</em></MenuItem>    
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
                                                 
                                                    setFieldValue("billingCountry", value);
                                                    setFieldValue("billingCity", "");
                                                    getCitiesPicklist(value)
                                                    // setFieldValue("billingCities", _billingCities);
                                                }}
                                            >
                                               <MenuItem value=""><em>None</em></MenuItem>                                             
                                              {
                                                countryPicklist.map((i)=>{
                                                    return <MenuItem value={i.Country}>{i.Country}</MenuItem>
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
                                                onChange={handleChange}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>                                        
                                                {
                                                    cityPicklist.map((r) => (                                                      
                                                         <MenuItem key={r.City} value={r.City}>{r.City}</MenuItem>
                                                    )
                                                        
                                                    )}
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="billingAddress">Billing Address </label>
                                            <Field name="billingAddress" as="textarea" class="form-input-textarea"  style={{width:"100%"}}/>
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
