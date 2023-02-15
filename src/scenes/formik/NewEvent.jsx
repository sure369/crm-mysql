import React ,{ useEffect, useState ,useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {useLocation ,useNavigate} from 'react-router-dom';
import { Grid,Button ,FormControl,Stack ,Alert,DialogActions,
    Autocomplete,TextField} from "@mui/material";
import axios from 'axios'
import "./FormStyles.css"
import PreviewFile from "./PreviewFile";

const UpsertUrl =`${process.env.REACT_APP_SERVER_URL}/UpsertTask`;
const fetchAccountUrl =`${process.env.REACT_APP_SERVER_URL}/accountsname`;
const fetchLeadUrl =`${process.env.REACT_APP_SERVER_URL}/LeadsbyName`;
const fetchOpportunityUrl =`${process.env.REACT_APP_SERVER_URL}/opportunitiesbyName`;

const NewEventForm = ({item}) => {

    const [singleLead,setSingleLead]= useState(); 
    const[url,setUrl]= useState();

    const [relatedRecNames,setRelatedRecNames] = useState([]);

    const[showAlert,setShowAlert] = useState(false);
    const[alertMessage,setAlertMessage]=useState();
    const[alertSeverity,setAlertSeverity]=useState();
    const[alertNotes,setAlertNotes]=useState({
                                        isShow:false,
                                        message:'',
                                        severity:''
                                    })
    const navigate =useNavigate();
    const fileRef =useRef();
    const location = useLocation();

    useEffect(()=>{
        if(item){

            console.log('inside useeffect', location.state.record.item);
            setSingleLead(location.state.record.item)
        }
        
    },[])

    const initialValues = {
        subject:'',
        nameofContact: '',
        realatedTo:'',
        assignedTo:'',
        startDate:'',
        startTime:'',
        EndDate:'',
        EndTime:'',
        description:'',
        attachments:null,
        object:'',
        leads: singleLead?._id ?? "",
        AccountId:'',
        LeadId:'',
        OpportunityId:''
    }

    const validationSchema = Yup.object({
        subject: Yup
            .string()
            .required('Required'),
        
    })
    
    const formSubmission = (values, { resetForm }) => {
        console.log('values',values);
  
        axios.post(UpsertUrl,values)
        .then((res)=>{
            console.log('upsert task response',res);
            setShowAlert(true)
            setAlertMessage(res.data)
            setAlertSeverity('success')
         
           
        })
        .catch((error)=> {
            console.log('upsert record  error',error);
            setShowAlert(true)
            setAlertMessage(error.message)
            setAlertSeverity('error')
        }) 
        // resetForm({ values: '' })
    }   

    const toastCloseCallback=()=>{
        setShowAlert(false)
    }

    const callEvent =(e) =>{

        let url1 = e=='Account' ? fetchAccountUrl : e=='Lead' ? fetchLeadUrl : e=='Opportunity' ?fetchOpportunityUrl : null
    
        setUrl(url1)

       
           
            console.log('url',url);
      

        FetchObjectsbyName('',url1);
            if(url == null){
                console.log('url',url);
                setRelatedRecNames([])
            }
    }

    const FetchObjectsbyName = (newInputValue,url) => {
        
        console.log('passed url', url)
        console.log('typed  value', newInputValue)


        axios.post(`${url}?searchKey=${newInputValue}`)
        .then((res) => {
            console.log('res Fetch Objects byName', res.data)
            if(typeof(res.data)=== "object"){
                setRelatedRecNames(res.data)
            }
        })
        .catch((error) => {
            console.log('error fetchAccountsbyName', error);
        })
    }
   
    return (
        <Grid item xs={12} style={{margin:"20px"}}>  
        <div style={{textAlign:"center" ,marginBottom:"10px"}}>
            <h3> Task </h3>
        </div>        

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values,{resetForm})=>formSubmission(values,{resetForm})}
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
                                            <label htmlFor="subject">Subject  <span className="text-danger">*</span></label>
                                            <Field name="subject" as="select" class="form-input">
                                                <option value =""> </option>
                                                <option value ="call"> Call</option>
                                                <option value ="email"> Email</option>
                                                <option value ="meeting"> Meeting</option>
                                                <option value ="send Quotw"> Send Quote</option>
                                            </Field>
                                               
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="subject" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                        <label htmlFor="object">object  </label>
                                            <Field name="object" as="select" class="form-input"
                                                onChange={(e) => {
                                                  console.log('value',e.target.value)
                                                  callEvent(e.target.value)
                                                  setFieldValue('object',e.target.value)
                                                  }}
                                            >
                                                <option value=""></option>
                                                <option value="Lead">Lead</option>
                                                <option value="Opportunity">Opportunity</option>
                                                <option value="Account">Account</option>
                                            </Field>
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                    <label htmlFor="realatedTo"> Realated To  </label>
                                        <Autocomplete
                                        name="realatedTo"
                                        options={relatedRecNames}
                                        value= {values.realatedTo}
                                      
                                        getOptionLabel={option => option.leadName || option.accountName || option.opportunityName ||''}
                                       
                                        isOptionEqualToValue={(option, value) =>
                                           option.id ===value                                           
                                        }
                                        onChange={(e, value) => {
                                          
                                            console.log('inside onchange',values.object);
                                            if(values.object =='Account'){
                                                setFieldValue('AccountId',value.id)
                                            }else  if(values.object =='Opportunity'){
                                                setFieldValue('OpportunityId',value.id)
                                            }else  if(values.object =='Lead'){
                                                setFieldValue('LeadId',value.id)
                                            }
                                        //    setFieldValue()
                                            setFieldValue("realatedTo", value ||'')
                                           
                                        }}
                                      
                                        onInputChange={(event, newInputValue) => {
                                            console.log('inside on Input Change',values.object);
                                            console.log('newInputValue',newInputValue);
                                         
                                            FetchObjectsbyName(newInputValue,url)
                                                        // FetchAccountsbyName(newInputValue);
                                            
                                        }}
                                        renderInput={params => (
                                        <Field component={TextField} {...params} name="realatedTo" />
                                        )}
                                      
                                />  
                                  
                                    

                                </Grid>
                                        {/* <Grid item xs={6} md={6}>
                                            <label htmlFor="nameofContact">Name of Contact  </label>
                                            <Field name="nameofContact" type="text" 
                                            value={singleLead.firstName}
                                             class="form-input" />
                                        </Grid> */}
                                        {/* <Grid item xs={6} md={6}>
                                            <label htmlFor="realatedTo">Realated To  </label>
                                            <Field name="realatedTo" type="text" class="form-input" />
                                        </Grid> */}
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="assignedTo">assignedTo  </label>
                                            <Field name="assignedTo" type="text" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="startDate">startDate   </label>
                                            <Field name="startDate" type="date" class="form-input" 
                                            onChange={(event) => {
                                                console.log('inside date change',event.target.value);
                                                var dateFormatConvert = new Date(event.target.value);
                                                var dateSeconds = dateFormatConvert.getTime()
                                                console.log('dateSeconds',dateSeconds);
                                               
                                               var secondsFormat= new Date(dateSeconds).toUTCString()
                                               console.log('seconds format',secondsFormat)
                                               
                                               console.log('string convert',new Date(secondsFormat).toISOString())
                                              
                               

                                                 setFieldValue("startDate", event.target.value);

                                                }}

                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="startTime">startTime   </label>
                                            <Field name="startTime" type="time" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="EndDate">EndDate   </label>
                                            <Field name="EndDate" type="date" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="EndTime">EndTime   </label>
                                            <Field name="EndTime" type="time" class="form-input" />
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                           
                                            <label htmlFor="attachments">attachments</label>          
                                                <input id="attachments" name="attachments" type="file" 
                                                ref={fileRef} 
                                                onChange={(event) => {
                                                setFieldValue("attachments", event.target.files[0]);
                                                }} className="form-input" />

                                                {values.attachments && <PreviewFile file={values.attachments} />}

                                                {/* <button onclick ={()=>{
                                                    fileRef.current.click();
                                                }}
                                                > preview </button> */}
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="leads">leads   </label>
                                            <Field name="leads" type="text" 
                                               
                                            class="form-input" />
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <label htmlFor="description">Description</label>
                                            <Field as="textarea" name="description" class="form-input" />
                                        </Grid>
                                        
                                    </Grid>
                                       
                                        <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>

                                                <Button type='success' variant="contained" color="secondary" >Save</Button>
                                                                                
                                     
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
export default NewEventForm

