import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import { Autocomplete, Box, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { Address } from "../../types/apps/navashipInterfaces";
import { ChangeEvent } from "react";
import Button from "@mui/material/Button";

export enum AddressType {
  SOURCE = "source",
  DELIVERY = "delivery",
}

interface AddressSelectProps {
  addressType: AddressType,
  currentAddress: Address | null | undefined,
  selectableAddresses: Address[];
  handleAddressChange: (address: Address | null ) => void,
  handleAddressAdditionalInformationChange: (event: ChangeEvent<HTMLInputElement>) => void,
  control: any;
  errors: any;
  handleAddressModalToggle: () => void;
}

const SelectAddressFormController = (
  {
   addressType,
   currentAddress,
   selectableAddresses,
   handleAddressChange,
   handleAddressAdditionalInformationChange,
   control,
   errors,
   handleAddressModalToggle,
  }: AddressSelectProps) => {
  const fieldName = addressType.toString();
  const labelName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + " Address";

  const handleAddressValueChange = (event, newValue) => {
    let selectedAddress: Address | null = null;
    errors[fieldName] = "";

    if (newValue) {
      selectedAddress = findAddress(newValue.id);
    }

    handleAddressChange(selectedAddress);
  }

  const findAddress = (addressId: number) => {
    return selectableAddresses.find((address: Address) => address.id == addressId) as Address;
  }

  const addressOptionLabel = (address: Address | null) => {
    return address?.street1 +  (address?.street2 ? " , " + address?.street2 : "") + ", " + address?.zip + ", " + address?.city + ", " + address?.country;
  }

  return (
      <Grid item xs={12} sm={6} direction="column">
        <Grid item xs={12} sm={12} >
          <FormControl fullWidth>
            <Controller
              name={fieldName}
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  options={selectableAddresses}
                  value={currentAddress?.street1 ? currentAddress : null}
                  getOptionLabel={(address) => addressOptionLabel(address)}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={handleAddressValueChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      value={value}
                      label={labelName}
                      variant="standard"
                    />
                  )}
                />
              )}
            />
          </FormControl>
          {errors[fieldName] && (
            <FormHelperText sx={{ color: "error.main", position: "absolute" }}>
              {errors[fieldName].message}
            </FormHelperText>
          )}
        </Grid>
        <Grid item sx={{"mt": 4}} xs={12} sm={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button sx={{ padding: 2}} onClick={handleAddressModalToggle} variant="contained">
              Add Address
            </Button>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Typography noWrap sx={{
              color: "text.secondary",
              fontSize: 12,
              mt: 1,
            }}>
              Address doesn't exist?
            </Typography>
          </Box>
        </Grid>

        <Grid container spacing={2} my={1}>
          <Grid item xs={12} mb={4}>
            <Typography variant="body2">
              Additional {fieldName === "source" ? "Sender" : "Receiver"} Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="name"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  name="name"
                  value={currentAddress?.name ? currentAddress.name : ""}
                  onChange={handleAddressAdditionalInformationChange}
                  label="Name"
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
          <Grid item xs={12} sm={6}>
            <Controller
              name="company"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  name="company"
                  value={currentAddress?.company ? currentAddress.company : ""}
                  onChange={handleAddressAdditionalInformationChange}
                  label="Company"
                  error={Boolean(errors.company)}
                />
              )}
            />
            {errors.company && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.company.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="phone"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  name="phone"
                  value={currentAddress?.phone ? currentAddress.phone : ""}
                  onChange={handleAddressAdditionalInformationChange}
                  label="Phone"
                  error={Boolean(errors.phone)}
                />
              )}
            />
            {errors.phone && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.phone.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="email"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  name="email"
                  value={currentAddress?.email ? currentAddress.email : ""}
                  onChange={handleAddressAdditionalInformationChange}
                  label="Email"
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.email.message}
              </FormHelperText>
            )}
          </Grid>
        </Grid>
    </Grid>
  )
};

export default SelectAddressFormController;
