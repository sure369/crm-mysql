import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid,Button ,Forminput,DialogActions,TextField,Autocomplete} from "@mui/material";
import { useParams,useNavigate } from "react-router-dom"
import axios from 'axios'
import "../formik/FormStyles.css"
import Notification from '../toast/Notification';
import { LeadSourcePickList, OppStagePicklist, OppTypePicklist } from '../../data/pickLists';

const url =`${process.env.REACT_APP_SERVER_URL}/UpsertOpportunity`;
const fetchLeadsbyName =`${process.env.REACT_APP_SERVER_URL}/LeadsbyName`;
const fetchInventoriesbyName =`${process.env.REACT_APP_SERVER_URL}/InventoryName`;


const OpportunityDetailPage = ({item}) => {

    const [singleOpportunity,setSinglOpportunity]= useState(); 
    const location = useLocation();
    const navigate =useNavigate();
    const [showNew, setshowNew] = useState()
    const [leadsRecords,setLeadsRecords]= useState([]);
    const [inventoriesRecord,setInventoriesRecord]= useState([]);
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    useEffect(()=>{
        console.log('passed record',location.state.record.item);
        console.log('inside opportunity');
        setSinglOpportunity(location.state.record.item); 
        setshowNew(!location.state.record.item)  
        FetchInventoriesbyName('');
        FetchLeadsbyName('');
       
    },[])

    const initialValues = {
        LeadId: '',
        InventoryId:'',
        opportunityName: '',
        type: '',
        leadSource: '',
        amount: '',
        closeDate: '',
        stage: '',
        description: '',
        createdbyId: '',
        createdDate:'',
        modifiedDate:'',
    }

    const savedValues = {
        LeadId: singleOpportunity?.LeadId ?? "",
        InventoryId: singleOpportunity?.InventoryId ?? "",
        opportunityName:  singleOpportunity?.opportunityName ?? "",
        type: singleOpportunity?.type ?? "",
        leadSource:  singleOpportunity?.leadSource ?? "",
        amount:  singleOpportunity?.amount ?? "",
        closeDate:new Date(singleOpportunity?.closeDate).getUTCFullYear()
                    + '-' +  ('0'+ (new Date(singleOpportunity?.closeDate).getUTCMonth() + 1)).slice(-2) 
                    + '-' + ('0'+ ( new Date(singleOpportunity?.closeDate).getUTCDate())).slice(-2) ||'',
        stage:  singleOpportunity?.stage ?? "",
        description:  singleOpportunity?.description ?? "",
        createdbyId:  singleOpportunity?.createdbyId ?? "",
        createdDate:   new Date(singleOpportunity?.createdDate).toLocaleString(),
        modifiedDate:  new Date(singleOpportunity?.modifiedDate).toLocaleString(),
        _id:   singleOpportunity?._id ?? "",  
        inventoryDetails: singleOpportunity?.inventoryDetails ??"",
        leadDetails: singleOpportunity?.leadDetails ??"",
    }
    const validationSchema = Yup.object({
        opportunityName: Yup
            .string()
            .required('Required'),
        amount:Yup
            .string()
            .required('Required')
            .matches(/^[0-9]+$/, "Must be only digits")
        
    })

    const formSubmission = (values)=>{
        console.log('form submission value',values);

        let dateSeconds = new Date().getTime();        
        let createDateSec = new Date(values.createdDate).getTime()
        let closeDateSec =new Date(values.closeDate).getTime()
   
        if(showNew){
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            if( values.closeDate){
                values.closeDate =closeDateSec;
            }
            if (values.LeadId === '' && values.InventoryId==='') {   
                console.log('both empty') 
                delete values.LeadId; 
                delete values.InventoryId;
            }
            else if(values.LeadId === ''){
                console.log('LeadId empty') 
                delete values.LeadId; 
            }
            else if(values.InventoryId === ''){
                console.log('InventoryId empty') 
                delete values.InventoryId; 
            }
        }
        else if(!showNew){
            values.modifiedDate = dateSeconds;
            values.createdDate =createDateSec
            if( values.closeDate){
                values.closeDate =closeDateSec;
            }
            if (values.LeadId === '' && values.InventoryId === '') {    
                console.log('both empty !showNew') 
                delete values.LeadId; 
                delete values.InventoryId;
            }
            else if(values.LeadId === ''){
                console.log('LeadId empty !showNew') 
                delete values.LeadId; 
            }
            else if(values.InventoryId === ''){
                console.log('InventoryId empty !showNew') 
                delete values.InventoryId; 
            }
           
        }
        console.log('after change form submission value',values);
        
        axios.post(url,values)
        .then((res)=>{
            console.log('post response',res);
            setNotify({
                isOpen: true,
                message: res.data,
                type: 'success'
            })
            setTimeout(() => {
                navigate(-1);
            }, 2000)
        })
        .catch((error)=> {
            console.log('error',error);
            setNotify({
                isOpen: true,
                message: error.message,
                type: 'error'
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
   
    const FetchInventoriesbyName =(newInputValue) =>{
        axios.post(`${fetchInventoriesbyName}?searchKey=${newInputValue}`)
        .then((res) => {
            console.log('res fetch Inventoriesby Name', res.data)
            if(typeof(res.data)=== "object"){
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
      
    <Grid item xs={12} style={{margin:"20px"}}>          
    <div style={{textAlign:"center" ,marginBottom:"10px"}}>
        {
            showNew ? <h3>New Opportunity</h3> : <h3>Opportunity Detail Page </h3>
        }
    </div>
    <div>
        <Formik
            enableReinitialize={true} 
            initialValues={showNew ? initialValues : savedValues}
            validationSchema={validationSchema}
            onSubmit={ (values, { resetForm }) => {formSubmission(values)}}
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
                 <Field name='opportunityName' type="text" class="form-input"/>
                 <div style={{ color: 'red'}}>
                     <ErrorMessage name="opportunityName" />
                 </div>
             </Grid>
            
             <Grid item xs={6} md={6}>
             <label htmlFor="InventoryId">Inventory Name </label>
                <Autocomplete
                            name="InventoryId"
                            options={inventoriesRecord}
                            value={values.inventoryDetails}
                          
                             getOptionLabel={option =>  option.propertyName ||''}
                            //  isOptionEqualToValue = {(option,value)=>
                            //           option.propertyName === value
                            //   }

                         
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
                                console.log('newInputValue',newInputValue);
                                if(newInputValue.length>=3){
                                    FetchInventoriesbyName(newInputValue);
                                }
                            }}
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
             <label htmlFor="amount">Amount<span className="text-danger">*</span> </label>
                 <Field class="form-input" type='text' name="amount" />
                 <div style={{ color: 'red'}}>
                     <ErrorMessage name="amount" />
                 </div>
             </Grid>           
             <Grid item xs={12} md={12}>
                 <label htmlFor="description">Description</label>
                 <Field  as="textarea"  name="description"class="form-input" />
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
                    <Field name='modifiedDate' type="text" class="form-input" disabled/>
                </Grid>
                </>
            )}
         </Grid>
         <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>
                                       
                                           { showNew ?
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
export default OpportunityDetailPage;























// import React, { useEffect, useState } from 'react'
// import {useLocation} from 'react-router-dom';
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { Grid,Button ,Forminput} from "@mui/material";
// import { useParams,useNavigate } from "react-router-dom"
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios'
// import DatePickerField from "../formik/datePick";


// const url =`${process.env.REACT_APP_SERVER_URL}/editOpportunity`;

// const OpportunityDetailPage = ({item}) => {

//     const [singleOpportunity,setsingleOpportunity]= useState(); 
//     const location = useLocation();
//     const navigate =useNavigate();

//     useEffect(()=>{
//         console.log('passed record',location.state.record.item);
//         setsingleOpportunity(location.state.record.item);       
//     })

//     const initialValues = {
//         accountName: singleOpportunity?.accountName ?? "",
//         opportunityName:  singleOpportunity?.opportunityName ?? "",
//         type: singleOpportunity?.type ?? "",
//         leadSource:  singleOpportunity?.leadSource ?? "",
//         amount:  singleOpportunity?.amount ?? "",
//         closeDate:  singleOpportunity?.closeDate ?? "",
//         stage:  singleOpportunity?.stage ?? "",       
//         description:  singleOpportunity?.description ?? "",
//         _id:   singleOpportunity?._id ?? "",
//     }



//     const validationSchema = Yup.object({
//         opportunityName: Yup
//             .string()
//             .required('Required'),
//         stage: Yup
//             .string()
//             .stage('Invalid stage address')
//             .required('Required'),
//     })
    
//   return (
//         <div className="container mb-10">
//             <div className="col-lg-12 text-center mb-3">
//                 <h3>Opportunity Detail page</h3>
//             </div>

//             <div class="container overflow-hidden ">

//                 <Formik
//                     enableReinitialize={true} 
//                     initialValues={initialValues}
//                     validationSchema={validationSchema}
//                     onSubmit={async (values) => {
//                         await new Promise((resolve) => setTimeout(resolve, 500));
//                         console.log("updated record values", values);  
                        
//                         axios.post(url,values)
//                         .then((res)=>{
//                             console.log('updated record  response',res);
//                         })
//                         .catch((error)=> {
//                             console.log('updated record error',error);
//                           })
                        
//                       }}
//                 >
//                    {(props) => {
//                             const {
//                                 values,
//                                 dirty,
//                                 isSubmitting,
//                                 handleChange,
//                                 handleSubmit,
//                                 handleReset,
//                                 setFieldValue,
//                             } = props;

//             return (
//                 <form onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//             <Grid item xs={6} md={6}>
//             <label htmlFor="opportunityName" >Opportunity Name<span className="text-danger">*</span> </label>
//                 <Field name='opportunityName' type="text" class="form-input"/>
//                 <div style={{ color: 'red'}}>
//                     <ErrorMessage name="opportunityName" />
//                 </div>
//             </Grid>
                            
//             <Grid item xs={6} md={6}>
//             <label htmlFor="accountName">Account Name </label>
//                 <Field name="accountName" type="text"class="form-input" />
//             </Grid>
                
//             <Grid item xs={6} md={6}>
//             <label htmlFor="stage">Opportunity Stage</label>
//                 <Field name="stage" as="select" class="form-select">
//                     <option value="">--Select--</option>
//                     <option value="Prospecting">Prospecting</option>
//                     <option value="Needs Analysis">Needs Analysis</option>
//                     <option value="Value Proposition">Value Proposition</option>
//                     <option value="Perception Analysis">Perception Analysis</option>
//                     <option value="Proposal Quote">Proposal Quote</option>
//                     <option value="Negotiation">Negotiation</option>
//                     <option value="Closed Won">Closed Won</option>             
//                     <option value="Closed Lost">Closed Lost</option>
//                 </Field>
//             </Grid>
               
//             <Grid item xs={6} md={6}>
//             <label htmlFor="type">Type</label>
//                 <Field name="type" as="select" class="form-select">
//                     <option value="">--Select--</option>
//                     <option value="New Customer">New Customer</option>
//                     <option value="Existing Customer - Upgrade">Existing Customer - Upgrade</option>
//                     <option value="Existing Customer - Replacement">Existing Customer - Replacement</option>
//                     <option value="Existing Customer - Downgrade">Existing Customer - Downgrade</option>
//                 </Field>
//             </Grid>
              

            
//             <Grid item xs={6} md={6}>
//             <label htmlFor="leadSource"> Lead Source</label>
//                 <Field name="leadSource" as="select" class="form-select">
//                     <option value="">--Select--</option>
//                     <option value="web">Web</option>
//                     <option value="leadSource Inquiry">leadSource Inquiry</option>
//                     <option value="Partner Referral">Partner Referral</option>
//                     <option value="Purchased List">Purchased List</option>
//                     <option value="other">Other</option>
//                 </Field>
//             </Grid>
               
//             {/* <Grid item xs={6} md={6}>
//                 <label htmlFor="closeDate" >Close Date</label>
//                 <DatePickerField  name="date" className="form-input"/>
                
            
//             </Grid> */}
        

//             <Grid item xs={6} md={6}>
//             <label htmlFor="amount">Amount</label>
//                
//             </Grid>           
//             <Grid item xs={12} md={12}>
//                 <label htmlFor="description">Description</label>
//                 <Field  as="textarea"  name="description"class="form-input" />
//             </Grid>
//             <Grid item xs={6} md={12} >
//                 <Button type='success' variant="contained" color="secondary" onClick={handleSubmit} disabled={isSubmitting}>Submit</Button>
//                 <Button type="reset" variant="contained" onClick={handleReset}  disabled={!dirty || isSubmitting} >Clear</Button>
//             </Grid>
//             </Grid>

//                 </form>
//             )
//              }}
//                 </Formik>
//             </div>
//         </div>   
//   )

// }
// export default OpportunityDetailPage;