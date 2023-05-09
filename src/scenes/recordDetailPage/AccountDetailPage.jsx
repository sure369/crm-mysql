import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, DialogActions, Box, TextField, Autocomplete, MenuItem, Select } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import "./Form.css";
import { IndustryPickList, AccRatingPickList, AccTypePickList, AccCitiesPickList, AccCountryPickList } from '../../data/pickLists'
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import ToastNotification from '../toast/ToastNotification';
import { AccountInitialValues, AccountSavedValues } from '../formik/InitialValues/formValues';
import { getPermissions } from '../Auth/getPermission';
import { RequestServer } from "../api/HttpReq"
import {apiCheckPermission} from '../Auth/apiCheckPermission'
import { getLoginUserRoleDept } from '../Auth/userRoleDept';


const AccountDetailPage = ({ item }) => {

    const OBJECT_API = "Account"
    const url = `/UpsertAccount`;
    const fetchInventoriesbyName = `/InventoryName?searchKey=`;
    const getCountryPicklists = `/getpicklistcountry`;
    const getCityPicklists = `/getpickliststate?country=`;

    const [singleAccount, setsingleAccount] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    const [inventoriesRecord, setInventoriesRecord] = useState([]);
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [countryPicklist, setCountriesPicklist] = useState([])
    const [cityPicklist, setCitiesPicklist] = useState([])
    const [permissionValues, setPermissionValues] = useState({})

    const userRoleDpt= getLoginUserRoleDept(OBJECT_API)
    console.log(userRoleDpt,"userRoleDpt")

 
    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setsingleAccount(location.state.record.item);
        console.log('true', !location.state.record.item);
        setshowNew(!location.state.record.item)
        FetchInventoriesbyName('');
        getCountriesPicklist();
        if(userRoleDpt){
            apiCheckPermission(userRoleDpt)
            .then(res=>{
                console.log(res,"apiCheckPermission promise res")
                setPermissionValues(res)
            })
            .catch(err=>{
                console.log(err,"res apiCheckPermission error")
                setPermissionValues({})
            })
        }
        // const getPermission = getPermissions("Account")
        // console.log(getPermission, "getPermission")
        // setPermissionValues(getPermission)

        if (location.state.record.item) {
            console.log('inside')
            getCitiesPicklist(location.state.record.item.billingCountry)
        }
    }, [])


    const initialValues = AccountInitialValues
    const savedValues = AccountSavedValues(singleAccount)

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
        annualRevenue: Yup
            .string()
            .matches(/^[0-9]+$/, "Must be only digits")
    })




    const getCountriesPicklist = () => {

        RequestServer(getCountryPicklists)
            .then(res => {
                if (res.success) {
                    setCountriesPicklist(res.data)
                } else {
                    console.log("getCountry status error", res.error.message)
                }
            })
            .catch(error => {
                console.log('get country error', error)
            })
    }

    const getCitiesPicklist = (country) => {
        console.log('selected country', country)
        RequestServer(`${getCityPicklists}${country}&table=Account`)
            .then(res => {
                if (res.success) {
                    setCitiesPicklist(res.data)
                } else {
                    console.log("getCities status error", res.error.message)
                }
            })
            .catch((error) => {
                console.log('get city error', error)
            })
    }

    const formSubmission = (values) => {

        console.log('form submission value', values);


        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()

        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.createdBy = (sessionStorage.getItem("loggedInUser"));
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
            if (values.InventoryId === '') {
                delete values.InventoryId;
            }
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec;
            values.createdBy = singleAccount.createdBy;
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
            if (values.InventoryId === '') {
                delete values.InventoryId;
            }
        }

        console.log('after change form submission value', values);

        RequestServer(url, values)
            .then(res => {
                console.log(res, "detailPage res")
                if (res.success) {
                    console.log("res success", res)
                    setNotify({
                        isOpen: true,
                        message: res.data,
                        type: 'success'
                    })
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000)
                }
                else {
                    console.log("res else success", res)
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: 'error'
                    })
                    setTimeout(() => {
                        navigate(-1);
                    }, 1000)
                }
            })
            .catch(err => {
                console.log("detailPage err", err)
                setNotify({
                    isOpen: true,
                    message: err.message,
                    type: 'error'
                })
                setTimeout(() => {
                    navigate(-1);
                }, 1000)
            })
    }

    const FetchInventoriesbyName = (newInputValue) => {

        RequestServer(fetchInventoriesbyName + newInputValue)
            .then((res) => {
                if (res.success) {
                    setInventoriesRecord(res.data)
                } else {
                    console.log("status error", res.error.message)
                }
            })
            .catch((error) => {
                console.log("error fetchInventoriesbyName", error)
            })
    }
    const handleFormClose = () => {
        navigate(-1)
    }

    return (

        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h2>New Account</h2> : <h2>Account Detail Page </h2>
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
                        const { values, dirty, isSubmitting, handleChange, handleSubmit, handleReset, setFieldValue, errors, touched, } = props;

                        return (
                            <>
                                <ToastNotification notify={notify} setNotify={setNotify} />

                                <Form className="my-form">
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="accountName">Account Name  <span className="text-danger">*</span></label>
                                            <Field name="accountName" type="text" class="form-input"
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="accountName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="accountNumber">Account Number </label>
                                            <Field name="accountNumber" type="number" class="form-input"
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit} />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="InventoryId">Inventory Name </label>
                                            <Autocomplete
                                                name="InventoryId"
                                                options={inventoriesRecord}
                                                value={values.inventoryDetails}
                                                getOptionLabel={option => option.propertyName || ''}

                                                onChange={(e, value) => {

                                                    if (!value) {
                                                        console.log('!value', value);
                                                        setFieldValue("InventoryId", '')
                                                        setFieldValue("inventoryDetails", '')
                                                        setFieldValue("InventoryName", "")
                                                        setFieldValue("InventoryId", "")
                                                    } else {
                                                        console.log('value', value);
                                                        setFieldValue("InventoryId", value.id)
                                                        setFieldValue("inventoryDetails", value)
                                                        setFieldValue("InventoryName", value.propertyName)
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
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="InventoryId"

                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="annualRevenue">Annual Revenue</label>
                                            <Field class="form-input" type="text" name="annualRevenue"
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit} />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="annualRevenue" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="phone">Phone</label>
                                            <Field name="phone" type="phone" class="form-input"
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit} />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="phone" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="rating"> Rating<span className="text-danger">*</span></label>
                                            <Field name="rating" component={CustomizedSelectForFormik}
                                                className="form-customSelect"
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    AccRatingPickList.map((i) => {
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
                                            <Field name="type" component={CustomizedSelectForFormik}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    AccTypePickList.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="industry">Industry</label>
                                            <Field name="industry" component={CustomizedSelectForFormik}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    IndustryPickList.map((i) => {
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
                                                }}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    countryPicklist.map((i) => {
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
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    cityPicklist.map((i) => {
                                                        return <MenuItem value={i.City}>{i.City}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="billingAddress">Billing Address </label>
                                            <Field
                                                name="billingAddress"
                                                as="textarea"
                                                class="form-input-textarea"
                                                style={{ width: "100%" }}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            />
                                        </Grid>
                                        {!showNew && (
                                            <>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="createdDate" >Created By</label>
                                                    <Field name='createdDate' type="text" class="form-input"
                                                        value={values.createdBy.userFullName + " ," + values.createdDate}
                                                        disabled />
                                                </Grid>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="modifiedDate" >Modified By</label>
                                                    <Field name='modifiedDate' type="text" class="form-input"
                                                        value={values.modifiedBy.userFullName + " ," + values.modifiedDate}
                                                        disabled />
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                    <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>
                                            {
                                                showNew ?
                                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty} >Save</Button>
                                                    :
                                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty}>Update</Button>
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

