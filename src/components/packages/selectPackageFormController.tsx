import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import {
  Autocomplete,
  Box, FormControlLabel, InputAdornment, Switch,
  Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { Address, Package } from "../../types/apps/navashipInterfaces";
import { useEffect, useState } from "react";

interface PackageSelectProps {
  currentParcel: Package | null | undefined;
  selectablePackages: Package[];
  handleSelectedPackageChange: (parcel: Package | null) => void;
  control: any;
  errors: any;
}

const SelectPackageFormController = ({
  currentParcel,
  selectablePackages,
  handleSelectedPackageChange,
  control,
  errors,
}: PackageSelectProps) => {
  const [showInsuranceValueField, setShowInsuranceValueField] = useState<boolean>(false);

  const handlePackageChange = (event, newValue) => {
    if (!newValue) {
      setShowInsuranceValueField(false);
    }
    let selectedPackage = newValue as Package | null;
    handleSelectedPackageChange(selectedPackage);
    errors.parcel = "";
  };

  const parcelOptionLabel = (parcel: Package) => {
    return parcel.name;
  };

  const insureParcelSwitch = () => {
    setShowInsuranceValueField(!showInsuranceValueField);
  };

  return (
    <Box sx={{ height: "34vh" }}>
      <Grid item xs={12} sm={12} mb={8}>
        <FormControl fullWidth>
          <Controller
            name="parcel-name"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                options={selectablePackages}
                id="autocomplete-default"
                value={currentParcel?.name ? currentParcel : null}
                getOptionLabel={(parcel) => parcelOptionLabel(parcel)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={handlePackageChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={value}
                    label="Choose parcel"
                    variant="standard"
                    placeholder={"Search or select a parcel"}
                  />
                )}
              />
            )}
          />
        </FormControl>
        {errors.parcel && (
          <FormHelperText sx={{ color: "error.main", position: "absolute" }}>
            {errors.parcel.message}
          </FormHelperText>
        )}
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} mb={2}>
          <Typography variant="body2">Additional add-ons</Typography>
        </Grid>
        <Grid container spacing={2} my={1} sx={{ ml: 2, p: 1 }}>
          <FormControlLabel
            disabled={!currentParcel}
            label="Insure Parcel"
            sx={{ mt: 2 }}
            control={<Switch onChange={insureParcelSwitch} />}
          />
          {showInsuranceValueField && (
            <TextField
              variant="standard"
              disabled={!currentParcel}
              sx={{ width: 100 }}
              value={currentParcel?.value ? currentParcel?.value : ""}
              label="Value"
              InputLabelProps={{ shrink: true }}
              hidden={showInsuranceValueField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">US$</InputAdornment>
                )
              }}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SelectPackageFormController;
