"use client"

import { useGetAllcountriesQuery } from '@/lib/services/api';
import { Country } from '@/types';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, Slide, TextField } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, Fragment, ReactElement, Ref, useMemo, useState } from 'react';

type Props = {}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement<any, any>;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const AddHotel = (props: Props) => {
    const [open, setOpen] = useState(false);
    const { data, isLoading, isError } = useGetAllcountriesQuery()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const countries = useMemo(() => {
        if (data) {
            const countries = [...new Set(data.map(item => item.country))];
            return countries

        }
    }, [data, isLoading]);

    return (
        <Fragment>
            <Button sx={{ ml: 'auto' }} variant='contained' onClick={handleClickOpen}>Add Hotel</Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                maxWidth="sm"
                fullWidth
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <Box component={"form"}>
                    <DialogTitle>{"Add New Hotel"}</DialogTitle>
                    <DialogContent>
                        <DialogContent sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                            <TextField
                                label="Hotel Name"
                                variant="outlined"
                                fullWidth
                                size='small'
                            />
                            <TextField
                                label="Address"
                                variant="outlined"
                                fullWidth
                                size='small'
                            />
                            <Autocomplete
                                options={countries as Country[]}
                                loading={isLoading}
                                loadingText="Fetching Countries"
                                size='small'
                                renderInput={(params) => <TextField {...params} label="Countries" />}
                            />
                            <FormControl fullWidth size='small'>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    label="Category"
                                    variant="outlined"
                                    fullWidth
                                >
                                    <MenuItem value="1-star">1 Star</MenuItem>
                                    <MenuItem value="2-star">2 Star</MenuItem>
                                    <MenuItem value="3-star">3 Star</MenuItem>
                                </Select>
                            </FormControl>
                        </DialogContent>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="text" color="error" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="success">
                            Submit
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Fragment>
    );
}