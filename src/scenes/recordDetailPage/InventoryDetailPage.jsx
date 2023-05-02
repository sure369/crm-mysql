import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, DialogActions,MenuItem } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import './Form.css'
import axios from 'axios';
import ToastNotification from '../toast/ToastNotification';
import { InvCitiesPickList,InvCountryPickList, InvStatusPicklist, InvTypePicklist } from '../../data/pickLists';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { InventoryInitialValues, InventorySavedValues } from '../formik/InitialValues/formValues';

const url = `${process.env.REACT_APP_SERVER_URL}/UpsertInventory`;
const getCountryPicklists= `${process.env.REACT_APP_SERVER_URL}/getpicklistcountry`;
const getCityPicklists = `${process.env.REACT_APP_SERVER_URL}/getpickliststate?country=`;


const InventoryDetailPage = ({ item }) => {

    const [singleInventory, setsingleInventory] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    // notification
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    const[countryPicklist,setCountriesPicklist]=useState([])
    const[cityPicklist,setCitiesPicklist]=useState([])

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setsingleInventory(location.state.record.item);
        setshowNew(!location.state.record.item)
        getCountriesPicklist();
        if(location.state.record.item){
            console.log('inside')
            getCitiesPicklist(location.state.record.item.country)
        }
    }, [])

    const initialValues = InventoryInitialValues
    const savedValues=InventorySavedValues(singleInventory)

    // const initialValues = {
    //     projectName: '',
    //     propertyName: '',
    //     propertyUnitNumber: '',
    //     type: '',
    //     tower: '',
    //     country: '',
    //     city: '',
    //     floor: '',
    //     status: '',
    //     totalArea: '',
    //     createdbyId: '',        
    //     createdBy: "",
    //     modifiedBy: "",
    //     createdDate: '',
    //     modifiedDate: '',
    // }

    // const savedValues = {
        // projectName: singleInventory?.projectName ?? "",
        // propertyName: singleInventory?.propertyName ?? "",
        // propertyUnitNumber: singleInventory?.propertyUnitNumber ?? "",
        // type: singleInventory?.type ?? "",
        // tower: singleInventory?.tower ?? "",
        // country: singleInventory?.country ?? "",
        // city: singleInventory?.city ?? "",
        // floor: singleInventory?.floor ?? "",
        // status: singleInventory?.status ?? "",
        // totalArea: singleInventory?.totalArea ?? "",
        // createdbyId: singleInventory?.createdbyId ?? "",
        // createdDate: new Date(singleInventory?.createdDate).toLocaleString(),
        // modifiedDate: new Date(singleInventory?.modifiedDate).toLocaleString(),
        // _id: singleInventory?._id ?? "",
        // createdBy: (() => {
        //     try {
        //       return JSON.parse(singleInventory?.createdBy);
        //     } catch {
        //       return "";
        //     }
        //   })(),
        // modifiedBy: (() => {
        //     try {
        //       return JSON.parse(singleInventory?.modifiedBy);
        //     } catch {
        //       return "";
        //     }
        //   })(),
    // }



    const getCountriesPicklist=()=>{
        axios.post(getCountryPicklists)
        .then((res)=>{
            console.log('get country res',res.data)
            setCountriesPicklist(res.data)
        })
        .catch((error)=>{
            console.log('get country error',error)
        })
    }

    const getCitiesPicklist=(country)=>{
        console.log('selected country',country)
        axios.post(`${getCityPicklists}${country}&table=Account`)
        .then((res)=>{
            console.log('get city res',res.data)
            setCitiesPicklist(res.data)
        })    
        .catch((error)=>{
            console.log('get city error',error)
        })
    }

    const validationSchema = Yup.object({
        projectName: Yup
            .string()
            .required('Required'),
        propertyName: Yup
            .string()
            .required('Required'),
        type: Yup
            .string()
            .required('Required'),
        status: Yup
            .string()
            .required('Required'),
    })

    const formSubmission = (values) => {

        console.log('form submission value', values);

        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()

        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.createdBy = (sessionStorage.getItem("loggedInUser"));
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec;
            values.createdBy = singleInventory.createdBy;
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
        }

        console.log('after change form submission value', values);

        axios.post(url, values)
            .then((res) => {
                console.log('upsert record  response', res);
                setNotify({
                    isOpen: true,
                    message: res.data,
                    type: 'success'
                })
                setTimeout(() => {
                    navigate(-1);
                }, 2000)
            })
            .catch((error) => {
                console.log('upsert record  error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
            })
    }

    const handleFormClose = () => {
        navigate(-1)
    }

    return (
        <>
      
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h3>New Inventory</h3> : <h3>Inventory Detail Page </h3>
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
                        } = props;

                        return (
                            <>
                                <ToastNotification notify={notify} setNotify={setNotify} />
                                <Form className='my-form'>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="projectName">Project Name <span className="text-danger">*</span> </label>
                                            <Field name="projectName" type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="projectName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="propertyName">Property Name <span className="text-danger">*</span> </label>
                                            <Field name="propertyName" type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="propertyName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="propertyUnitNumber">Property Unit Number</label>
                                            <Field name="propertyUnitNumber" type="text" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="type">Type <span className="text-danger">*</span> </label>
                                            <Field name="type" component={CustomizedSelectForFormik}>
                                            <MenuItem value=""><em>None</em></MenuItem>
                                             {
                                                InvTypePicklist.map((i)=>{
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>	
                                                })
                                               }
                                            </Field>
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="type" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="status">Status <span className="text-danger">*</span> </label>
                                            <Field name="status" component={CustomizedSelectForFormik}>
                                            <MenuItem value=""><em>None</em></MenuItem>
                                               {
                                                InvStatusPicklist.map((i)=>{
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>	
                                                })
                                               }
                                            </Field>
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="status" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="tower">Tower </label>
                                            <Field name="tower" type="text" class="form-input" />
                                        </Grid>
                                         <Grid item xs={6} md={6}>
                                            <label htmlFor="country">Country</label>
                                            <Field
                                                className="form-input"
                                                id="country"
                                                name="country"
                                                component={CustomizedSelectForFormik}
                                                value={values.country}
                                                onChange={ (event) => {
                                                   setFieldValue('country',event.target.value)
                                                   setFieldValue('city','')
                                                   getCitiesPicklist(event.target.value)
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
                                            <label htmlFor="city">City</label>
                                            <Field
                                                className="form-input"
                                                value={values.city}
                                                id="city"
                                                name="city"
                                                component={CustomizedSelectForFormik}
                                                onChange={handleChange}
                                            >
                                                 <MenuItem value=""><em>None</em></MenuItem>
                                                 {
                                                    cityPicklist.map((r) => (
                                                      
                                                         <MenuItem  value={r.City}>{r.City}</MenuItem>
                                                    )
                                                        
                                                    )}
                                            </Field>
                                        </Grid> 

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="floor">Floor</label>
                                            <Field name="floor" type="text" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="totalArea">Total Area</label>
                                            <Field name="totalArea" type="text" class="form-input" />
                                        </Grid>
                                        {!showNew && (
                                            <>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="createdDate" >Created Date</label>
                                                    <Field name='createdDate' type="text" class="form-input"
                                                    value={values.createdBy.userFullName +" , "+values.createdDate} disabled />
                                                </Grid>

                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="modifiedDate" >Modified Date</label>
                                                    <Field name='modifiedDate' type="text" class="form-input"
                                                    value={values.modifiedBy.userFullName +" , "+values.modifiedDate}
                                                    disabled />
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                    <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>
                                            {
                                                showNew ?
                                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty}>Save</Button>
                                                    :
                                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty}>Update</Button>
                                            }
                                            <Button type="reset" variant="contained" onClick={handleFormClose}   >Cancel</Button>
                                        </DialogActions>
                                    </div>
                                </Form>
                            </>
                        )
                    }}
                </Formik>
            </div>
        </Grid>
        </>
    )
}
export default InventoryDetailPage;