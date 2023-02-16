import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import {
  Autocomplete,
  Box,
  FormControlLabel,
  InputAdornment,
  Switch,
  Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { Package, ShipmentInsurance } from "../../types/apps/NavashipTypes";
import { ChangeEvent, useEffect, useState } from "react";

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
  errors
}: PackageSelectProps) => {
  const handlePackageChange = (event, newValue) => {
    let selectedPackage = newValue as Package | null;
    handleSelectedPackageChange(selectedPackage);
    errors.parcel = "";
  };

  const parcelOptionLabel = (parcel: Package) => {
    return parcel.name;
  };

  return (
    <Box>
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
                noOptionsText="No parcel found"
                getOptionLabel={(parcel) => parcelOptionLabel(parcel)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={handlePackageChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={value}
                    label="Parcel"
                    variant="standard"
                    placeholder={"Search parcel..."}
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
    </Box>
  );
};

export default SelectPackageFormController;
