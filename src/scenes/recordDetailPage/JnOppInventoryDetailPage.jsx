import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, Forminput, DialogActions, TextField, Autocomplete } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
import "../formik/FormStyles.css"
import Notification from '../toast/Notification';

const url = `${process.env.REACT_APP_SERVER_URL}/UpsertJnOppInventory`;
const fetchInventoriesbyName = `${process.env.REACT_APP_SERVER_URL}/InventoryName`;
const fetchOpportunitybyName = `${process.env.REACT_APP_SERVER_URL}/opportunitiesbyName`;


const JnOppInventoryDetailPage = ({ item }) => {

    const [oppInventory, setOppInventory] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState(true)
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();
    const [opportunityRecords, setOpportunityRecords] = useState([]);
    const [inventoriesRecord, setInventoriesRecord] = useState([]);
     // notification
     const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    useEffect(() => {
         console.log('passed record', location.state.record.item);
     
         setOppInventory(location.state.record.item);
        setshowNew(!location.state.record.item)
        console.log('inside use effect');
        FetchInventoriesbyName('');
        FetchOpportunitybyName('');
    }, [])

    const initialValues = {
        OpportunityId: '',
        InventoryId: '',
        createdbyId: '',
        createdDate: '',
        modifiedDate: '',
    }

    const savedValues = {
        OpportunityId: oppInventory?.OpportunityId ?? "",
        InventoryId: oppInventory?.InventoryId ?? "",
        createdbyId: oppInventory?.createdbyId ?? "",
        createdDate: new Date(oppInventory?.createdDate).toLocaleString(),
        modifiedDate: new Date(oppInventory?.modifiedDate).toLocaleString(),
        _id: oppInventory?._id ?? "",
    }
    const validationSchema = Yup.object({
        OpportunityId: Yup
            .string()
            .required('Required'),
        InventoryId: Yup
            .string()
            .required('Required')

    })

    const formSubmission = (values) => {
        console.log('form submission value', values);

        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()

        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec;
        }
        console.log('after change form submission value', values);

        axios.post(url, values)
            .then((res) => {
                console.log('junction obj res', res);
                setNotify({
                    isOpen: true,
                    message: res.data,
                    type: 'success'
                })
                setTimeout(() => {
                    navigate(-1)
                }, 2000);
            })
            .catch((error) => {
                console.log('error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
            })
    }

    const FetchOpportunitybyName = (newInputValue) => {
        console.log('inside fetchOpportunitybyName fn');
        axios.post(`${fetchOpportunitybyName}?searchKey=${newInputValue}`)
            .then((res) => {
                console.log('res fetchOpportunitybyName', res.data)
                if (typeof (res.data) === "object") {
                    setOpportunityRecords(res.data)
                }
            })
            .catch((error) => {
                console.log('error fetchOpportunitybyName', error);
            })
    }

    const FetchInventoriesbyName = (newInputValue) => {
        axios.post(`${fetchInventoriesbyName}?searchKey=${newInputValue}`)
            .then((res) => {
                console.log('res fetch Inventoriesby Name', res.data)
                if (typeof (res.data) === "object") {
                    setInventoriesRecord(res.data)
                }
            })
            .catch((error) => {
                console.log('error fetchInventoriesbyName', error);
            })
    }

    const handleFormClose = () => {
        navigate(-1)
    }

    return (

        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h3>New Junction Opp-Inventory</h3> : <h3>Junction Opp-Inventory Detail Page </h3>
                }
            </div>
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={showNew ? initialValues : savedValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => { formSubmission(values) }}
                >
                    {(props) => {
                        const {
                            values,
                            isSubmitting,
                            setFieldValue,
                        } = props;

                        return (
                            <>
                                   <Notification notify={notify} setNotify={setNotify} />

                                <Form>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="InventoryId">Inventory Name<span className="text-danger">*</span></label>
                                            <Autocomplete
                                                name="InventoryId"
                                                options={inventoriesRecord}
                                                value={values.Propertydetails}

                                                getOptionLabel={option => option.propertyName || ''}
                                                //  isOptionEqualToValue = {(option,value)=>
                                                //           option.propertyName === value
                                                //   }


                                                onChange={(e, value) => {
                                                    setFieldValue("InventoryId", value.id || '')
                                                    setFieldValue("propertyName", value || '')
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    console.log('newInputValue', newInputValue);
                                                    if (newInputValue.length >= 3) {
                                                        FetchInventoriesbyName(newInputValue);
                                                    }
                                                }}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="InventoryId" />
                                                )}
                                            />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="InventoryId" />
                                            </div>

                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="OpportunityId">Opportunity Name  <span className="text-danger">*</span></label>
                                            <Autocomplete
                                                name="OpportunityId"
                                                options={opportunityRecords}
                                                value={values.OpportunityId}
                                                getOptionLabel={option => option.opportunityName || ''}

                                                onChange={(e, value) => {
                                                    setFieldValue("OpportunityId", value.id)
                                                    setFieldValue("Opportunity", value)
                                                }}

                                                onInputChange={(event, newInputValue) => {
                                                    console.log('newInputValue', newInputValue);
                                                    if (newInputValue.length >= 3) {
                                                        FetchOpportunitybyName(newInputValue);
                                                    }
                                                }}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="LeadId" />
                                                )}
                                            />

                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="InventoryId" />
                                            </div>
                                        </Grid>

                                        {!showNew && (
                                            <>

                                                <Grid item xs={6} md={6}>
                                                    {/* value is aagined to  the fields */}
                                                    <label htmlFor="createdDate" >created Date</label>
                                                    <Field name='createdDate' type="text" class="form-input" disabled />
                                                </Grid>

                                                <Grid item xs={6} md={6}>
                                                    {/* value is aagined to  the fields */}
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
                                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>
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
export default JnOppInventoryDetailPage;




