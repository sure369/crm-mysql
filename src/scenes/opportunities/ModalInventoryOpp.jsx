import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, Forminput, DialogActions, TextField, Autocomplete } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
import "../formik/FormStyles.css"
import Notification from '../toast/Notification';
import { LeadSourcePickList, OppStagePicklist, OppTypePicklist } from '../../data/pickLists';

const url = `${process.env.REACT_APP_SERVER_URL}/UpsertOpportunity`;
const fetchLeadsbyName = `${process.env.REACT_APP_SERVER_URL}/LeadsbyName`;

const ModalInventoryOpportunity = ({ item }) => {

    const [inventoryParentRecord, setinventoryParentRecord] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [leadsRecords, setLeadsRecords] = useState([]);
    const[notify,setNotify]=useState({isOpen:false,message:'',type:''})


    useEffect(() => {
        console.log('Inventory parent  record', location.state.record.item);
        setinventoryParentRecord(location.state.record.item)
        FetchLeadsbyName('')
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
        leadDetails:'',
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


        values.InventoryId = inventoryParentRecord._id;
        values.modifiedDate = dateSeconds;
        values.createdDate = dateSeconds;
        values.inventoryDetails={
            propertyName:inventoryParentRecord.propertyName,
            id:inventoryParentRecord._id
        }
        if (values.closeDate) {
            values.closeDate = closeDateSec;
        }
        if (values.LeadId === '') {
            console.log('LeadId empty')
            delete values.LeadId;
        }


        console.log('after change form submission value', values);

        axios.post(url, values)
            .then((res) => {
                console.log('post response', res);
                setNotify({
                    isOpen:true,
                    message:res.data,
                    type:'success'
                  })
                setTimeout(() => {
                    // window.location.reload();
                }, 2000);
            })
            .catch((error) => {
                console.log('error', error);
                setNotify({
                    isOpen:true,
                    message:error.message,
                    type:'error'          
                  })
              
            })
    }

    const FetchLeadsbyName =(newInputValue) =>{
        console.log('inside FetchLeadsbyName fn');
        console.log('newInputValue',newInputValue)
        axios.post(`${fetchLeadsbyName}?searchKey=${newInputValue}`)
        .then((res) => {
            console.log('res fetchLeadsbyName', res.data)
            if(typeof(res.data)=== "object"){
                setLeadsRecords(res.data)
            }
        })
        .catch((error) => {
            console.log('error fetchLeadsbyName', error);
        })
    }

    const handleFormClose = () => {
       navigate(-1)
        // navigate("/inventoryDetailPage", { state: { record: { inventoryParentRecord } } })
    }

    return (

        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>New Opportunity</h3>
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
                                 <Notification notify={notify} setNotify={setNotify} />
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
                                            <label htmlFor="LeadId">Lead Name </label>
                                            <Autocomplete
                            name="LeadId"
                            options={leadsRecords}
                            value={values.leadDetails}
                            getOptionLabel={option => option.leadName ||''}
                           
                            onChange={(e, value) => {
                                console.log('lead onchange',value);
                              if(!value){                                
                                console.log('!value',value);
                                setFieldValue("LeadId",'')
                                setFieldValue("leadDetails",'')
                              }else{
                                console.log('value',value);
                                setFieldValue("LeadId",value.id)
                                setFieldValue("leadDetails",value)
                              }
                                
                            }}
                            
                            onInputChange={(event, newInputValue) => {
                                console.log('newInputValue',newInputValue);
                                if(newInputValue.length>=3){
                                    FetchLeadsbyName(newInputValue);
                                }
                            }}
                            renderInput={params => (
                            <Field component={TextField} {...params} name="LeadId" />
                            )}
                />  


                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="stage">Opportunity Stage</label>
                                            <Field name="stage" as="select" class="form-input">
                                            <option value=''><em>None</em></option>
                                                {
                                                    OppStagePicklist.map((i)=>{
                                                        return  <option value={i.value}>{i.label}</option>
                                                    })
                                                }
                                            </Field>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="type">Type</label>
                                            <Field name="type" as="select" class="form-input">
                                            <option value=''><em>None</em></option>
                                                {
                                                    OppTypePicklist.map((i)=>{
                                                        return  <option value={i.value}>{i.label}</option>
                                                    })
                                                }
                                            </Field>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="leadSource"> Lead Source</label>
                                            <Field name="leadSource" as="select" class="form-input">
                                            <option value=''><em>None</em></option>
                                                {
                                                    LeadSourcePickList.map((i)=>{
                                                        return  <option value={i.value}>{i.label}</option>
                                                    })
                                                }
                                            </Field>
                                        </Grid>


                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="closeDate">Close Date</label>
                                            <Field name="closeDate" type="date" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="amount">Amount</label>
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
export default ModalInventoryOpportunity;
