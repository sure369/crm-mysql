import React, { useState, useEffect } from 'react';
import { Box, Button, useTheme,Card ,CardContent,IconButton, Pagination,Tooltip } from "@mui/material";
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
import Notification from '../toast/Notification';
import ConfirmDialog from '../toast/ConfirmDialog';

const InventoriesMobile = () => {

    const urlDelete = `${process.env.REACT_APP_SERVER_URL}/deleteInventory?code=`;
    const urlInventory = `${process.env.REACT_APP_SERVER_URL}/inventories`;
  
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const[fetchLoading,setFetchLoading]=useState(true);
    // notification
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    //dialog
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
  
    const[showDelete,setShowDelete]=useState(false)
    const[selectedRecordIds,setSelectedRecordIds]=useState()
    const[selectedRecordDatas,setSelectedRecordDatas]=useState()
   
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [page, setPage] = useState(1);
    const [noOfPages, setNoOfPages] = useState(0);



  useEffect(() => {
    fetchRecords();

  }, []);

  const fetchRecords = () => {
    axios.post(urlInventory)
      .then(
        (res) => {
          console.log("res Inventory records", res);
          if (res.data.length > 0 && (typeof (res.data) !== 'string')) {
            setRecords(res.data);
             setFetchLoading(false)
             setNoOfPages(Math.ceil(res.data.length / itemsPerPage));
          }
          else {
            setRecords([]);
             setFetchLoading(false)
          }
        }
      )
      .catch((error) => {
        console.log('res Inventory error', error);
         setFetchLoading(false)
      })
  }

  const handleAddRecord = () => {
    navigate("/new-inventories", { state: { record: {} } })
  };

  const handleOnCellClick = (e, row) => {
    console.log('selected record', row);
    const item = row;
    navigate("/inventoryDetailPage", { state: { record: { item } } })
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
    if(row.length){
      console.log('if row',row);
      row.forEach(element => {
        onebyoneDelete(element)
      });
    }
   else{
    onebyoneDelete(row._id)
   }
  }

const onebyoneDelete=(row)=>{

    console.log('one by one Delete row', row)
   
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
  const handleChangePage = (event, value) => {
    setPage(value);
  };



  return (
    <>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />

      <Box m="20px">
        <Header
          title="Inventories"
          subtitle="List of Inventory"
        />

        <div className='btn-test'>
            <Button variant="contained" color="info" onClick={handleAddRecord}>
                New
            </Button>

        </div>

      <Card dense compoent="span" sx={{ bgcolor: "white" }}>
            { records.length>0?
            records
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((item) => {
                return (
                  <div>
                    <CardContent sx={{ bgcolor: "aliceblue", m: "20px" }}>
                      <div
                        key={item._id}
                        button
                        onClick={(e) => handleOnCellClick(e,item)}
                      >
                        {/* //()=>setRecordDetailId(item.Id) */}
                        <h1>{item.Name} </h1>
                        <div>PropertyName : {item.propertyName} </div>
                        <div>projectName :{item.projectName} </div>
                        <div>Status : {item.status} </div>
                        <div>Type : {item.type} </div>
                        <div>City : {item.city} </div>
                        
                      </div>
                    </CardContent>
                  </div>
                );
              })
            :"No Data"
            }
          </Card>

          <Box 
           sx={{
                    margin: "auto",
                    width: "fit-content",
                    alignItems: "center",
                    // justifyContent:'space-between'
                }}>
            <Pagination
              count={noOfPages}
              page={page}
              onChange={handleChangePage}
              defaultPage={1}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{justifyContent:'center'}}
            />
          </Box>

          </Box>
    </>
  )
}
// };

export default InventoriesMobile;
