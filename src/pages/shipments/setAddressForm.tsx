import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CreateShipmentWizard from "../../views/shipments/list/CreateShipmentWizard";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";

import { Address } from "../../types/apps/addressType";

export interface SetAddressPropType {
  address: Address | undefined;
  selectableAddresses: Address[];
  accountControl: any;
  accountErrors: any;
  handleAddressChange(event, newValue);
}

const SetAddressForm = ({
  address,
  selectableAddresses,
  accountControl,
  accountErrors,
  handleAddressChange
}: SetAddressPropType) => {
  return (
    <Grid item xs={12} sm={6} direction="column">
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <Controller
            name="username"
            control={accountControl}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              // <TextField
              //   value={value}
              //   label="Username"
              //   onChange={onChange}
              //   placeholder="carterLeonard"
              //   error={Boolean(accountErrors.username)}
              //   aria-describedby="stepper-linear-account-username"
              // />
              <Autocomplete
                options={selectableAddresses}
                id="autocomplete-default"
                getOptionLabel={(address) => address.street1}
                onChange={handleAddressChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={value}
                    label="Source address"
                    variant="standard"
                  />
                )}
              />
            )}
          />
          {accountErrors.username && (
            <FormHelperText
              sx={{ color: "error.main" }}
              id="stepper-linear-account-username"
            >
              This field is required
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} my={6}>
        <Grid container item direction="row" spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              disabled
              value={address?.zip}
              label="Zip/Postal Code"
              id="form-props-disabled"
              variant="standard"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              disabled
              value={address?.city}
              label="City"
              id="form-props-disabled"
              variant="standard"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              disabled
              value={address?.country}
              label="Country"
              id="form-props-disabled"
              variant="standard"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SetAddressForm;
