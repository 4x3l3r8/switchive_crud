import { Hotel } from '@/types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

type Props = {
    open: boolean;
    selectedValue: Hotel;
    onClose: () => void;
}

export const Deletemodal = (props: Props) => {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose();
    };

    const handleListItemClick = () => {
        onClose();
    };
    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Delete Hotel?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete the hotel: {selectedValue.hotelName}?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button color='error' variant="contained" onClick={handleListItemClick}>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}