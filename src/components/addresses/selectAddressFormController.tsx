import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import { Autocomplete, Box, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { Address } from "../../types/apps/NavashipTypes";
import { ChangeEvent } from "react";

export enum AddressType {
  SOURCE = "source",
  DELIVERY = "delivery"
}

interface AddressSelectProps {
  addressType: AddressType;
  currentAddress: Address | null | undefined;
  selectableAddresses: Address[];
  handleAddressChange: (address: Address | null) => void;
  handleAddressAdditionalInformationChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  control: any;
  errors: any;
}

const SelectAddressFormController = ({
  addressType,
  currentAddress,
  selectableAddresses,
  handleAddressChange,
  handleAddressAdditionalInformationChange,
  control,
  errors
}: AddressSelectProps) => {
  const fieldName = addressType.toString();
  const labelName =
    fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + " Address";

  const handleAddressValueChange = (event, newValue) => {
    let selectedAddress = newValue as Address | null;
    handleAddressChange(selectedAddress);
    errors[fieldName] = "";
  };

  const addressOptionLabel = (address: Address) => {
    return (
      address?.street1 +
      (address?.street2 ? ", " + address?.street2 : "") +
      ", " +
      address?.zip +
      ", " +
      address?.city +
      ", " +
      address?.country
    );
  };

  return (
    <Box>
      <Grid item xs={12} sm={12} mb={7}>
        <FormControl fullWidth>
          <Controller
            name={fieldName}
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                options={selectableAddresses}
                value={currentAddress?.street1 ? currentAddress : null}
                noOptionsText="No address found"
                // PopperComponent={StyledPopper}
                // ListboxComponent={ListboxComponent}
                getOptionLabel={(address) => addressOptionLabel(address)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={handleAddressValueChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={value}
                    label={labelName}
                    variant="standard"
                    placeholder={"Search address..."}
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
      <Grid container spacing={2.5}>
        <Grid item xs={12} mb={2}>
          <Typography variant="body2">
            {fieldName === "source" ? "Sender" : "Receiver"} Information
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
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
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
    </Box>
  );
};

export default SelectAddressFormController;
