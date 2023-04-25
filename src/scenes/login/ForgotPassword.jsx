
import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate,Link, Navigate } from 'react-router-dom';
import { Grid, Button, DialogActions, InputAdornment, IconButton, Paper,Avatar,Typography,TextField} from "@mui/material";
import axios from 'axios'
import '../recordDetailPage/Form.css'
import Cdlogo from '../assets/cdlogo.jpg';

const confirmEmailURL = `${process.env.REACT_APP_SERVER_URL}/checkSignUpUser`

export default function ForgotPasswordIndex() {



    const paperStyle={padding :20,height:'100%',width:280, margin:"20px auto"}
    const avatarStyle={   width: 100,height: 100}
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [showPassword, setShowPassword] = useState(false);

    const[isUser,setIsUser]=useState(false)


    const navigate=useNavigate()

    const initialValues = {
        userName: '',
        // password: '',
    }

    const validationSchema = Yup.object({
        userName:Yup
            .string()
            .email()
            .required('Required'),
      
    })
    const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
      
        axios.post(confirmEmailURL,values)
        .then((res)=>{
            console.log(res.data,"api res")
            if(res.data.status==="failure"){
                setIsUser(true)
            }else if(res.data.status==="success"){
                setIsUser(false)
                 const item =res.data.content
                 console.log(res.data,"item forgot pass")
                navigate('/otp',{ state: { record: { item } }});
                // navigate(`/confirm-password`,{ state: { record: { item } } })
            }
        })
        .catch((err)=>{
            console.log(err.status,"status")
            console.log(err,"err")
        })
    }
    return(
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                     <Avatar style={avatarStyle}>
                     <img src={Cdlogo} alt="cdlogo"  style={avatarStyle}/>
                     </Avatar>
                    <h2>Confirm Email</h2>
                </Grid>
                {/* <FormikLogin/>              */}
                <Grid item xs={12} style={{ margin: "20px" }}>
               
               <Formik
                   initialValues={initialValues}
                   validationSchema={validationSchema}
                   onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
               >
                   {(props) => {
                       const{isValid,setFieldValue,values}=props;
                       return (
                           <>
                               <Form >
                                   <Grid container spacing={2}>

                                       <Grid item xs={12} md={12}>
                                           <label htmlFor="userName">Registered Email <span className="text-danger">*</span></label>
                                           <Field name="userName" type="email" class="login-form-input"
                                            onChange={(e)=>{
                                                setFieldValue("userName",e.target.value)
                                                if(e.target.value.length>0){
                                                    setIsUser(false)
                                                }
                                            }}
                                             />
                                           <div style={{ color: 'red' }}>
                                               <ErrorMessage name="userName" />
                                           </div>
                                       </Grid>
                                       {
                                            isUser ? <p className="error-note">Enter Valid Registered Email Id.</p> : null
                                       }
                                      </Grid>
                                      <div className='action-buttons'>
                                       <DialogActions sx={{ justifyContent: "space-between",marginTop:'10px' }}>
                                           <Button   type='success' color="secondary" variant="contained"  disabled={!isValid} >Submit</Button>
                                       </DialogActions>
                                   </div>
                               </Form>
                           </>
                       )
                   }}
               </Formik>
           </Grid>
           <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                        <Typography component={Link} to='/'>Login Page</Typography>
                </div>
            </Paper>
        </Grid>
    )
}


