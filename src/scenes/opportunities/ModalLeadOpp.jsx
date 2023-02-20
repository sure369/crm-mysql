import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
    Grid, Button, Forminput, DialogActions,
    MenuItem, TextField, Autocomplete
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
import "../formik/FormStyles.css"
import ToastNotification from '../toast/ToastNotification';
import { LeadSourcePickList, OppStagePicklist, OppTypePicklist } from '../../data/pickLists';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const url = `${process.env.REACT_APP_SERVER_URL}/UpsertOpportunity`;
const fetchInventoriesbyName = `${process.env.REACT_APP_SERVER_URL}/InventoryName`;


const ModalLeadOpportunity = ({ item, handleModal }) => {

    const [leadParentRecord, setLeadParentRecord] = useState();

    const location = useLocation();
    const navigate = useNavigate();
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [inventoriesRecord, setInventoriesRecord] = useState([]);

    useEffect(() => {
        console.log('Lead parent  record', location.state.record.item);
        setLeadParentRecord(location.state.record.item)
        FetchInventoriesbyName('')
    }, [])


    const initialValues = {
        LeadId: '',
        InventoryId: '',
        opportunityName: '',
        type: '',
        leadSource: '',
        amount: '',
        closeDate: '',
        stage: '',
        description: '',
        createdbyId: '',
        createdDate: '',
        modifiedDate: '',
        inventoryDetails: '',
    }

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


        values.LeadId = leadParentRecord._id;
        values.modifiedDate = dateSeconds;
        values.createdDate = dateSeconds;
        values.leadDetails = {
            leadName: leadParentRecord.fullName,
            id: leadParentRecord._id
        }

        if (values.closeDate) {
            values.closeDate = closeDateSec;
        }
        if (values.InventoryId === '') {
            console.log('InventoryId empty')
            delete values.InventoryId;
        }


        console.log('after change form submission value', values);

        axios.post(url, values)
            .then((res) => {
                console.log('post response', res);
                setNotify({
                    isOpen: true,
                    message: res.data,
                    type: 'success'
                })
                setTimeout(() => {
                    handleModal()
                }, 1000)
            })
            .catch((error) => {
                console.log('error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
                setTimeout(() => {
                    handleModal()
                }, 1000)
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
    return (

        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>New Deals</h3>
            </div>
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => { formSubmission(values) }}
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
                                            <label htmlFor="InventoryId">Inventory Name </label>
                                            <Autocomplete
                                                name="InventoryId"
                                                options={inventoriesRecord}
                                                value={values.inventoryDetails}
                                                getOptionLabel={option => option.propertyName || ''}
                                                //  isOptionEqualToValue = {(option,value)=>
                                                //           option.propertyName === value
                                                //   }
                                                onChange={(e, value) => {
                                                    if (!value) {
                                                        console.log('!value', value);
                                                        setFieldValue("InventoryId", '')
                                                        setFieldValue("inventoryDetails", '')
                                                    } else {
                                                        console.log('value', value);
                                                        setFieldValue("InventoryId", value.id)
                                                        setFieldValue("inventoryDetails", value)
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
                                            <label htmlFor="stage">Opportunity Stage</label>
                                            <Field name="stage" component={CustomizedSelectForFormik} className="form-customSelect">
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
                                            <Field name="type" component={CustomizedSelectForFormik} className="form-customSelect">
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
                                            <Field name="leadSource" component={CustomizedSelectForFormik} className="form-customSelect">
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    LeadSourcePickList.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="closeDate">Close Date</label>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    name="closeDate"
                                                    value={values.closeDate}
                                                    onChange={(e) => {
                                                        setFieldValue('closeDate', e)
                                                    }}
                                                    renderInput={(params) => <TextField  {...params} className='form-input' error={false} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="amount">Amount<span className="text-danger">*</span></label>
                                            <Field class="form-input" type='text' name="amount" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="amount" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <label htmlFor="description">Description</label>
                                            <Field as="textarea" name="description" class="form-input" />
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
export default ModalLeadOpportunity;
