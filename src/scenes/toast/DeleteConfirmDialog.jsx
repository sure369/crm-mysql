import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    IconButton,
    Typography,
    DialogContentText,
  } from '@mui/material';

function DeleteConfirmDialog({confirmDialog,setConfirmDialog,moreModalClose}) {

    const handleCloseNo =()=>{
        setConfirmDialog({...confirmDialog, isOpen:false})
        if(moreModalClose){
            moreModalClose()
        }
    }

    const handleCloseYes=()=>{
        confirmDialog.onConfirm()
        if(moreModalClose){
            moreModalClose()
        }
    }


  return (
    <Dialog open={confirmDialog.isOpen} onClose={()=>setConfirmDialog({...confirmDialog, isOpen:false})}>
        <DialogTitle>

        </DialogTitle>

        <DialogContent>
            <Typography variant='h5'>
                {confirmDialog.title}
            </Typography>
            <Typography variant='subtitle2'>
                {confirmDialog.subTitle}
            </Typography>
        </DialogContent>
        <DialogActions>
        <Button 
            variant='contained' 
            color='inherit'
            onClick={handleCloseNo}>No</Button>
        <Button
            variant='contained' 
            color='warning' 
            onClick={handleCloseYes}>Yes</Button>
        </DialogActions>

    </Dialog>
  )
}

export default DeleteConfirmDialog