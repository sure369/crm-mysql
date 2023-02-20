import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, useTheme, Pagination ,Tooltip} from "@mui/material";
import {
  DataGrid, GridToolbar,
  gridPageCountSelector, gridPageSelector,
  useGridApiContext, useGridSelector
} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ToastNotification from '../toast/ToastNotification';
import DeleteConfirmDialog from '../toast/DeleteConfirmDialog';

const Users = () => {

  const urlDelete = `${process.env.REACT_APP_SERVER_URL}/delete?code=`;
  const urlUsers = `${process.env.REACT_APP_SERVER_URL}/Users`;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  // notification
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  //dialog
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

  const [showDelete, setShowDelete] = useState(false)
  const [selectedRecordIds, setSelectedRecordIds] = useState()
  const [selectedRecordDatas, setSelectedRecordDatas] = useState()


  useEffect(() => {
    fetchRecords();

  }, []
  );

  const fetchRecords = () => {
    axios.post(urlUsers)
      .then(
        (res) => {
          console.log("res users records", res);
          if (res.data.length > 0 && (typeof (res.data) !== 'string')) {
            setRecords(res.data);
            setFetchLoading(false)
          }
          else {
            setRecords([]);
            setFetchLoading(false)
          }
        }
      )
      .catch((error) => {
        console.log('res users error', error);
        setFetchLoading(false)
      })
  }

  const handleAddRecord = () => {
    navigate("/userDetailPage", { state: { record: {} } })
  };

  const handleOnCellClick = (e, row) => {
    console.log(' selected  rec', row);
    const item = row;
    navigate("/userDetailPage", { state: { record: { item } } })
  };



  const onHandleDelete = (e, row) => {
    e.stopPropagation();
    console.log('req delete rec', row);
    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to delete this Record ?`,
      subTitle: "You can't undo this Operation",
      onConfirm: () => { onConfirmDeleteRecord(row) }
    })
  }
  const onConfirmDeleteRecord = (row) => {
    if (row.length) {
      console.log('if row', row);
      row.forEach(element => {
        onebyoneDelete(element)
      });
    }
    else {
      console.log('else', row._id);
      onebyoneDelete(row._id)
    }
  }
  const onebyoneDelete = (row) => {
    console.log('onebyoneDelete rec id', row)

    axios.post(urlDelete + row)
      .then((res) => {
        console.log('api delete response', res);
        fetchRecords();
        setNotify({
          isOpen: true,
          message: res.data,
          type: 'success'
        })
      })
      .catch((error) => {
        console.log('api delete error', error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: 'error'
        })
      })
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
  };

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
      field: "firstName", headerName: "First Name",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "lastName", headerName: "Last Name",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "email", headerName: "Email",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "role", headerName: "Role",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "access", headerName: "Access",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: 'actions', headerName: 'Actions', width: 400,
      headerAlign: 'center', align: 'center', flex: 1,
      renderCell: (params) => {
        return (
          <>
            {
              !showDelete ?
                <>
                  <IconButton style={{ padding: '20px', color: '#0080FF' }}>
                    <EditIcon onClick={(e) => handleOnCellClick(e, params.row)} />
                  </IconButton>
                  <IconButton style={{ padding: '20px', color: '#FF3333' }}>
                    <DeleteIcon onClick={(e) => onHandleDelete(e, params.row)} />
                  </IconButton>
                </>
                : ''
            }
          </>
        );
      }
    }
  ];

  if (records.length >= 0) {
    return (
      <>
        <ToastNotification notify={notify} setNotify={setNotify} />
        <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />

        <Box m="20px">
          <Header
            title="Users"
            subtitle="List of User"
          />
          <Box
            m="40px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 'bold !important',
                overflow: 'visible !important'
              },
              "& .MuiDataGrid-virtualScroller": {
                // backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderBottom: "none",
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${colors.grey[100]} !important`,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#CECEF0"
              },
              "& .C-MuiDataGrid-row-even": {
                backgroundColor: "#D7ECFF",
              },
              "& .C-MuiDataGrid-row-odd": {
                backgroundColor: "#F0F8FF",
              },
            }}
          >
             <div className='btn-test'>
          {
              showDelete ? 
              <>
              <Tooltip title="Delete Selected">
                  <IconButton> <DeleteIcon sx={{ color: '#FF3333' }} onClick={(e) => onHandleDelete(e,selectedRecordIds)} /> </IconButton>
              </Tooltip>
              </>
              :
              <Button variant="contained" color="info" onClick={handleAddRecord}>
                New
              </Button>
            }
          </div>

            <DataGrid
              rows={records}
              columns={columns}
              getRowId={(row) => row._id}
              pageSize={7}
              rowsPerPageOptions={[7]}
              components={{
                Pagination: CustomPagination,
                Toolbar: GridToolbar
              }}
              loading={fetchLoading}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'C-MuiDataGrid-row-even' : 'C-MuiDataGrid-row-odd'
              }
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(ids) => {
                var size = Object.keys(ids).length;
                size > 0 ? setShowDelete(true) : setShowDelete(false)
                console.log('checkbox selection ids', ids);
                setSelectedRecordIds(ids)
                const selectedIDs = new Set(ids);
                const selectedRowRecords = records.filter((row) =>
                  selectedIDs.has(row._id.toString())
                );
                setSelectedRecordDatas(selectedRowRecords)
              }}
            />
          </Box>
        </Box>
      </>
    )
  }
};

export default Users;
