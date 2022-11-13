// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// ** Icons Imports
import {useState} from "react";
import {useForm} from "react-hook-form";
import {Dialog, DialogContent, DialogTitle, IconButton, Typography} from "@mui/material";
import {Close} from "mdi-material-ui";
import FormLayoutsBasic from "../../../pages/addresses/add";

interface TableHeaderProps {
    value: number;
    handleFilter: (val: number) => void;
}

const TableHeader = () => {
    // ** Props

    // ** State
    const [open, setOpen] = useState<boolean>(false);

    // ** Hooks
    const {
        control,
        setValue,
        handleSubmit,
        formState: {errors}
    } = useForm({defaultValues: {name: ''}});

    const handleDialogToggle = () => {
        setOpen(!open)
        setValue('name', '')
    }

    const onSubmit = () => {
        setOpen(false)
        setValue('name', '')
    }

    return (
        <Box
            sx={{
                p: 5,
                pb: 3,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between"
            }}
        >
            <Box sx={{display: "flex", flexWrap: "wrap", alignItems: "center"}}>
                <Button sx={{mb: 2}} onClick={handleDialogToggle} variant="contained">
                    Add Address
                </Button>
            </Box>
            <Dialog
                fullWidth
                open={open}
                scroll='body'
                maxWidth='md'
                onClose={handleDialogToggle}
                onBackdropClick={handleDialogToggle}
            >
                <DialogTitle sx={{pt: 12, mx: 'auto', textAlign: 'center'}}>
                    <Typography variant='h4' component='span' sx={{mb: 2}}>
                        Add A New Address
                    </Typography>
                    <Typography variant='body2'>This is an autocomplete form to save an address for future
                        use.</Typography>
                    <IconButton size='small' onClick={handleDialogToggle}
                                sx={{position: 'absolute', right: '1rem', top: '1rem'}}>
                        <Close/>
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    sx={{
                        pt: {xs: 8, sm: 12.5},
                        pr: {xs: 5, sm: 12},
                        pb: {xs: 5, sm: 9.5},
                        pl: {xs: 4, sm: 11},
                        position: 'relative'
                    }}
                >


                    <FormLayoutsBasic></FormLayoutsBasic>
                </DialogContent>
            </Dialog>
        </Box>

    );
};

export default TableHeader;
