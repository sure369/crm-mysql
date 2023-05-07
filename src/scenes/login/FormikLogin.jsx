import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Button, DialogActions, InputAdornment, IconButton, TextField} from "@mui/material";
import '../recordDetailPage/Form.css'
import ToastNotification from "../toast/ToastNotification";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const urlLogin = `${process.env.REACT_APP_SERVER_URL}/login`

const FormikLogin = () => {

    const navigate = useNavigate();
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [showPassword, setShowPassword] = useState(false);

    const initialValues = {        userName: '',        password: '',    }

    const validationSchema = Yup.object({
        userName: Yup            .string()            .email()            .required('Required'),
        password: Yup            .string()            .required('Required'),
    })

    const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);      
    }

    const handleFormClose =()=>{
        console.log('inside form close')
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <Grid item xs={12} style={{ margin: "20px" }}>
               
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
                >
                    {(props) => {
                        const{isValid,values}=props;
                        return (
                            <>
                                <Form >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={12}>
                                            <label htmlFor="userName">User Name  <span className="text-danger">*</span></label>
                                            <Field name="userName" type="email" class="login-form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="userName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                             <label htmlFor="password">Password <span className="text-danger">*</span> </label>
                                             <Field name="password" class="login-form-input">
                                                {({ field, form, meta }) => (
                                                    <TextField
                                                        type={showPassword ? "text" : "password"}
                                                        variant="standard"
                                                        class="login-form-input"
                                                        {...field}
                                                        InputProps={{
                                                            disableUnderline: true,
                                                            textAlign: 'center',
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                    >
                                                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                             <div style={{ color: 'red' }}>
                                                 <ErrorMessage name="password" />
                                             </div>
                                       </Grid>
                                       </Grid>
                                       <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>
                                            <Button type='success' variant="contained" color="secondary" disabled={!isValid} >Login</Button>
                                        </DialogActions>
                                    </div>
                                </Form>
                            </>
                        )
                    }}
                </Formik>
            </Grid>
            <ToastNotification notify={notify} setNotify={setNotify} />
        </>
    )
}
export default FormikLogin



