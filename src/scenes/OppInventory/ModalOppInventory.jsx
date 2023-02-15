import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Grid, Button, FormControl, Stack, Alert, DialogActions,
    Autocomplete, TextField
} from "@mui/material";
import axios from 'axios'
import "../formik/FormStyles.css"

const UpsertUrl = `${process.env.REACT_APP_SERVER_URL}/UpsertJnOppInventory`;
const fetchInventoriesbyName = `${process.env.REACT_APP_SERVER_URL}/InventoryName`;


const ModalOppInventory = ({ item, handleModal }) => {

    const [oppParentRecord, setOppParentRecord] = useState();

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();

    const [inventoriesRecord, setInventoriesRecord] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log('Opp parent record', location.state.record.item);
        setOppParentRecord(location.state.record.item)
        FetchInventoriesbyName('')
    }, [])

    const initialValues = {
        OpportunityId: '',
        InventoryId: '',
        createdbyId: '',
        createdDate: '',
        modifiedDate: '',
    }

    const validationSchema = Yup.object({
       
        InventoryId: Yup
        .string()
        .required('Required')

    })

    const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);

        let Opportunity = oppParentRecord._id;
        let dateSeconds = new Date().getTime();

        values.modifiedDate = dateSeconds;
        values.createdDate = dateSeconds;
        values.OpportunityId = Opportunity;

        console.log('valuse after chg',values);
   
        await axios.post(UpsertUrl, values)

            .then((res) => {
                console.log('task form Submission  response', res);
                setShowAlert(true)
                setAlertMessage(res.data)
                setAlertSeverity('success')
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            })
            .catch((error) => {
                console.log('task form Submission  error', error);
                setShowAlert(true)
                setAlertMessage(error.message)
                setAlertSeverity('error')
            })
    }

    const toastCloseCallback = () => {
        setShowAlert(false)
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
                <h3>Add Inventory</h3>
            </div>

            <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
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
                                        </Grid>
                                        <div className='action-buttons'>
                                    <DialogActions sx={{ justifyContent: "space-between" }}>

                                        <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>

                                        <Button type="reset" variant="contained" onClick={(e) => handleModal(false)}>Cancel</Button>

                                    </DialogActions>
                                </div>

                                    

                            </Form>
                        </>
                    )
                }}
            </Formik>
        </Grid>
    )
}
export default ModalOppInventory

