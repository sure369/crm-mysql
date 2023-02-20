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

function DeleteConfirmDialog(props) {

    const{confirmDialog,setConfirmDialog}=props;

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
            onClick={()=>setConfirmDialog({...confirmDialog, isOpen:false})}>No</Button>
        <Button
            variant='contained' 
            color='warning' 
            onClick={confirmDialog.onConfirm}>Yes</Button>
        </DialogActions>

    </Dialog>
  )
}

export default DeleteConfirmDialog