import { useState, ChangeEvent, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CardContent from "@mui/material/CardContent";
import AddressAutoCompleteField from "../fields/addressAutoCompleteField";
import { addAddress, updateAddress } from "../../store/apps/addresses";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormHelperText from "@mui/material/FormHelperText";
import { toast } from "react-hot-toast";
import { Address, Package } from "../../types/apps/navashipInterfaces";
import {
  clearCreateStatus,
  clearUpdateStatus
} from "../../store/apps/addresses";

// See: https://www.uxmatters.com/mt/archives/2008/06/international-address-fields-in-web-forms.php
export type AddressDetails = {
  street1: string;
  street2?: string;
  city: string;
  zip: string;
  state: string;
  country: string;
};

interface AddressFormProps {
  handleDialogToggle: () => void;
  setCreatedPackage?: (value: boolean) => void;
  addressToEdit?: Address;
}

const AddressForm = ({
  handleDialogToggle,
  setCreatedAddress,
  addressToEdit
}) => {
  const [addressDetails, setAddressDetails] = useState<AddressDetails>({
    street1: "",
    street2: "",
    city: "",
    zip: "",
    state: "",
    country: ""
  });

  const store = useSelector((state: RootState) => state.addresses);

  const defaultValues: AddressDetails = {
    street1: "",
    street2: "",
    city: "",
    zip: "",
    state: "",
    country: ""
  };

  yup.setLocale({
    mixed: {
      required: "Required field"
    }
  });

  const schema = yup.object().shape({
    street1: yup.string().required(),
    city: yup.string().required(),
    country: yup.string().required(),
    state: yup.string().required(),
    zip: yup.string().required()
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: async (data, context, options) => {
      // @ts-ignore
      return yupResolver(schema)(addressDetails, context, options);
    }
  });

  const dispatch = useDispatch<AppDispatch>();

  const handleData = (data: AddressDetails) => {
    if (!addressToEdit) {
      dispatch(addAddress({ ...data }));
    } else {
      dispatch(updateAddress({ id: addressToEdit.id, ...data }));
    }

    handleDialogToggle();
  };

  const handleAddressValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const addressDetailName = event.target.name;
    const addressDetailValue = event.target.value;

    const newAddressDetailValue = {};
    newAddressDetailValue[addressDetailName] = addressDetailValue;

    const newAddressDetails = { ...addressDetails, ...newAddressDetailValue };
    setAddressDetails(newAddressDetails);
  };

  useEffect(() => {
    if (addressToEdit !== undefined) {
      const addressToPopulate = { ...addressToEdit };
      setAddressDetails(addressToPopulate);
    }
  }, [addressToEdit]);

  // Add toast message
  useEffect(() => {
    if (store.createStatus === "SUCCESS") {
      toast.success("Address was successfully created", {
        position: "top-center"
      });

      if (setCreatedAddress) {
        setCreatedAddress(true);
      }
    } else if (store.createStatus === "ERROR") {
      toast.error("Error creating address", {
        position: "top-center"
      });
    }
    dispatch(clearCreateStatus());
  }, [store.createStatus]);

  // Edit toast message
  useEffect(() => {
    if (store.updateStatus === "SUCCESS") {
      toast.success("Address was successfully updated", {
        position: "top-center"
      });
    } else if (store.updateStatus === "ERROR") {
      toast.error("Error updating address", {
        position: "top-center"
      });
    }
    dispatch(clearUpdateStatus());
  }, [store.updateStatus]);

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(handleData)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Controller
                name="street1"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <AddressAutoCompleteField
                    addressDetails={addressDetails}
                    setAddressDetails={setAddressDetails}
                    handleAddressValueChange={handleAddressValueChange}
                    error={Boolean(errors.street1)}
                    street1Value={addressToEdit?.street1}
                  />
                )}
              />
              {errors.street1 && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.street1.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="street2"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    name="street2"
                    value={addressDetails.street2}
                    onChange={handleAddressValueChange}
                    label="Apartment, unit, suite, or floor #"
                    error={Boolean(errors.street2)}
                  />
                )}
              />
              {errors.street2 && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.street2.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="city"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    name="city"
                    label="City"
                    onChange={handleAddressValueChange}
                    value={addressDetails.city}
                    error={Boolean(errors.city)}
                  />
                )}
              />
              {errors.city && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-schema-first-name"
                >
                  {errors.city.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="zip"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    label="ZIP/Postal Code"
                    name="zip"
                    onChange={handleAddressValueChange}
                    value={addressDetails.zip}
                    error={Boolean(errors.zip)}
                  />
                )}
              />
              {errors.zip && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-schema-first-name"
                >
                  {errors.zip.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="state"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    name="state"
                    label="State/Province/Region"
                    onChange={handleAddressValueChange}
                    value={addressDetails.state}
                    error={Boolean(errors.state)}
                  />
                )}
              />
              {errors.state && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-schema-first-name"
                >
                  {errors.state.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="country"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    name="country"
                    label="Country"
                    onChange={handleAddressValueChange}
                    value={addressDetails.country}
                    error={Boolean(errors.country)}
                  />
                )}
              />
              {errors.country && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-schema-first-name"
                >
                  {errors.country.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 5,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "flex-end"
                }}
              >
                <Button type="submit" variant="contained" size="large">
                  {!addressToEdit ? "Create address" : "Edit address"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddressForm;
