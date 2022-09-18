// ** React Imports
import {useState} from "react";

// ** MUI Imports
import Drawer from "@mui/material/Drawer";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import {styled} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Box, {BoxProps} from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

// ** Third Party Imports
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm, Controller} from "react-hook-form";

// ** Icons Imports
import Close from "mdi-material-ui/Close";

// ** Store Imports
import {useDispatch} from "react-redux";

// ** Actions Imports
import {addPackages} from "src/store/apps/packages";

// ** Types Imports
import {AppDispatch} from "src/store";

interface SidebarAddPackageType {
    open: boolean;
    toggle: () => void;
}

interface UserData {
    id: number;
    weight: number;
    value: number;
    length: number;
    width: number;
    name: string;
    height: number;
}

const showErrors = (field: string, valueLen: number, min: number) => {
    if (valueLen === 0) {
        return `${field} field is required`;
    } else if (valueLen > 0 && valueLen < min) {
        return `${field} must be at least ${min} characters`;
    } else {
        return "";
    }
};

const Header = styled(Box)<BoxProps>(({theme}) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(3, 4),
    justifyContent: "space-between",
    backgroundColor: theme.palette.background.default
}));

const schema = yup.object().shape({
    weight: yup
        .number()
        .typeError("weight field is required")
        .min(0, (obj) => showErrors("weight", obj.value.weight, obj.min))
        .required(),
    value: yup
        .number()
        .typeError("value field is required")
        .min(0, (obj) => showErrors("value", obj.value.value, obj.min))
        .required(),
    length: yup
        .number()
        .typeError("length field is required")
        .min(0, (obj) => showErrors("length", obj.value.length, obj.min))
        .required(),
    width: yup
        .number()
        .typeError("width field is required")
        .min(0, (obj) => showErrors("width", obj.value.width, obj.min))
        .required(),
    height: yup
        .number()
        .typeError("height field is required")
        .min(0, (obj) => showErrors("height", obj.value.height, obj.min))
        .required(),
    name: yup
        .string()
        .min(3, (obj) => showErrors("Name", obj.value.name, obj.min))
        .required()
});

const defaultValues = {
    weight: 0,
    value: 0,
    length: 0,
    width: 0,
    height: 0,
    name: ""
};

const SidebarAddPackage = (props: SidebarAddPackageType) => {
    // ** Props
    const {open, toggle} = props;

    // ** State
    const [plan, setPlan] = useState<string>("basic");
    const [role, setRole] = useState<string>("subscriber");

    // ** Hooks
    const dispatch = useDispatch<AppDispatch>();
    const {
        reset,
        control,
        setValue,
        handleSubmit,
        formState: {errors}
    } = useForm({
        defaultValues,
        mode: "onChange",
        resolver: yupResolver(schema)
    });

    const onSubmit = (data: UserData) => {
        // old: dispatch(addPackages({ ...data, role, currentPlan: plan }))
        dispatch(addPackages({...data}));
        toggle();
        reset();
    };

    const handleClose = () => {
        setPlan("basic");
        setRole("subscriber");
        setValue("value", 0);
        toggle();
        reset();
    };

    return (
        <Drawer
            open={open}
            anchor="right"
            variant="temporary"
            onClose={handleClose}
            ModalProps={{keepMounted: true}}
            sx={{"& .MuiDrawer-paper": {width: {xs: 300, sm: 400}}}}
        >
            <Header>
                <Typography variant="h6">Add Package</Typography>
                <Close
                    fontSize="small"
                    onClick={handleClose}
                    sx={{cursor: "pointer"}}
                />
            </Header>
            <Box sx={{p: 5}}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth sx={{mb: 6}}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{required: true}}
                            render={({field: {value, onChange}}) => (
                                <TextField
                                    value={value}
                                    label="Name"
                                    onChange={onChange}
                                    placeholder="Name"
                                    error={Boolean(errors.name)}
                                />
                            )}
                        />
                        {errors.name && (
                            <FormHelperText sx={{color: "error.main"}}>
                                {errors.name.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl fullWidth sx={{mb: 6}}>
                        <Controller
                            name="weight"
                            control={control}
                            rules={{required: true}}
                            render={({field: {value, onChange}}) => (
                                <TextField
                                    type="number"
                                    value={value}
                                    label="Weight"
                                    onChange={onChange}
                                    placeholder="weight"
                                    error={Boolean(errors.weight)}
                                />
                            )}
                        />
                        {errors.weight && (
                            <FormHelperText sx={{color: "error.main"}}>
                                {errors.weight.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl fullWidth sx={{mb: 6}}>
                        <Controller
                            name="value"
                            control={control}
                            rules={{required: true}}
                            render={({field: {value, onChange}}) => (
                                <TextField
                                    type="money"
                                    value={value}
                                    label="Value"
                                    onChange={onChange}
                                    placeholder="$"
                                    error={Boolean(errors.value)}
                                />
                            )}
                        />
                        {errors.value && (
                            <FormHelperText sx={{color: "error.main"}}>
                                {errors.value.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl fullWidth sx={{mb: 6}}>
                        {<Controller
                            name='length'
                            control={control}
                            rules={{required: true}}
                            render={({field: {value, onChange}}) => (
                                <TextField
                                    type='number'
                                    value={value}
                                    label='Length'
                                    onChange={onChange}
                                    placeholder='Length'
                                    error={Boolean(errors)}
                                />
                            )}
                        />}
                        {errors.width && (
                            <FormHelperText sx={{color: "error.main"}}>
                                {errors.width.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl fullWidth sx={{mb: 6}}>
                        <Controller
                            name="width"
                            control={control}
                            rules={{required: true}}
                            render={({field: {value, onChange}}) => (
                                <TextField
                                    type="number"
                                    value={value}
                                    label="Width"
                                    onChange={onChange}
                                    placeholder="Width"
                                    error={Boolean(errors.width)}
                                />
                            )}
                        />
                        {errors.width && (
                            <FormHelperText sx={{color: "error.main"}}>
                                {errors.width.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl fullWidth sx={{mb: 6}}>
                        <Controller
                            name="height"
                            control={control}
                            rules={{required: true}}
                            render={({field: {value, onChange}}) => (
                                <TextField
                                    type="number"
                                    value={value}
                                    label="Height"
                                    onChange={onChange}
                                    placeholder="height"
                                    error={Boolean(errors.height)}
                                />
                            )}
                        />
                        {errors.height && (
                            <FormHelperText sx={{color: "error.main"}}>
                                {errors.height.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <Button
                            size="large"
                            type="submit"
                            variant="contained"
                            sx={{mr: 3}}
                        >
                            Submit
                        </Button>
                        <Button
                            size="large"
                            variant="outlined"
                            color="secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Box>
        </Drawer>
    );
};

export default SidebarAddPackage;
