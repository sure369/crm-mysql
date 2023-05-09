import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, Forminput, DialogActions, TextField, Autocomplete, MenuItem } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import "../formik/FormStyles.css"
import ToastNotification from '../toast/ToastNotification';
import { LeadSourcePickList, OppStagePicklist, OppTypePicklist } from '../../data/pickLists';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './Form.css'
import { OpportunityInitialValues, OpportunitySavedValues } from '../formik/InitialValues/formValues';
import { getPermissions } from '../Auth/getPermission';
import { RequestServer } from '../api/HttpReq';
import {apiCheckPermission} from '../Auth/apiCheckPermission'
import { getLoginUserRoleDept } from '../Auth/userRoleDept';


const OpportunityDetailPage = ({ item }) => {

    const OBJECT_API = "Opportunity"
    const url = `/UpsertOpportunity`;
    const fetchLeadsbyName = `/LeadsbyName?searchKey=`;
    const fetchInventoriesbyName = `/InventoryName?searchKey=`;


    const [singleOpportunity, setSinglOpportunity] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    const [leadsRecords, setLeadsRecords] = useState([]);
    const [inventoriesRecord, setInventoriesRecord] = useState([]);
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [permissionValues, setPermissionValues] = useState({})
   
    const userRoleDpt= getLoginUserRoleDept(OBJECT_API)
    console.log(userRoleDpt,"userRoleDpt")

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        console.log('inside opportunity');
        setSinglOpportunity(location.state.record.item);
        setshowNew(!location.state.record.item)
        FetchInventoriesbyName('');
        FetchLeadsbyName('');
        if(userRoleDpt){
            apiCheckPermission(userRoleDpt)
            .then(res=>{
                setPermissionValues(res)
            })
            .catch(err=>{
                console.log(err,"res apiCheckPermission error")
                setPermissionValues({})
            })
        }
        // const getPermission = getPermissions("Opportunity")
        // console.log(getPermission, "getPermission")
        // setPermissionValues(getPermission)


    }, [])

    const initialValues = OpportunityInitialValues
    const savedValues = OpportunitySavedValues(singleOpportunity)

    const validationSchema = Yup.object({
        opportunityName: Yup
            .string()
            .required('Required'),
        amount: Yup
            .string()
            .required('Required')
            .matches(/^[0-9]+$/, "Must be only digits")

    })

    const formSubmission = (values) => {
        console.log('form submission value', values);

        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()
        let closeDateSec = new Date(values.closeDate).getTime()

        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.createdBy = (sessionStorage.getItem("loggedInUser"));
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
            if (values.closeDate) {
                values.closeDate = closeDateSec;
            }
            if (values.LeadId === '' && values.InventoryId === '') {
                console.log('both empty')
                delete values.LeadId;
                delete values.InventoryId;
            }
            else if (values.LeadId === '') {
                console.log('LeadId empty')
                delete values.LeadId;
            }
            else if (values.InventoryId === '') {
                console.log('InventoryId empty')
                delete values.InventoryId;
            }
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec
            values.createdBy = singleOpportunity.createdBy;
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));

            values.InventoryName = values.inventoryDetails.propertyName;
            values.LeadName = values.leadDetails.leadName
            values.LeadId = values.leadDetails.id;
            values.InventoryId = values.inventoryDetails.id

            if (values.closeDate) {
                values.closeDate = closeDateSec;
            }
            if (values.LeadId === '' && values.InventoryId === '') {
                console.log('both empty !showNew')
                delete values.LeadId;
                delete values.InventoryId;
            }
            else if (values.LeadId === '') {
                console.log('LeadId empty !showNew')
                delete values.LeadId;
            }
            else if (values.InventoryId === '') {
                console.log('InventoryId empty !showNew')
                delete values.InventoryId;
            }

        }
        console.log('after change form submission value', values);

        RequestServer(url, values)
            .then((res) => {
                console.log('post response', res);
                if(res.success){
                    console.log("res success", res)
                    setNotify({
                        isOpen: true,
                        message: res.data,
                        type: 'success'
                    })
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000)
                }else {
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
            .catch((error) => {
                console.log('error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
                setTimeout(() => {
                    navigate(-1);
                }, 1000)
            })
    }

    const FetchLeadsbyName = (newInputValue) => {
        console.log('inside FetchLeadsbyName fn');
        console.log('newInputValue', newInputValue)
        RequestServer(fetchLeadsbyName +newInputValue)
            .then((res) => {
                console.log('res fetchLeadsbyName', res.data)
                if (res.success) {
                    setLeadsRecords(res.data)
                }else{
                    console.log("fetchLeadsbyName status error",res.error.message)
                }
            })
            .catch((error) => {
                console.log('error fetchLeadsbyName', error);
            })
    }

    const FetchInventoriesbyName = (newInputValue) => {
        RequestServer(fetchInventoriesbyName+newInputValue)
            .then((res) => {
                console.log('res fetchInventoriesbyName', res.data)
                if (res.success) {
                    setInventoriesRecord(res.data)
                }else{
                    console.log("FetchInventoriesbyName status error",res.error.message)
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
                    showNew ? <h3>New Deals</h3> : <h3>Deals Detail Page </h3>
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
                        const { values, dirty, isSubmitting, handleChange, handleSubmit, handleReset, setFieldValue } = props;

                        return (
                            <>
                                <ToastNotification notify={notify} setNotify={setNotify} />
                                <Form className='my-form'>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="opportunityName" >Opportunity Name<span className="text-danger">*</span> </label>
                                            <Field name='opportunityName' type="text" class="form-input"
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="opportunityName" />
                                            </div>
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
                                                        setFieldValue("inventoryDetails", '')
                                                        setFieldValue("InventoryId", '')
                                                        setFieldValue("InventoryName", '')
                                                    } else {
                                                        console.log('value', value);
                                                        setFieldValue("inventoryDetails", value)
                                                        setFieldValue("InventoryId", value.id)
                                                        setFieldValue("InventoryName", value.propertyName)
                                                    }
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    console.log('newInputValue', newInputValue);
                                                    if (newInputValue.length >= 3) {
                                                        FetchInventoriesbyName(newInputValue);
                                                    }
                                                    else if (newInputValue.length === 0) {
                                                        FetchInventoriesbyName(newInputValue);
                                                    }
                                                }}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="InventoryId" />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="LeadId">Lead Name </label>
                                            <Autocomplete
                                                name="LeadId"
                                                options={leadsRecords}
                                                value={values.leadDetails}
                                                getOptionLabel={option => option.leadName || ''}
                                                onChange={(e, value) => {
                                                    console.log('lead onchange', value);
                                                    if (!value) {
                                                        console.log('!value', value);
                                                        setFieldValue("leadDetails", '')
                                                        setFieldValue("LeadId", '')
                                                        setFieldValue("LeadName", '')
                                                    } else {
                                                        console.log('value', value);
                                                        setFieldValue("leadDetails", value)
                                                        setFieldValue("LeadId", value.id)
                                                        setFieldValue("LeadName", value.leadName)
                                                    }

                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    console.log('newInputValue', newInputValue);
                                                    if (newInputValue.length >= 3) {
                                                        FetchLeadsbyName(newInputValue);
                                                    }
                                                    else if (newInputValue.length === 0) {
                                                        FetchLeadsbyName(newInputValue);
                                                    }
                                                }}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="LeadId" />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="stage">Opportunity Stage</label>
                                            <Field name="stage" component={CustomizedSelectForFormik}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    OppStagePicklist.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="type">Type</label>
                                            <Field name="type" component={CustomizedSelectForFormik}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    OppTypePicklist.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="leadSource"> Lead Source</label>
                                            <Field name="leadSource" component={CustomizedSelectForFormik}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    LeadSourcePickList.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="closeDate">Close Date</label> <br />
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    name="closeDate"
                                                    value={values.closeDate}
                                                    onChange={(e) => {
                                                        setFieldValue('closeDate', e)
                                                    }}
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                    renderInput={(params) => <TextField  {...params} style={{ width: '100%' }} error={false} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="amount">Amount<span className="text-danger">*</span> </label>
                                            <Field class="form-input" type='text' name="amount"
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="amount" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <label htmlFor="description">Description</label>
                                            <Field as="textarea" name="description" class="form-input-textarea" style={{ width: '100%' }}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            />
                                        </Grid>
                                        {!showNew && (
                                            <>
                                                <Grid item xs={6} md={6}>
                                                    {/* value is aagined to  the fields */}
                                                    <label htmlFor="createdDate" >Created Date</label>
                                                    <Field name='createdDate' type="text" class="form-input"
                                                        value={values.createdBy.userFullName + " , " + values.createdDate} disabled />
                                                </Grid>

                                                <Grid item xs={6} md={6}>
                                                    {/* value is aagined to  the fields */}
                                                    <label htmlFor="modifiedDate" >Modified Date</label>
                                                    <Field name='modifiedDate' type="text" class="form-input"
                                                        value={values.modifiedBy.userFullName + " , " + values.modifiedDate} disabled />
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                    <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>

                                            {showNew ?
                                                <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty}>Save</Button>
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
export default OpportunityDetailPage;





















