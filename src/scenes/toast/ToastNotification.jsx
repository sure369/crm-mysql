import React from 'react'
import { Snackbar,Alert } from '@mui/material'

function ToastNotification(props) {

    const{notify,setNotify}=props

    const handleClose =()=>{
        setNotify({
            ...notify,
            isOpen:false
        })
    }

  return (
   <Snackbar
    open={notify.isOpen}
    autoHideDuration={2000}
    anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
    }}
    onClose={handleClose}
    >

        <Alert 
        severity={notify.type}
        onClose={handleClose}
        >
            {notify.message}
        </Alert>
   </Snackbar>
  )
}

export default ToastNotification