import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate,Link, Navigate } from 'react-router-dom';
import { Grid, Button, DialogActions, InputAdornment, IconButton, Paper,Avatar,Typography,TextField, colors} from "@mui/material";
import '../recordDetailPage/Form.css'
import Cdlogo from '../assets/cdlogo.jpg';
import { RequestServer } from "../api/HttpReq";

const loginUrl = `/signin`;
const urlPermission =`/sendRolePermission`

// const loginUrl ='http://localhost:80/api/signin';

export default function LoginIndex({onAuthentication}) {

    console.log(process.env.REACT_APP_SERVER_URL,"REACT_APP_SERVER_URL")



    const paperStyle={padding :20,height:'100%',width:280, margin:"20px auto"}
    const avatarStyle={   width: 100,height: 100}
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [showPassword, setShowPassword] = useState(false);

    const[signInCredential,setSignInCredential]=useState(false)
    const[signInData,setSignInData]=useState()
    const users ={userName:'suresh@gmail.com',password:'123456'}
    // const [authenticated, setauthenticated] = useState(sessionStorage.getItem(sessionStorage.getItem("authenticated")|| false));
    const[loginError,setLoginError]=useState(false)
    const[loginErrorNote,setLoginErrorNote]=useState()

    const navigate=useNavigate()

    const initialValues = {
        userName: '',
        password: '',
    }

    const validationSchema = Yup.object({
        userName: Yup
            .string()
            .email()
            .required('Required'),
        password: Yup
            .string()
            .min(6,"Minimum 6 characters exist")
            .max(15,"Maximum 15 characters exist")
            .required('Required')
        ,
    })

    const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
        RequestServer(loginUrl, values)
            .then((res) => {
                console.log(res)
                if (res.success) {
                    console.log(res, "success")
                    let obj = {
                        userId: res.data.userDetails[0]._id,
                        userName: res.data.userDetails[0].userName,
                        userFullName: res.data.userDetails[0].firstName + ' ' + res.data.userDetails[0].lastName,
                        userRole: res.data.userDetails[0].roleDetails,
                        userDepartment: res.data.userDetails[0].departmentName,
                    }
                    sessionStorage.setItem('token', res.data.content)
                    sessionStorage.setItem('loggedInUser', JSON.stringify(obj))
                    let userRole=JSON.parse(res.data.userDetails[0].roleDetails)
                    getPermissions({role:userRole.roleName,departmentname:res.data.userDetails[0].departmentName})
                }
                else {
                    console.log(res.error.message, "err")
                }
            })
            .catch((err) => {
                console.log(err, "error")
            })   
    }

    const getPermissions=(userRoleDpt)=>{
        console.log("inside getPermissions user Role Dpt",userRoleDpt)
      
        RequestServer(urlPermission,userRoleDpt)
        .then((res) => {
          console.log("urlPermission INDEX page", res)
          if (res.success) {
            console.log(JSON.parse(res.data[0].permissionSets),"url permissions")
            sessionStorage.setItem('userPermissions',(res.data[0].permissionSets))
            onAuthentication()
          }
          else {            
            console.log(res.error.message)
          }
        })
        .catch((err) => {
          console.log(err.message,"ERROR")
        })
    }

    return(
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                     <Avatar style={avatarStyle}>
                     <img src={Cdlogo} alt="cdlogo"  style={avatarStyle}/>
                     </Avatar>
                    <h2>Sign In</h2>
                </Grid>
                <Grid item xs={12} style={{ margin: "20px" }}>
               
               <Formik
                   initialValues={initialValues}
                   validationSchema={validationSchema}
                   onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
               >
                   {(props) => {
                       const{isValid,values,setFieldValue}=props;
                       return (
                           <>
                               <Form >
                                   <Grid container spacing={2}>
                                       <Grid item xs={12} md={12}>
                                           <label htmlFor="userName">User Name  <span className="text-danger">*</span></label>
                                           <Field name="userName" type="email" class="login-form-input"
                                            onChange={(e)=>{
                                                setFieldValue("userName",e.target.value)
                                                if(e.target.value.length>0){
                                                    setLoginError(false)
                                                }
                                            }}
                                             />
                                           <div style={{ color: 'red' }}>
                                               <ErrorMessage name="userName" />
                                           </div>
                                       </Grid>
                                       <Grid item xs={12} md={12}>
                                            <label htmlFor="password">Password <span className="text-danger">*</span> </label>
                                            <Field name="password"  type='password' class="login-form-input"
                                            onChange={(e)=>{ 
                                                setFieldValue("password",e.target.value)
                                            if(e.target.value.length>0){
                                                setLoginError(false)
                                            }
                                            }}/>
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="password" />
                                            </div>
                                      </Grid>
                                      </Grid>
                                      {
                                        loginError ? <p className='error-note'>{loginErrorNote}</p>:null
                                      }
                                      <div className='action-buttons'>
                                       <DialogActions sx={{ justifyContent: "space-between",marginTop:'10px' }}>
                                           <Button   type='success' color="secondary" variant="contained"  disabled={!isValid} >Login</Button>
                                       </DialogActions>
                                   </div>
                               </Form>
                           </>
                       )
                   }}
               </Formik>
           </Grid>
           <div style={{ display: "flex" ,alignItems:"center", gap: "2rem"  }}>

                <Typography component={Link} 
                to="/forgot-password"> 
                        Forgot password ?
                </Typography>
                </div>
            </Paper>
        </Grid>
    )
}

// import React, { useEffect, useState, useRef } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useLocation, useNavigate,Link, Navigate } from 'react-router-dom';
// import { Grid, Button, DialogActions, InputAdornment, IconButton, Paper,Avatar,Typography,TextField, colors} from "@mui/material";
// import axios from 'axios'
// import '../recordDetailPage/Form.css'
// import Cdlogo from '../assets/cdlogo.jpg';
// import { RequestServer } from "../api/HttpReq";

// const loginUrl = `${process.env.REACT_APP_SERVER_URL}/signin`;
// const urlPermission =`${process.env.REACT_APP_SERVER_URL}/sendRolePermission`

// // const loginUrl ='http://localhost:80/api/signin';

// export default function LoginIndex({onAuthentication}) {

//     console.log(process.env.REACT_APP_SERVER_URL,"REACT_APP_SERVER_URL")



//     const paperStyle={padding :20,height:'100%',width:280, margin:"20px auto"}
//     const avatarStyle={   width: 100,height: 100}
//     const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
//     const [showPassword, setShowPassword] = useState(false);

//     const[signInCredential,setSignInCredential]=useState(false)
//     const[signInData,setSignInData]=useState()
//     const users ={userName:'suresh@gmail.com',password:'123456'}
//     // const [authenticated, setauthenticated] = useState(sessionStorage.getItem(sessionStorage.getItem("authenticated")|| false));
//     const[loginError,setLoginError]=useState(false)
//     const[loginErrorNote,setLoginErrorNote]=useState()

//     const navigate=useNavigate()

//     const initialValues = {
//         userName: '',
//         password: '',
//     }

//     const validationSchema = Yup.object({
//         userName: Yup
//             .string()
//             .email()
//             .required('Required'),
//         password: Yup
//             .string()
//             .min(6,"Minimum 6 characters exist")
//             .max(15,"Maximum 15 characters exist")
//             .required('Required')
//         ,
//     })

//     const formSubmission = async (values, { resetForm }) => {
//         console.log('inside form Submission', values);
//         axios.post(loginUrl,values)
//         .then((res)=>{
//             console.log(res.data,"login api res")
//             res.data.status ==='success' ?setSignInCredential(true) :setSignInCredential(false)
           
//             setSignInData(res.data)
//             if(res.data.status==='success'){
//                 let obj ={
//                     userId:res.data.userDetails[0]._id,
//                     userName:res.data.userDetails[0].userName,
//                     userFullName:res.data.userDetails[0].firstName +' '+ res.data.userDetails[0].lastName,
//                     userRole:res.data.userDetails[0].roleDetails,
//                     userDepartment:res.data.userDetails[0].departmentName

//                 }
//                 sessionStorage.setItem('token',res.data.content)
//                 sessionStorage.setItem('loggedInUser',JSON.stringify(obj))
//                 getPermissions()
//                 // onAuthentication()
//                 // navigate("/test")
               
//             }
//             else if (res.data.status==='failure'){
//                 setLoginErrorNote('Invalid Username or Password')
//                 setLoginError(true)
//                 onAuthentication()
//             }

//         })
//         .catch((error)=>{
//             console.log(error,"error")
//         })       
//     }

//     const getPermissions=()=>{
//         console.log("inside getPermissions login")
//         // RequestServer("post", urlPermission, null, {})
//         axios.post(urlPermission)
//         .then((res) => {
//           console.log("urlPermission INDEX page", res)
//           if (res.success) {
//             console.log(JSON.parse(res.data[0].permissionSets),"url permissions")
//             sessionStorage.setItem('userPermissions',(res.data[0].permissionSets))
//             onAuthentication()
//           }
//           else {
            
//             console.log(res.error.message)
//           }
//         })
//         .catch((err) => {
//           console.log(err.message,"ERROR")
//         })
//     }

//     return(
//         <Grid>
//             <Paper elevation={10} style={paperStyle}>
//                 <Grid align='center'>
//                      <Avatar style={avatarStyle}>
//                      <img src={Cdlogo} alt="cdlogo"  style={avatarStyle}/>
//                      </Avatar>
//                     <h2>Sign In</h2>
//                 </Grid>
//                 <Grid item xs={12} style={{ margin: "20px" }}>
               
//                <Formik
//                    initialValues={initialValues}
//                    validationSchema={validationSchema}
//                    onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
//                >
//                    {(props) => {
//                        const{isValid,values,setFieldValue}=props;
//                        return (
//                            <>
//                                <Form >
//                                    <Grid container spacing={2}>
//                                        <Grid item xs={12} md={12}>
//                                            <label htmlFor="userName">User Name  <span className="text-danger">*</span></label>
//                                            <Field name="userName" type="email" class="login-form-input"
//                                             onChange={(e)=>{
//                                                 setFieldValue("userName",e.target.value)
//                                                 if(e.target.value.length>0){
//                                                     setLoginError(false)
//                                                 }
//                                             }}
//                                              />
//                                            <div style={{ color: 'red' }}>
//                                                <ErrorMessage name="userName" />
//                                            </div>
//                                        </Grid>
//                                        <Grid item xs={12} md={12}>
//                                             <label htmlFor="password">Password <span className="text-danger">*</span> </label>
//                                             <Field name="password"  type='password' class="login-form-input"
//                                             onChange={(e)=>{ 
//                                                 setFieldValue("password",e.target.value)
//                                             if(e.target.value.length>0){
//                                                 setLoginError(false)
//                                             }
//                                             }}/>
//                                             <div style={{ color: 'red' }}>
//                                                 <ErrorMessage name="password" />
//                                             </div>
//                                       </Grid>
//                                       </Grid>
//                                       {
//                                         loginError ? <p className='error-note'>{loginErrorNote}</p>:null
//                                       }
//                                       <div className='action-buttons'>
//                                        <DialogActions sx={{ justifyContent: "space-between",marginTop:'10px' }}>
//                                            <Button   type='success' color="secondary" variant="contained"  disabled={!isValid} >Login</Button>
//                                        </DialogActions>
//                                    </div>
//                                </Form>
//                            </>
//                        )
//                    }}
//                </Formik>
//            </Grid>
//            <div style={{ display: "flex" ,alignItems:"center", gap: "2rem"  }}>

//                 <Typography component={Link} 
//                 to="/forgot-password"> 
//                         Forgot password ?
//                 </Typography>
//                 {/* <Typography component={Link} 
//                 to="/sign-up"> 
//                         Sign Up
//                 </Typography> */}
//                 </div>
//             </Paper>
//         </Grid>
//     )
// }
