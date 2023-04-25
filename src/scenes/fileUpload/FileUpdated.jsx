import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
  Paper,
  Alert,
  AlertTitle,
} from "@mui/material";
import axios from "axios";
import "../formik/FormStyles.css";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ToastNotification from "../toast/ToastNotification";

const UpsertUrl = `${process.env.REACT_APP_SERVER_URL}/uploadfile`;
const urlFiles = `${process.env.REACT_APP_SERVER_URL}/files`;
const deleteUrl = `${process.env.REACT_APP_SERVER_URL}/deletefile?code=`;

const FileUploadUpdated = () => {
  const [filesList, setFileList] = useState([]);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  // file upload response
  const [fileUploadRes, setFileUploadResponse] = useState();
  console.log("fileUploadRes", fileUploadRes);

  const [selectedFiles, setSelectedFiles] = useState([]);
  useEffect(() => {
    getFilesList();
    console.log("fileUploadRes", fileUploadRes);
  }, []);

  const getFilesList = async () => {
    // const {data} =await axios.get(urlFiles)
    // setFileList(data);
    await axios
      .post(urlFiles)

      .then((res) => {
        console.log("get file list", res);
        if (typeof res.data !== "string") {
          console.log("res data ", res.data);
          setFileList(res.data);
        } else {
          setFileList([]);
        }
      })
      .catch((error) => {
        console.log("get file list error", error);
      });
  };

  const initialValues = {
    files: [],
  };


  const handleFileInputChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleUploadButtonClick = () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });
    console.log("selected files :", selectedFiles);

    axios
      .post(UpsertUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log("file Submission  response", res);
        setFileUploadResponse(res.data);
        // setFileUploadResponse(old => [...old, res.data]);
        console.log("res data is :", res.data);
        console.log("uploaded files : ", fileUploadRes);

        setNotify({
          isOpen: true,
          message: "Uploaded Successfully",
          type: "success",
        });
        // setSelectedFiles(null);
        document.getElementById("null").value = "";
        getFilesList();
      })
      .catch((error) => {
        console.log("fupload error", error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: "error",
        });
      });
  };

  const handleRowClick = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const handleOnRowDelete = (item) => {
    console.log("inside delete row", item);
    axios
      .post(deleteUrl + item._id)
      .then((res) => {
        console.log("File Deleted Successfully", res);
        getFilesList();
        setNotify({
          isOpen: true,
          message: "File Deleted Successfully",
          type: "success",
        });
      })
      .catch((err) => {
        console.log("Error Deleting Records", err);
      });
  };

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <Box
        sx={{
          height: "500px",
        }}
      >
        <Grid
          height="500px"
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          paddingTop="30px"
          marginLeft="50px"
        >
          <Paper
            elevation={16}
            sx={{
              height: "180px",
              width: "500px",
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <input
              id="null"
              type="file"
              multiple
              onChange={handleFileInputChange}
            />

            <Button
              type="success"
              variant="contained"
              color="secondary"
              onClick={handleUploadButtonClick}
            >
              Upload
            </Button>
            <Grid
              height="50px"
              container
              direction="row"
              justifyContent="center"
            >
              <Grid item xs={8}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography fontWeight="bold">UPLOADED FILES</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List
                      sx={{
                        width: "100%",
                        maxWidth: 360,
                        bgcolor: "#D7ECFF",
                        position: "relative",
                        overflow: "auto",
                        maxHeight: 300,
                        "& ul": { padding: 0 },
                      }}
                      subheader={<ListItem />}
                    >
                      {filesList.map((item, index) => (
                        <ListItem sx={{ maxHeight: "200px" }}>
                          {index + 1}
                          <ListItemButton
                            onClick={() => handleRowClick(item.fileUrl)}
                          >
                            <ListItemIcon>
                              <ArticleIcon />
                            </ListItemIcon>
                            <ListItemText
                              sx={{ wordBreak: "break-all" }}
                              primary={item.originalname}
                              title={item.originalname}
                            ></ListItemText>
                          </ListItemButton>
                          <DeleteIcon
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleOnRowDelete(item)}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Box>
    </>
  );
};
export default FileUploadUpdated;


