import React, { useState, useEffect } from 'react'
import {
    Divider, List, ListItemIcon,
    ListItem, ListItemText, ListItemButton,
} from "@mui/material";
import { Delete, ExpandMore } from "@mui/icons-material";
import { RequestServer } from '../api/HttpReq';
import { apiMethods } from '../api/methods';
import { DELETE_DASHBOARD, GET_DASHBOARD } from '../api/endUrls';
import ToastNotification from "../toast/ToastNotification";
import DashboardIcon from '@mui/icons-material/Dashboard';

function DashBoardRecords({ handleRowClick, formSubmitted }) {

    const URL_deleteRecord = `/deleteDashboard/`
    const URL_getRecords = `/dashboard`

    const [notify, setNotify] = useState({ isOpen: false, message: "", type: "", });
    const [records, setRecords] = useState([])

    useEffect(() => {
        fetchRecords()
        if (formSubmitted) {
            fetchRecords()
        }
    }, [formSubmitted])



    const fetchRecords = () => {

        RequestServer(URL_getRecords)
            .then(res => {
                console.log('fetched Dashboard data is ', res.data);
                setRecords(res.data)
                handleRowClick(res.data[0])
            })
            .catch(err => {
                console.log('Error Fetching Dashboard data ', err);
            })
    }

    const handleRecordItemDelete = (item) => {
        console.log('handleRecordItemDelete', item);
        RequestServer(URL_deleteRecord + `${item._id}`)
            .then(res => {
                console.log('DashBoard File Deleted Successfully', res);
                if (res.success) {
                    setNotify({
                        isOpen: true,
                        message: res.data,
                        type: "success",
                    })
                } else {
                    console.log(res, "error in then");
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: "error",
                    })
                }
            })
            .catch(err => {
                console.log('Error deleting Dashboard File ', err);
                setNotify({
                    isOpen: true,
                    message: err.message,
                    type: "error",
                })
            })
            .finally(() => {
                fetchRecords()
            })
    }

    return (
        <div className="new-dashboard-form">
            <ToastNotification notify={notify} setNotify={setNotify} />
            <>
                <List sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: 250,
                    '& ul': { padding: 0 },
                }}>
                    {records && records.map((item, index) => (
                        <>
                            <ListItem sx={{ maxHeight: "200px", marginTop: "-10px" }}>
                                {index + 1}

                                <ListItemButton
                                    onClick={() => handleRowClick(item)}
                                    title={`${item.object} grouped by ${item.field}`}
                                >
                                    <ListItemIcon>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        sx={{ wordBreak: "break-all" }}
                                        primary={`${item.dashboardName} (${item.chartType} chart)`}
                                        secondary={`${item.objectName} grouped by ${item.fields}`}
                                    ></ListItemText>
                                </ListItemButton>
                                <Delete
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => handleRecordItemDelete(item)}
                                />
                            </ListItem>
                            <Divider />
                        </>
                    ))}
                </List>
            </>
        </div>
    )
}

export default DashBoardRecords