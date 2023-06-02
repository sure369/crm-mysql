import React, { useState, useEffect } from "react";
import {
  Box, Button, useTheme, IconButton, Pagination,
  Tooltip, Grid, Modal, Typography,
} from "@mui/material";
import {
  DataGrid, GridToolbar, gridPageCountSelector,
  gridPageSelector, useGridApiContext, useGridSelector,
} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ToastNotification from "../toast/ToastNotification";
import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";
import { RequestServer } from "../api/HttpReq";
import { apiMethods } from "../api/methods";
import "../indexCSS/muiBoxStyles.css";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import { apiCheckPermission } from "../Auth/apiCheckPermission";
import CircularProgress from '@mui/material/CircularProgress';
import { OBJECT_API_FILE,GET_FILE,DELETE_FILE } from "../api/endUrls";
import ModalFileUpload from "./ModalNewFile";
import '../Files/FileModal.css'
import '../recordDetailPage/Form.css'

const Files = () => {

  const OBJECT_API = 'File'
  const URL_getRecords= '/files'
  const URL_deleteRecords= `/deletefiles/`

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState();
  const [fetchRecordsLoading, setFetchRecordsLoading] = useState(true);
  const [fetchPermissionloading, setFetchPermissionLoading] = useState(true);

  const [selectedRecordDatas, setSelectedRecordDatas] = useState();
  const [selectedRecordIds, setSelectedRecordIds] = useState();

  const [showEmail,setShowEmail]=useState()
  const [notify, setNotify] = useState({ isOpen: false, message: "",type: "",});
  const [confirmDialog, setConfirmDialog] = useState({isOpen: false,title: "",subTitle: "",});

   const [permissionValues,setPermissionValues] =useState({})
  const [modalFileUpload,setModalFileUpload]=useState(false)
  const userRoleDpt = getLoginUserRoleDept(OBJECT_API)
  console.log(userRoleDpt, "userRoleDpt")

  useEffect(() => {
    fetchRecords();
    fetchObjectPermissions()
  }, []);

  const fetchRecords = () => {    
    setFetchRecordsLoading(true)
    RequestServer(URL_getRecords)
      .then((res) => {
        console.log(res, "index page res");
        if (res.success) {
          setRecords(res.data);
          setFetchError(null);
        } else {
          setRecords([]);
          setFetchError(res.error.message);
        }
      })
      .catch((err) => {
        setFetchError(err.message);
      })
      .finally(()=>{
        setFetchRecordsLoading(false)
      })
  };

  const fetchObjectPermissions=()=>{
    if(userRoleDpt){
      apiCheckPermission(userRoleDpt)
      .then(res=>{
        console.log(res,"res apiCheckPermission")
        setPermissionValues(res)
      })
      .catch(err=>{
        console.log(err,"error apiCheckObjectPermission")
      })
      .finally(()=>{
        setFetchPermissionLoading(false)
      })
    }
  }

  const handleAddRecord = () => {
    setModalFileUpload(true)
  };

  
  const handleRowClick = (e) => {
    console.log(e.row.fileUrl,"handleRowClick")
     window.open(e.row.fileUrl, "_blank");
  };

  const onHandleDelete = (e, row) => {
    e.stopPropagation();
    console.log("req delete rec", row);

    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to delete this Record ?`,
      subTitle: "You can't undo this Operation",
      onConfirm: () => {
        onConfirmDeleteRecord(row);
      },
    });
  };

  const onConfirmDeleteRecord = (row) => {
    if (row.length) {
      row.forEach((element) => {
        onebyoneDelete(element);
      });
    } else {
      onebyoneDelete(row._id);
    }
  };

  const onebyoneDelete = (row) => {
    console.log("one by on delete", row);

    RequestServer(URL_deleteRecords + row)
      .then((res) => {
        console.log(res,"delete")
        if (res.success) {
          fetchRecords();
          setNotify({
            isOpen: true,
            message: res.data,
            type: "success",
          });
        } else {
          console.log(res, "error in then");
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: "error",
          });
        }
      })
      .catch((error) => {
        console.log("api delete error", error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: "error",
        });
      })
      .finally(() => {
        setConfirmDialog({
          ...confirmDialog,
          isOpen: false,
        });
      });
  };

  const handleFileModalClose=()=>{
    setModalFileUpload(false)
    fetchRecords()
  }

  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <Pagination
        color="primary"
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    );
  }


  const columns = [
    {
      field: "filename",
      headerName: "File Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "mimetype",
      headerName: "File Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
    }
]
    if(permissionValues.delete){
      columns.push(
        {
          field: "actions",
          headerName: "Actions",
          headerAlign: "center",
          align: "center",
          flex: 1,
          width: 400,
          renderCell: (params) => {
            return (
              <>
                {!showEmail ? (
                  <>
                    <IconButton
                      onClick={(e) => onHandleDelete(e, params.row)}
                      style={{ padding: "20px", color: "#FF3333" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                ) : (
                  ""
                )}
              </>
            );
          },
        },
      )
    }

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

      <Box m="20px">
        {fetchPermissionloading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <CircularProgress />
          </Box>
        ) : (
          permissionValues.read &&(
          <>
         
        <Typography
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ m: "0 0 5px 0" }}
        >
          {OBJECT_API}
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" color={colors.greenAccent[400]}>
            List Of {OBJECT_API}
          </Typography>

          <div
            style={{
              display: "flex",
              width: "200px",
              justifyContent: "space-evenly",
              height: "30px",
            }}
          >
            {showEmail ? (
              <>
                <div
                  style={{
                    width: "180px",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "15px",
                  }}
                >
                  {
                    permissionValues.delete &&                 
                          <Tooltip title="Delete Selected">
                            <IconButton>
                              <DeleteIcon
                                sx={{ color: "#FF3333" }}
                                onClick={(e) => onHandleDelete(e, selectedRecordIds)}
                              />
                            </IconButton>
                          </Tooltip>
                   }
                </div>
              </>
            ) : (
              <>
              {
                permissionValues.create &&
              <>
                <Button
                  variant="contained"color="info"
                  onClick={handleAddRecord}
                >
                  Upload File
                </Button>
              </>
              }
                </>
            )}
          </div>
        </Box>
        <Box m="15px 0 0 0" height="380px" className="my-mui-styles">
          <DataGrid
            sx={{
              boxShadow:
                "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
            }}
            rows={records}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={7}
            rowsPerPageOptions={[7]}
            components={{
              // Toolbar: GridToolbar,
              Pagination: CustomPagination,
            }}
            loading={fetchRecordsLoading}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0
                ? "C-MuiDataGrid-row-even"
                : "C-MuiDataGrid-row-odd"
            }
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={(ids) => {
              var size = Object.keys(ids).length;
              size > 0 ? setShowEmail(true) : setShowEmail(false);
              console.log("checkbox selection ids", ids);
              setSelectedRecordIds(ids);
              const selectedIDs = new Set(ids);
              const selectedRowRecords = records.filter((row) =>
                selectedIDs.has(row._id.toString())
              );
              setSelectedRecordDatas(selectedRowRecords);
              console.log("selectedRowRecords", selectedRowRecords);
            }}
            onRowClick={(e) => handleRowClick(e)}
          />
        </Box>
        <Modal
        open={modalFileUpload}
        onClose={handleFileModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: "blur(1px)" }}
      >
        <div className="related-modal-box">
          <ModalFileUpload handleModal={handleFileModalClose} />
        </div>
      </Modal>

        </>
          ))}
      </Box>
      
    </>
  );
};

export default Files;
