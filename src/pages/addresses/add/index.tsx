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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormHelperText from "@mui/material/FormHelperText";

// See: https://www.uxmatters.com/mt/archives/2008/06/international-address-fields-in-web-forms.php

const FormLayoutsBasic = () => {
  // ** States
  const [addressDetails, setAddressDetails] = useState<AddressDetails>({
    city: "",
    country: "",
    zip: "",
    state: "", // state/province/region
    street1: "",
    street2: ""
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
  });

  const dispatch = useDispatch<AppDispatch>();

  const handleData = (data: AddressDetails) => {
    console.log("SENDING", data);
    dispatch(addAddress({ ...data, ...addressDetails }));
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(handleData)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <PlacesAutoComplete setAddressDetails={setAddressDetails} />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="street2"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    label="Apartment, unit, suite, or floor #"
                    onChange={onChange}
                    error={Boolean(errors.name)}
                  />
                )}
              />
              {errors.name && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.name.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="city"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    required
                    value={value ?? addressDetails.city}
                    label="City"
                    onChange={onChange}
                    error={Boolean(errors.name)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="State/Province/Region"
                value={addressDetails.state}
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
                value={addressDetails.zip}
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
                <Button type="submit" variant="contained" size="large">
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
