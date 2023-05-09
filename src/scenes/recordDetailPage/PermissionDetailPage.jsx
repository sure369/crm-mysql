import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import {
    Grid, Button, DialogActions,
    Autocomplete, Accordion, AccordionSummary, AccordionDetails
    , Typography, MenuItem, TextField
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams, useNavigate } from "react-router-dom"
import ToastNotification from '../toast/ToastNotification';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import './Form.css'
import { PermissionSavedValues, PermissionSetInitialValues } from '../formik/InitialValues/formValues';
import { RolesDepartment } from '../../data/pickLists';
import { RequestServer } from '../api/HttpReq';

const upsertUrl = `/upsertPermission`;
const urlgetUsersByName = `/getUsers`;
const urlgetRolesByDept = `/roles`
const urlgetTbaleNames =`/getObject`

const PermissiionSetForm = ({ item }) => {

    const [singlePermission, setsinglePermission] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    const [roleRecordsByDept, setRoleRecordsByDept] = useState([])
    const [objTableName,setObjTableName]=useState([])

    useEffect(() => {
        console.log('passed record', location.state.record.item);

        setsinglePermission(location.state?.record?.item ?? {});
        setshowNew(!location.state.record.item)
        fetchTableNames()
    }, [])


    const fetchTableNames=()=>{
        RequestServer(urlgetTbaleNames)
        .then(res=>{
            if(res.success){
                console.log(res.data,"urlgetTbaleNames then res")
                const tableName = res.data.map(i=>{
                    return i.Tables_in_crm.charAt(0).toUpperCase() + i.Tables_in_crm.slice(1)
                })
                console.log(tableName,"table Name")
                setObjTableName(tableName)
            }else{
                console.log(res.error,"urlgetTbaleNames then error")
            }
        })
        .catch(error=>{
            console.log(error,"urlgetTbaleNames catch")
        })
    }

    const initialValues = PermissionSetInitialValues
    initialValues.permissionSets=objTableName.map(i=>{
        return {object:i, permissions: {
          read: false,
          create: false,
          edit: false,
          delete: false,
        }, permissionLevel: 0,}
    })
    const savedValues = PermissionSavedValues(singlePermission)

    console.log(initialValues,"initialValues")
    console.log(savedValues,"savedValues")

    const validationSchema = Yup.object({
        permissionName: Yup
            .string()
            .required('Required'),
    })

    const formSubmission = (values) => {

        console.log('form submission value', values);
        // console.log(values.permissionSets, "values.permissionSets")

        const convertValue = [...values.permissionSets]
        convertValue.forEach(obj => {
            let permissionLevel = 
                (obj.permissions.read ? 1 : 0) +
                (obj.permissions.create ? 2 : 0) +
                (obj.permissions.edit ? 3 : 0) +
                (obj.permissions.delete ? 4 : 0);

            obj.permissionLevel = permissionLevel;

        })

        values.permissionSets = convertValue;

        // console.log(convertValue, "convertValue")

        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()
        values.roleDetails = JSON.stringify(values.roleDetails)
        values.permissionSets = JSON.stringify(values.permissionSets)
        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.createdBy = (sessionStorage.getItem("loggedInUser"));
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
            delete values.userDetails;

        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec;
            values.createdBy = singlePermission.createdBy;
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
            delete values.userDetails;
        }
        console.log('after change form submission value', values);


        RequestServer(upsertUrl, values)
            .then((res) => {
                console.log(res, "res")
                if(res.success){
                    setNotify({
                        isOpen: true,
                        message: res.data,
                        type: 'success'
                    })
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000) 
                }else{
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: 'error'
                    })
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000) 
                }                                   
            })
            .catch((err) => {
                console.log(err, "err")
                setNotify({
                    isOpen: true,
                    message: err.message,
                    type: 'error'
                })
                setTimeout(() => {
                    navigate(-1);
                }, 2000) 
            })
    }



    const handleFormClose = () => {
        navigate(-1)
    }

    const FetchRolesbyName = (dpt, inputValue) => {
        console.log(dpt, "dpt")
        console.log(inputValue, 'inputValue')
        let payloadObj = { departmentName: dpt, role: inputValue }

        RequestServer(urlgetRolesByDept, payloadObj)
            .then((res) => {
                console.log(res, "urlgetRolesByDept res")
                if(res.success){
                    setRoleRecordsByDept(res.data)
                }else{
                    console.log("urlgetRolesByDept status error",res.error.message)
                }                
            })
            .catch((error) => {
                console.log("error urlgetRolesByDept",error)
            })

        // let payloadObj ={department:dpt,value:inputValue}
        // RequestServer("post",urlgetRolesByDept,null,payloadObj)
        // .then(res=>{
        //     if(res.success){
        //         console.log(res.success,"success")
        //     }else{
        //         console.log(res.error.message,"error")
        //     }
        // })
        // .catch((error)=>{
        //     console.log(error.message,"error")
        // })

    }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h3>New Permission Set</h3> : <h3>Permission Set Detail Page </h3>
                }
            </div>
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={showNew ? initialValues : savedValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => { formSubmission(values) }}
                >
                   {(props) => {
                        const {values,dirty, isSubmitting, handleChange,handleSubmit,handleReset,setFieldValue,errors,touched,} = props;

                        return (
                            <>
                                <ToastNotification notify={notify} setNotify={setNotify} />
                                <Form className='my-form'>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="permissionName">Permission Set Name</label>
                                            <Field type="text" id="permissionName" name="permissionName" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="department">Department</label>
                                            <Field name="department"
                                                component={CustomizedSelectForFormik}
                                                className="form-customSelect"
                                                onChange={(e) => {
                                                    console.log(e.target.value, "event")
                                                    let dpt = e.target.value
                                                    if (dpt.length > 0) {
                                                        FetchRolesbyName(dpt, null)
                                                    } else {
                                                        setRoleRecordsByDept([])
                                                    }
                                                }}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    RolesDepartment.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="roles">Roles</label>
                                            <Autocomplete
                                                name="roleDetails"
                                                options={roleRecordsByDept}
                                                value={values.roleDetails}
                                                getOptionLabel={option => option.roleName || ""}
                                                onChange={(e, value) => {
                                                    if (!value) {
                                                        console.log("!value", value)
                                                        setFieldValue("roleDetails", "")
                                                    } else {
                                                        setFieldValue("roleDetails", value)
                                                        console.log("value", value)
                                                    }
                                                }}
                                                onInputChange={(e, newInputValue) => {
                                                    if (values.department) {
                                                        console.log(values.department, "if")
                                                        FetchRolesbyName(values.department, newInputValue)
                                                    }
                                                    else {
                                                        console.log(values.department, "else ")
                                                    }
                                                }}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="roleDetails" />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Accordion>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography variant='h4' className="accordion-Header">Permission Sets</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>

                                                    <FieldArray name="permissionSets">
                                                        {({ remove, push }) => (
                                                            <>
                                                                {
                                                               Array.isArray(values.permissionSets) && values.permissionSets.length > 0 &&
                                                               
                                                                    values.permissionSets.map((obj, index) => (
                                                                        <div key={index} style={{ margin: '5px' }}>
                                                                            <Grid container spacing={2} alignItems="center">
                                                                                <Grid item xs={4} md={4}>
                                                                                    <h3>{obj.object}</h3>
                                                                                </Grid>
                                                                                <Grid item xs={8} md={8}>
                                                                                    <Grid container spacing={2} alignItems="center">
                                                                                        <Grid item xs={3} md={3}>
                                                                                            <label htmlFor={`permissionSets.${index}.permissions.read`} className="checkbox-label">
                                                                                                Read
                                                                                            </label>
                                                                                            <Field
                                                                                                type="checkbox"
                                                                                                id={`permissionSets.${index}.permissions.read`}
                                                                                                name={`permissionSets.${index}.permissions.read`}
                                                                                                onChange={(e) => {
                                                                                                    if (e.target.checked) {
                                                                                                        console.log(e.target.checked, "if")
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.read`, e.target.value)
                                                                                                    } else {
                                                                                                        console.log(e.target.checked, "else")
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.read`, !e.target.value)
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.create`, !e.target.value)
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.edit`, !e.target.value)
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.delete`, !e.target.value)
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                        <Grid item xs={3} md={3}>
                                                                                            <label htmlFor={`permissionSets.${index}.permissions.create`} className="checkbox-label">
                                                                                                Create
                                                                                            </label>
                                                                                            <Field
                                                                                                type="checkbox"
                                                                                                id={`permissionSets.${index}.permissions.create`}
                                                                                                name={`permissionSets.${index}.permissions.create`}
                                                                                                onChange={(e) => {
                                                                                                    if (e.target.checked) {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.create`, e.target.checked);
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.read`, e.target.checked);
                                                                                                    } else {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.create`, e.target.checked);
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        </Grid>

                                                                                        <Grid item xs={3} md={3}>
                                                                                            <label htmlFor={`permissionSets.${index}.permissions.edit`} className="checkbox-label">
                                                                                                Edit
                                                                                            </label>
                                                                                            <Field
                                                                                                type="checkbox"
                                                                                                id={`permissionSets.${index}.permissions.edit`}
                                                                                                name={`permissionSets.${index}.permissions.edit`}
                                                                                                onChange={(e) => {
                                                                                                    if (e.target.checked) {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.read`, e.target.checked);
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.edit`, e.target.checked);
                                                                                                    } else {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.edit`, e.target.checked);
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.delete`, e.target.checked)
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                        <Grid item xs={3} md={3}>
                                                                                            <label htmlFor={`permissionSets.${index}.permissions.delete`} className="checkbox-label">
                                                                                                Delete
                                                                                            </label>
                                                                                            <Field
                                                                                                type="checkbox"
                                                                                                id={`permissionSets.${index}.permissions.delete`}
                                                                                                name={`permissionSets.${index}.permissions.delete`}
                                                                                                onChange={(e) => {
                                                                                                    console.log(e.target.checked, "checkbox")
                                                                                                    if (e.target.checked) {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.read`, e.target.checked);
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.edit`, e.target.checked);
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.delete`, e.target.checked);
                                                                                                    }
                                                                                                    else {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.delete`, e.target.checked);
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </div>
                                                                    ))}
                                                            </>
                                                        )}
                                                    </FieldArray>

                                                </AccordionDetails>
                                            </Accordion>
                                        </Grid>
                                        {!showNew && (
                                            <>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="createdDate" >Created Date</label>
                                                    <Field name='createdDate' type="text" class="form-input" disabled />
                                                </Grid>

                                                <Grid item xs={6} md={6}>
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
                                            <Button type="reset" variant="contained" onClick={handleFormClose}   >Cancel</Button>
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
export default PermissiionSetForm;




// import React, { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom';
// import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
// import * as Yup from "yup";
// import {
//     Grid, Button, DialogActions,
//     Autocomplete, Accordion, AccordionSummary, AccordionDetails
//     , Typography, MenuItem, TextField
// } from "@mui/material";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { useParams, useNavigate } from "react-router-dom"
// import ToastNotification from '../toast/ToastNotification';
// import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
// import './Form.css'
// import { PermissionSavedValues, PermissionSetInitialValues } from '../formik/InitialValues/formValues';
// import { RolesDepartment } from '../../data/pickLists';
// import { RequestServer } from '../api/HttpReq';

// const upsertUrl = `/upsertPermission`;
// const urlgetUsersByName = `/getUsers`;
// const urlgetRolesByDept = `/roles`
// const urlgetTbaleNames =`/getObject`

// const PermissiionSetForm = ({ item }) => {

//     const [singlePermission, setsinglePermission] = useState();
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [showNew, setshowNew] = useState()
//     const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

//     const [roleRecordsByDept, setRoleRecordsByDept] = useState([])
//     const [objTableName,setObjTableName]=useState([])

//     useEffect(() => {
//         console.log('passed record', location.state.record.item);

//         setsinglePermission(location.state?.record?.item ?? {});
//         setshowNew(!location.state.record.item)
//         fetchTableNames()
//     }, [])


//     const fetchTableNames=()=>{
//         RequestServer(urlgetTbaleNames)
//         .then(res=>{
//             if(res.success){
//                 console.log(res.data,"urlgetTbaleNames then res")
//                 const tableName = res.data.map(i=>{
//                     return i.Tables_in_crm.charAt(0).toUpperCase() + i.Tables_in_crm.slice(1)
//                 })
//                 console.log(tableName,"table Name")
//                 setObjTableName(tableName)
//             }else{
//                 console.log(res.error,"urlgetTbaleNames then error")
//             }
//         })
//         .catch(error=>{
//             console.log(error,"urlgetTbaleNames catch")
//         })
//     }

//     const initialValues = PermissionSetInitialValues
//     const savedValues = PermissionSavedValues(singlePermission)


//     console.log(savedValues,"savedValues")

//     const validationSchema = Yup.object({
//         permissionName: Yup
//             .string()
//             .required('Required'),
//     })

//     const formSubmission = (values) => {

//         console.log('form submission value', values);
//         // console.log(values.permissionSets, "values.permissionSets")

//         const convertValue = [...values.permissionSets]
//         convertValue.forEach(obj => {
//             let permissionLevel = 
//                 (obj.permissions.read ? 1 : 0) +
//                 (obj.permissions.create ? 2 : 0) +
//                 (obj.permissions.edit ? 3 : 0) +
//                 (obj.permissions.delete ? 4 : 0);

//             obj.permissionLevel = permissionLevel;

//         })

//         values.permissionSets = convertValue;

//         // console.log(convertValue, "convertValue")

//         let dateSeconds = new Date().getTime();
//         let createDateSec = new Date(values.createdDate).getTime()
//         values.roleDetails = JSON.stringify(values.roleDetails)
//         values.permissionSets = JSON.stringify(values.permissionSets)
//         if (showNew) {
//             values.modifiedDate = dateSeconds;
//             values.createdDate = dateSeconds;
//             values.createdBy = (sessionStorage.getItem("loggedInUser"));
//             values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
//             delete values.userDetails;

//         }
//         else if (!showNew) {
//             values.modifiedDate = dateSeconds;
//             values.createdDate = createDateSec;
//             values.createdBy = singlePermission.createdBy;
//             values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
//             delete values.userDetails;
//         }
//         console.log('after change form submission value', values);


//         RequestServer(upsertUrl, values)
//             .then((res) => {
//                 console.log(res, "res")
//                 if(res.success){
//                     setNotify({
//                         isOpen: true,
//                         message: res.data,
//                         type: 'success'
//                     })
//                     setTimeout(() => {
//                         navigate(-1);
//                     }, 2000) 
//                 }else{
//                     setNotify({
//                         isOpen: true,
//                         message: res.error.message,
//                         type: 'error'
//                     })
//                     setTimeout(() => {
//                         navigate(-1);
//                     }, 2000) 
//                 }                                   
//             })
//             .catch((err) => {
//                 console.log(err, "err")
//                 setNotify({
//                     isOpen: true,
//                     message: err.message,
//                     type: 'error'
//                 })
//                 setTimeout(() => {
//                     navigate(-1);
//                 }, 2000) 
//             })
//     }



//     const handleFormClose = () => {
//         navigate(-1)
//     }

//     const FetchRolesbyName = (dpt, inputValue) => {
//         console.log(dpt, "dpt")
//         console.log(inputValue, 'inputValue')
//         let payloadObj = { departmentName: dpt, role: inputValue }

//         RequestServer(urlgetRolesByDept, payloadObj)
//             .then((res) => {
//                 console.log(res, "urlgetRolesByDept res")
//                 if(res.success){
//                     setRoleRecordsByDept(res.data)
//                 }else{
//                     console.log("urlgetRolesByDept status error",res.error.message)
//                 }                
//             })
//             .catch((error) => {
//                 console.log("error urlgetRolesByDept",error)
//             })

//         // let payloadObj ={department:dpt,value:inputValue}
//         // RequestServer("post",urlgetRolesByDept,null,payloadObj)
//         // .then(res=>{
//         //     if(res.success){
//         //         console.log(res.success,"success")
//         //     }else{
//         //         console.log(res.error.message,"error")
//         //     }
//         // })
//         // .catch((error)=>{
//         //     console.log(error.message,"error")
//         // })

//     }

//     return (
//         <Grid item xs={12} style={{ margin: "20px" }}>
//             <div style={{ textAlign: "center", marginBottom: "10px" }}>
//                 {
//                     showNew ? <h3>New Permission Set</h3> : <h3>Permission Set Detail Page </h3>
//                 }
//             </div>
//             <div>
//                 <Formik
//                     enableReinitialize={true}
//                     initialValues={showNew ? initialValues : savedValues}
//                     validationSchema={validationSchema}
//                     onSubmit={(values) => { formSubmission(values) }}
//                 >
//                    {(props) => {
//                         const {values,dirty, isSubmitting, handleChange,handleSubmit,handleReset,setFieldValue,errors,touched,} = props;

//                         return (
//                             <>
//                                 <ToastNotification notify={notify} setNotify={setNotify} />
//                                 <Form className='my-form'>
//                                     <Grid container spacing={2}>
//                                         <Grid item xs={6} md={6}>
//                                             <label htmlFor="permissionName">Permission Set Name</label>
//                                             <Field type="text" id="permissionName" name="permissionName" class="form-input" />
//                                         </Grid>
//                                         <Grid item xs={6} md={6}>
//                                             <label htmlFor="department">Department</label>
//                                             <Field name="department"
//                                                 component={CustomizedSelectForFormik}
//                                                 className="form-customSelect"
//                                                 onChange={(e) => {
//                                                     console.log(e.target.value, "event")
//                                                     let dpt = e.target.value
//                                                     if (dpt.length > 0) {
//                                                         FetchRolesbyName(dpt, null)
//                                                     } else {
//                                                         setRoleRecordsByDept([])
//                                                     }
//                                                 }}
//                                             >
//                                                 <MenuItem value=""><em>None</em></MenuItem>
//                                                 {
//                                                     RolesDepartment.map((i) => {
//                                                         return <MenuItem value={i.value}>{i.text}</MenuItem>
//                                                     })
//                                                 }
//                                             </Field>
//                                         </Grid>
//                                         <Grid item xs={6} md={6}>
//                                             <label htmlFor="roles">Roles</label>
//                                             <Autocomplete
//                                                 name="roleDetails"
//                                                 options={roleRecordsByDept}
//                                                 value={values.roleDetails}
//                                                 getOptionLabel={option => option.roleName || ""}
//                                                 onChange={(e, value) => {
//                                                     if (!value) {
//                                                         console.log("!value", value)
//                                                         setFieldValue("roleDetails", "")
//                                                     } else {
//                                                         setFieldValue("roleDetails", value)
//                                                         console.log("value", value)
//                                                     }
//                                                 }}
//                                                 onInputChange={(e, newInputValue) => {
//                                                     if (values.department) {
//                                                         console.log(values.department, "if")
//                                                         FetchRolesbyName(values.department, newInputValue)
//                                                     }
//                                                     else {
//                                                         console.log(values.department, "else ")
//                                                     }
//                                                 }}
//                                                 renderInput={params => (
//                                                     <Field component={TextField} {...params} name="roleDetails" />
//                                                 )}
//                                             />
//                                         </Grid>
//                                         <Grid item xs={12} md={12}>
//                                             <Accordion>
//                                                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                                                     <Typography variant='h4' className="accordion-Header">Permission Sets</Typography>
//                                                 </AccordionSummary>
//                                                 <AccordionDetails>

//                                                     <FieldArray name="permissionSets">
//                                                         {({ remove, push }) => (
//                                                             <>
//                                                                 {
//                                                                Array.isArray(values.permissionSets) && values.permissionSets.length > 0 &&
//                                                                     values.permissionSets.map((obj, index) => (
//                                                                         <div key={index} style={{ margin: '5px' }}>
//                                                                             <Grid container spacing={2} alignItems="center">
//                                                                                 <Grid item xs={4} md={4}>
//                                                                                     <h3>{obj.object}</h3>
//                                                                                 </Grid>
//                                                                                 <Grid item xs={8} md={8}>
//                                                                                     <Grid container spacing={2} alignItems="center">
//                                                                                         <Grid item xs={3} md={3}>
//                                                                                             <label htmlFor={`permissionSets.${index}.permissions.read`} className="checkbox-label">
//                                                                                                 Read
//                                                                                             </label>
//                                                                                             <Field
//                                                                                                 type="checkbox"
//                                                                                                 id={`permissionSets.${index}.permissions.read`}
//                                                                                                 name={`permissionSets.${index}.permissions.read`}
//                                                                                                 onChange={(e) => {
//                                                                                                     if (e.target.checked) {
//                                                                                                         console.log(e.target.checked, "if")
//                                                                                                         setFieldValue(`permissionSets.${index}.permissions.read`, e.target.value)
//                                                                                                     } else {
//                                                                                                         console.log(e.target.checked, "else")
//                                                                                                         setFieldValue(`permissionSets.${index}.permissions.read`, !e.target.value)
//                                                                                                         setFieldValue(`permissionSets.${index}.permissions.create`, !e.target.value)
//                                                                                                         setFieldValue(`permissionSets.${index}.permissions.edit`, !e.target.value)
//                                                                                                         setFieldValue(`permissionSets.${index}.permissions.delete`, !e.target.value)
//                                                                                                     }
//                                                                                                 }}
//                                                                                             />
//                                                                                         </Grid>
//                                                                                         <Grid item xs={3} md={3}>
//                                                                                             <label htmlFor={`permissionSets.${index}.permissions.create`} className="checkbox-label">
//                                                                                                 Create
//                                                                                             </label>
//                                                                                             <Field
//                                                                                                 type="checkbox"
//                                                                                                 id={`permissionSets.${index}.permissions.create`}
//                                                                                                 name={`permissionSets.${index}.permissions.create`}
//                                                                                                 onChange={(e) => {
//                                                                                                     if (e.target.checked) {
//                                                                                                         setFieldValue(`permissionSets.${index}.permissions.create`, e.target.checked);
//                                                                                                         setFieldValue(`permissionSets.${index}.permissions.read`, e.target.checked);
//                                                                                                     } else {
//                                                                                                         setFieldValue(`permissionSets.${index}.permissions.create`, e.target.checked);
//                                                                                                     }
//                                                                                                 }}
//                                                                                             />
//                                                                                         </Grid>

//                                                                                         <Grid item xs={3} md={3}>
//                                                                                             <label htmlFor={`permissionSets.${index}.permissions.edit`} className="checkbox-label">
//                                                                                                 Edit
//                                                                                             </label>
//                                                                                             <Field
//                                                                                                 type="checkbox"
//                                                                                                 id={`permissionSets.${index}.permissions.edit`}
//                                                                                                 name={`permissionSets.${index}.permissions.edit`}
//                                                                                                 onChange={(e) => {
//                                                                                                     if (e.target.checked) {
//                                                                                                         setFieldValue(`permissionSets.${index}.permissions.read`, e.target.checked);
//                                                                                                         setFieldValue(`permissionSets.${index}.permissions.edit`, e.target.checked);
//                                                                                                     } else {
//                                                                                                         setFieldValue(`permissionSets.${index}.permissions.edit`, e.target.checked);
//                                                                                                         setFieldValue(`permissionSets.${index}.permissions.delete`, e.target.checked)
//                                                                                                     }
//                                                                                                 }}
//                                                                                             />
//                                                                                         </Grid>
//                                                                                         <Grid item xs={3} md={3}>
//                                                                                             <label htmlFor={`permissionSets.${index}.permissions.delete`} className="checkbox-label">
//                                                                                                 Delete
//                                                                                             </label>
//                                                                                             <Field
//                                                                                                 type="checkbox"
//                                                                                                 id={`permissionSets.${index}.permissions.delete`}
//                                                                                                 name={`permissionSets.${index}.permissions.delete`}
//                                                                                                 onChange={(e) => {
//                                                                                                     console.log(e.target.checked, "checkbox")
//                                                                                                     if (e.target.checked) {
//                                                                                                         setFieldValue(`permissionSets.${index}.permissions.read`, e.target.checked);
//                                                                                                         setFieldValue(`permissionSets.${index}.permissions.edit`, e.target.checked);
//                                                                                                         setFieldValue(`permissionSets.${index}.permissions.delete`, e.target.checked);
//                                                                                                     }
//                                                                                                     else {
//                                                                                                         setFieldValue(`permissionSets.${index}.permissions.delete`, e.target.checked);
//                                                                                                     }
//                                                                                                 }}
//                                                                                             />
//                                                                                         </Grid>
//                                                                                     </Grid>
//                                                                                 </Grid>
//                                                                             </Grid>
//                                                                         </div>
//                                                                     ))}
//                                                             </>
//                                                         )}
//                                                     </FieldArray>

//                                                 </AccordionDetails>
//                                             </Accordion>
//                                         </Grid>
//                                         {!showNew && (
//                                             <>
//                                                 <Grid item xs={6} md={6}>
//                                                     <label htmlFor="createdDate" >Created Date</label>
//                                                     <Field name='createdDate' type="text" class="form-input" disabled />
//                                                 </Grid>

//                                                 <Grid item xs={6} md={6}>
//                                                     <label htmlFor="modifiedDate" >Modified Date</label>
//                                                     <Field name='modifiedDate' type="text" class="form-input" disabled />
//                                                 </Grid>
//                                             </>
//                                         )}
//                                     </Grid>
//                                     <div className='action-buttons'>
//                                         <DialogActions sx={{ justifyContent: "space-between" }}>
//                                             {
//                                                 showNew ?
//                                                     <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>
//                                                     :
//                                                     <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Update</Button>
//                                             }
//                                             <Button type="reset" variant="contained" onClick={handleFormClose}   >Cancel</Button>
//                                         </DialogActions>
//                                     </div>

//                                 </Form>
//                             </>
//                         )
//                     }}
//                 </Formik>
//             </div>
//         </Grid>
//     )
// }
// export default PermissiionSetForm;


