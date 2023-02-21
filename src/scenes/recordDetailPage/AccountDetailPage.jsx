import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, DialogActions, Box, TextField, Autocomplete,MenuItem, Select} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
import "../formik/FormStyles.css"
import {IndustryPickList, AccRatingPickList,AccTypePickList,AccCitiesPickList, AccCountryPickList} from '../../data/pickLists'
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import ToastNotification from '../toast/ToastNotification';

const url = `${process.env.REACT_APP_SERVER_URL}/UpsertAccount`;
const fetchInventoriesbyName = `${process.env.REACT_APP_SERVER_URL}/InventoryName`;
const getCountryPicklists= `${process.env.REACT_APP_SERVER_URL}/getpicklistcountry`;
const getCityPicklists = `${process.env.REACT_APP_SERVER_URL}/getpickliststate?country=`;

const AccountDetailPage = ({ item }) => {

    const [singleAccount, setsingleAccount] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    const [inventoriesRecord, setInventoriesRecord] = useState([]);
  // notification
    const[notify,setNotify]=useState({isOpen:false,message:'',type:''})
   
    //const city
    const[countryPicklist,setCountriesPicklist]=useState([])
    const[cityPicklist,setCityPicklist]=useState([])
    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setsingleAccount(location.state.record.item);
        console.log('true', !location.state.record.item);
        setshowNew(!location.state.record.item)
        FetchInventoriesbyName('');
        getPicklistNameForCities();
      
    }, [])

    const initialValues = {
        accountName: '',
        accountNumber: '',        
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
        InventoryId: '',
    }

    const savedValues = {
        accountName: singleAccount?.accountName ?? "",
        accountNumber: singleAccount?.accountNumber ?? "",   
        annualRevenue: singleAccount?.annualRevenue ?? "",
        rating: singleAccount?.rating ?? "",
        type: singleAccount?.type ?? "",
        phone: singleAccount?.phone ?? "",
        industry: singleAccount?.industry ?? "",
        billingAddress: singleAccount?.billingAddress ?? "",
        billingCountry: singleAccount?.billingCountry ?? "",
        billingCity: singleAccount?.billingCity ?? "",
        billingCities: singleAccount?.billingCities ?? "",
        createdbyId: singleAccount?.createdbyId ?? "",
        createdDate:  new Date(singleAccount?.createdDate).toLocaleString(),
        modifiedDate: new Date(singleAccount?.modifiedDate).toLocaleString(),
        _id: singleAccount?._id ?? "",
        inventoryDetails:singleAccount?.InventoryDetails ?? "", 
        InventoryId: singleAccount?.InventoryId ?? "",
        InventoryName: singleAccount?.InventoryName ?? "",
    }

    const getCities = (billingCountry) => {
        return new Promise((resolve, reject) => {
            console.log("billingCountry", billingCountry);
            resolve(AccCitiesPickList[billingCountry] || []);
        });
    };

    console.log('getCities',getCities('India'))
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

    const getPicklistNameForCities=()=>{
        axios.post(getCountryPicklists)
        .then((res)=>{
            console.log('getCountryPicklists response',res)
            console.log('dd',res.data)
            setCountriesPicklist(res.data)

        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const formSubmission = (values) => {
   
        console.log('form submission value',values);


        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()

        if(showNew){
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.InventoryName=values.inventoryDetails.propertyName;
            values.InventoryId =values.inventoryDetails.id;

            if(values.InventoryId===''){
                delete values.InventoryId;
            }
        }
        else if(!showNew){
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec;
            values.InventoryName=values.inventoryDetails.propertyName;
            values.InventoryId =values.inventoryDetails.id;
            
            if(values.InventoryId===''){
                delete values.InventoryId;
            }
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
                 navigate(-1);
            }, 2000)
        })
        .catch((error) => {
            console.log('upsert record  error', error);
            setNotify({
                isOpen:true,
                message:error.message,
                type:'error'
              })
        })

        
    }

    const FetchInventoriesbyName = (newInputValue) => {
        axios.post(`${fetchInventoriesbyName}?searchKey=${newInputValue}`)
            .then((res) => {
                console.log('res fetchInventoriesbyName', res.data)
                if (typeof (res.data) === "object") {
                    setInventoriesRecord(res.data)
                }
            })
            .catch((error) => {
                console.log('error fetchInventoriesbyName', error);
            })
    }

    const handleFormClose =()=>{
        navigate(-1)
    }
    return (

        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h3>New Account</h3> : <h3>Account Detail Page </h3>
                }
            </div>
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={showNew ? initialValues : savedValues}
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
                            errors,
                            touched,
                        } = props;

                        return (
                            <>
                                
                                <ToastNotification notify={notify} setNotify={setNotify}/>

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
                                            <label htmlFor="InventoryId">Inventory Name </label>
                                            <Autocomplete
                                                name="InventoryId"
                                                className='form-customSelect'
                                                options={inventoriesRecord}
                                                value={values.inventoryDetails}
                                                getOptionLabel={option => option.propertyName || ''}
                                                // isOptionEqualToValue={(option, value) =>
                                                //     option.id === value
                                                // }
                                                onChange={(e, value) => {

                                                    if(!value){                                
                                                        console.log('!value',value);
                                                        setFieldValue("InventoryId",'')
                                                        setFieldValue("inventoryDetails",'')
                                                      }else{
                                                        console.log('value',value);
                                                        setFieldValue("InventoryId",value.id)
                                                        setFieldValue("inventoryDetails",value)
                                                      }
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    console.log('newInputValue', newInputValue);
                                                    if (newInputValue.length >= 3) {
                                                        FetchInventoriesbyName(newInputValue);
                                                    }
                                                    else if (newInputValue.length == 0) {
                                                        FetchInventoriesbyName(newInputValue);
                                                    }
                                                }}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="InventoryId" />
                                                )}
                                            />

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
                                                    console.log('onchange',event.target.value)

                                                    // axios.post(getCityPicklists,{city:event.target.value,table:'Account'})
                                                    axios.post(`${getCityPicklists}${event.target.value}&table=Account`)
                                                    .then((res)=>{
                                                        console.log('get cities',res.data)
                                                        setCityPicklist(res.data)
                                                    })
                                                    .catch((error)=>{
                                                        console.log('error',error)
                                                    })
                                                    // const value = event.target.value;
                                                    // const _billingCities = await getCities(value);
                                                    // console.log('billingCities',_billingCities);
                                                    // setFieldValue("billingCountry", value);
                                                    // setFieldValue("billingCity", "");
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
                                               onChange={
                                                axios.post(`${getCityPicklists}${values.billingCountry}&table=Account`)
                                                .then((res)=>{
                                                    console.log('get inside billing city',res.data)
                                                   
                                                })
                                                .catch((error)=>{
                                                    console.log('error',error)
                                                })
                                               }
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                { cityPicklist&&
                                                   cityPicklist.map((r) => (                                                      
                                                         <MenuItem key={r.State} value={r.State}>{r.State}</MenuItem>
                                                    )
                                                        
                                                    )}
                                                {/* {values.billingCities &&
                                                    values.billingCities.map((r) => (                                                      
                                                         <MenuItem key={r.value} value={r.value}>{r.text}</MenuItem>
                                                    )
                                                        
                                                    )} */}
                                            </Field>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="billingAddress">Billing Address </label>
                                            <Field name="billingAddress" type="text" class="form-input" />
                                        </Grid>
                                        
                                        {!showNew && (
                                            <>
                                                <Grid item xs={6} md={6}>                                                  
                                                    <label htmlFor="createdDate" >created Date</label>
                                                    <Field name='createdDate' type="text" class="form-input" disabled />
                                                </Grid>

                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="modifiedDate" >Modified Date</label>
                                                    <Field name='modifiedDate' type="text" class="form-input" disabled />
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>

                                    <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>
                                            {
                                                showNew ?
                                                    <Button type='success' variant="contained" color="secondary" >Save</Button>
                                                :
                                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Update</Button>
                                            }
                                            <Button type="reset" variant="contained" onClick={handleFormClose}  >Cancel</Button>
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
export default AccountDetailPage;

