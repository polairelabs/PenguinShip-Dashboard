// ** React Imports
import { useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CardContent from "@mui/material/CardContent";
import PlacesAutoComplete from "../../../components/auto-complete-places";
import { AddressDetails } from "../../../types/components/addressDetailsType";
import { dispatch } from "react-hot-toast/dist/core/store";
import { addAddress } from "../../../store/apps/addresses";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";

// See: https://www.uxmatters.com/mt/archives/2008/06/international-address-fields-in-web-forms.php

const FormLayoutsBasic = () => {
    // ** States
    const [addressDetails, setAddressDetails] = useState<AddressDetails>({
        city: "",
        country: "",
        postalCode: "",
        region: "", // state/province/region
        street1: "",
        street2: ""
    });

    // const {
    //     reset,
    //     control,
    //     setValue,
    //     handleSubmit,
    //     formState: { errors }
    // } = useForm({
    //     mode: "onChange",
    //     resolver: yupResolver(schema)
    // });

    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(addAddress({ ...addressDetails }));
    };

    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <PlacesAutoComplete
                                setAddressDetails={setAddressDetails}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                value={addressDetails.street2}
                                label="Apartment, unit, suite, or floor #"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="City"
                                value={addressDetails.city}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="State/Province/Region"
                                value={addressDetails.region}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Country"
                                value={addressDetails.country}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="ZIP/Postal Code"
                                value={addressDetails.postalCode}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    gap: 5,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                >
                                    Add address
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

export default FormLayoutsBasic;
