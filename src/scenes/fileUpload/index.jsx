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
import Iframe from 'react-iframe'

import ToastNotification from "../toast/ToastNotification";
// import download from 'downloadjs';
// import { saveAs } from 'file-saver'
// import fileDownload from "js-file-download";

const UpsertUrl = `${process.env.REACT_APP_SERVER_URL}/uploadfile`; 
const urlFiles =`${process.env.REACT_APP_SERVER_URL}/files`
const urlDownloadFiles =  `${process.env.REACT_APP_SERVER_URL}/download?searchKey=`



const DropFileInput = () => {

    const [filesList,setFileList] =useState([])
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    //iframe 
    const[showIframe,setShowIframe] =useState(false)
    const[filepath,setFilePath]=useState()

    // file upload response
    const[fileUploadRes,setFileUploadResponse]= useState()
    console.log('fileUploadRes',fileUploadRes)
    useEffect(() => {

        getFilesList();
console.log('fileUploadRes',fileUploadRes)
       
    }, [])

    const getFilesList =async ()=>{
        // const {data} =await axios.get(urlFiles)
        // setFileList(data);
        await axios.post(urlFiles) 
    
            .then((res) => {
                console.log('get file list', res);
                if(typeof(res.data) !=='string'){
                    setFileList(res.data);
                }
                else{
                    
                setFileList([]);
                }
            })
            .catch((error) => {
                console.log('get file list error', error);
            })
    }

 


    const initialValues = {
       name:'',
       email:'',
       photo:null,
    }




     const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
      

        let formData = new FormData();
        // formData.append('name',values.name);
        // formData.append('email',values.email);
        formData.append('file',values.photo);


        await axios.post(UpsertUrl, formData ,{
            headers:{'Content-Type':'multipart/form-data'}
        }) 
    
            .then((res) => {
                console.log('file Submission  response', res);
                 setFileUploadResponse(res.data)
                // setFileUploadResponse(old => [...old, res.data]);
                setNotify({
                    isOpen: true,
                    message: res.data.insertedId,
                    type: 'success'
                })            
            })
            .catch((error) => {
                console.log('file  Submission  error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
            })
    }

    // const redirect =(item) =>{
    //     console.log('inside reirect',item);
        
    // //  <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' />

    //         //  <iframe src= 'https://www.youtube.com/watch?v=tATzWMBoRbI&t=42s' width="540" height="450"></iframe>


    //                                  <Iframe
    //                                                 url ='https://www.youtube.com/'
    //                                                 width="640px"
    //                                                 height="320px"
    //                                                 id={item._id}
    //                                                 className=""
    //                                                 display="block"
    //                                                 position="relative"
    //                                             /> 

                                              
                                     
    // }

    // const iframeFn =()=>{
    //     setShowIframe(!showIframe)
    // }
   
    // const handleClick =()=>{
    //     console.log('test');
    // }
   
    // <iframe src="https://www.youtube.com/embed/s4BibernJxU"></iframe>

    const hanlePreview=()=>{
        console.log('inside hanlePreview')       
        return <div style={{position: "fixed", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.5)"}}>
           <iframe 
            src={`${fileUploadRes}`} 
            width='100%' height='1000%'
            embedded='true'
            allowfullscreen 
    ></iframe>
      </div>
    }


    return (
        <>
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>File Uploader</h3>                 
            </div>

            <Formik
                initialValues={initialValues}
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
                                <ToastNotification notify={notify} setNotify={setNotify} />

                            <Form>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={12}>

                                        <label htmlFor="file">file</label>
                                        
                                        <Field id="file" name="file" type="file" 
                                        className="form-input"
                                        onChange={(event)=>{
                                            setFieldValue("photo", (event.currentTarget.files[0]));
                                        }} 
                                        />
                                      
                                    </Grid>
                                 </Grid>

                                <div className='action-buttons'>
                                    <DialogActions sx={{ justifyContent: "space-between" }}>
                                        <Button type='success' variant="contained" color="secondary"disabled={isSubmitting}>Save</Button>
                                    </DialogActions>
                                </div>
                            </Form>
                            
                        </>
                    )
                }}
            </Formik>
                <Button onClick={hanlePreview} >View File</Button>
            
            <iframe 
                    src={`${fileUploadRes}`} 
                    width='100%' height='1000%'
                    embedded='true'
                    allowfullscreen 
            ></iframe>
         
            </Grid>
            {/* <button onclick={handleClick}>
                                    btn
                                </button>
            <button onClick={iframeFn}>
                                    iframe test
                                </button>

                                {
                                    showIframe && 
                                    // <iframe src="http://localhost:4000/2022-12-30T09-11-59.094Z-datcrmcsv.csv"></iframe>
                                     <iframe src="https://www.youtube.com/embed/s4BibernJxU"></iframe>
                                }

                               
                                
        </Grid>


     

        {filesList.length > 0 ? (
            filesList.map(
              (item) => (
                <tr key={item._id}>
                  
                  <td >
                       <a href="#"
                    
                      onClick={(item) =>
                        {

                            console.log('item',item)

                        
                        }
                      }
                    >
                      Download
                      </a>
                  </td>
                      <td>

                      <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=http://localhost:4000/2023-02-20T04-53-45.338Z-sample.pdf`} width='100%' height='1000%' frameborder='0'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.</iframe>

        
                      </td>

                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={3} style={{ fontWeight: '300' }}>
                No files found. Please add some.
              </td>
            </tr>
          )} */}
        </>
    )

}
export default DropFileInput



// import React, { useRef, useState } from 'react';
// import PropTypes from 'prop-types';
// import './index.css';
// import { ImageConfig } from './ImageConfig'
//  import uploadImage from '../assets/cloud-upload-regular-240.png'

// const DropFileInput = props => {

//     const wrapperRef = useRef(null);

//     const [fileList, setFileList] = useState([]);

//     const onDragEnter = () => wrapperRef.current.classList.add('dragover');

//     const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

//     const onDrop = () => wrapperRef.current.classList.remove('dragover');

//     const onFileDrop = (e) => {
//         const newFile = e.target.files[0];
//         if (newFile) {
//             const updatedList = [...fileList, newFile];
//             setFileList(updatedList);
//             props.onFileChange(updatedList);
//         }
//     }

//     const fileRemove = (file) => {
//         const updatedList = [...fileList];
//         updatedList.splice(fileList.indexOf(file), 1);
//         setFileList(updatedList);
//         props.onFileChange(updatedList);
//     }

//     return (
//         <>
//             <div
//                 ref={wrapperRef}
//                 className="drop-file-input"
//                 onDragEnter={onDragEnter}
//                 onDragLeave={onDragLeave}
//                 onDrop={onDrop}
//             >
//                 <div className="drop-file-input__label">
//                     <img src={uploadImage} alt="" />
//                     <p>Drag & Drop your files here</p>
//                 </div>
//                 <input type="file" value="" onChange={onFileDrop} />
//             </div>
//             {
//                 fileList.length > 0 ? (
//                     <div className="drop-file-preview">
//                         <p className="drop-file-preview__title">
//                             Ready to upload
//                         </p>
//                         {
//                             fileList.map((item, index) => (
//                                 <div key={index} className="drop-file-preview__item">
//                                     <img src={ImageConfig[item.type.split('/')[1]] || ImageConfig['default']} alt="" />
//                                     <div className="drop-file-preview__item__info">
//                                         <p>{item.name}</p>
//                                         <p>{item.size}B</p>
//                                     </div>
//                                     <span className="drop-file-preview__item__del" onClick={() => fileRemove(item)}>x</span>
//                                 </div>
//                             ))
//                         }
//                     </div>
//                 ) : null
//             }
//         </>
//     );
// }

// DropFileInput.propTypes = {
//     onFileChange: PropTypes.func
// }

// export default DropFileInput;