import React, { useEffect, useState, useRef } from "react";
import {
    Button, Typography, Box
} from "@mui/material";
import ToastNotification from "../toast/ToastNotification";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { POST_FILE } from "../api/endUrls";
import { RequestServerFiles } from "../api/HttpReqFiles";
import { apiMethods } from "../api/methods";
import './FileModal.css'

const URL_postRecords = `/files`

const ModalTaskFileUpload = ({record, handleModal }) => {

    console.log(record,"record ModalTaskFileUpload")

    const [notify, setNotify] = useState({ isOpen: false, message: "", type: "", });

    const [fileUploadRes, setFileUploadResponse] = useState();
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileInputChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
    };

    const handleUploadButtonClick = () => {
        const formData = new FormData();
        let dateSeconds = new Date().getTime();
        let userDetails = (sessionStorage.getItem("loggedInUser"))
        let relatedObj ={id:record.taskId,object:record.OBJECT_API}
        console.log(relatedObj,"relatedObj")
        selectedFiles.forEach((file) => {
            formData.append("file", file);
            formData.append("relatedTo",JSON.stringify(relatedObj));
            formData.append("createdDate", dateSeconds)
            formData.append("modifiedDate", dateSeconds)
            formData.append("createdBy", JSON.stringify(userDetails))
            formData.append("modifiedBy", JSON.stringify(userDetails))
        });
        console.log("selected files :", selectedFiles);

        RequestServerFiles(apiMethods.post, URL_postRecords, formData)
            .then(res => {
                console.log("RequestServerFiles response", res)
                if (res.success) {
                    console.log("file Submission  response", res);
                    setFileUploadResponse(res.data);
                    setSelectedFiles([]);
                    setNotify({
                        isOpen: true,
                        message: "file Uploaded successfully",
                        type: "success",
                    });
                }else{
                    console.log("RequestServer file then error",res.error.message)
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: "error",
                    });
                }                
            })
            .catch((error)=>{
                console.log('RequestServer file form Submission  error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: "error",
                });
            })
            .finally(()=>{
                setTimeout(()=>{
                    handleModal()
                },2000)
                
            })
    };

    const handleClearInput = () => {
        setSelectedFiles([]);
        document.getElementById("images").value = "";
    };



    
      

    return (
        <>
            <ToastNotification notify={notify} setNotify={setNotify} />
            <Box sx={{ height: "500px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "285px" }}>
                <Typography variant="h4">Upload Files</Typography>
                <label htmlFor="images" className="input-drop-container">
                    <input
                        className="file-upload-input"
                        accept=".jpeg, .pdf, .png, .csv, .xlsx, .doc"
                        sx={{ cursor: "pointer" }}
                        id="images"
                        type="file"
                        multiple
                        onChange={handleFileInputChange}
                    />
                </label>


                <Box
                    sx={{
                        display: "flex",
                        width: "350px",
                        justifyContent: "center",
                        gap: "5px"
                    }}
                >
                    <Button
                        sx={{ marginTop: "10px" }}
                        type="success"
                        variant="contained"
                        color="secondary"
                        onClick={handleUploadButtonClick}
                        startIcon={<FileUploadIcon />}
                    >
                        Upload
                    </Button>
                    <Button
                        type="reset"
                        variant="outlined"
                        sx={{
                            marginTop: "10px",
                            color: "black",
                            backgroundColor: "whitesmoke",
                        }}
                        onClick={() => handleClearInput()}
                        startIcon={<ClearAllIcon />}
                    >
                        Clear
                    </Button>
                </Box>

            </Box>
        </>
    );

};
export default ModalTaskFileUpload;