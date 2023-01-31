import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import {
  Autocomplete,
  Box,
  FormControlLabel,
  InputAdornment,
  Switch,
  Tooltip,
  Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { Package } from "../../types/apps/navashipInterfaces";
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
  const [showInsuranceValueField, setShowInsuranceValueField] =
    useState<boolean>(false);
  const [insuranceAmount, setInsuranceAmount] = useState<string>("");

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

  const handleInsuranceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInsuranceAmount(event.target.value);
  };

  useEffect(() => {
    setInsuranceAmount(currentParcel?.value ?? "");
  }, [currentParcel]);

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

        <Grid item>
          <FormControlLabel
            disabled={!currentParcel}
            label="Insure Parcel"
            control={<Switch onChange={insureParcelSwitch} />}
          />
          {showInsuranceValueField && (
            <TextField
              disabled={!currentParcel}
              sx={{ width: 200 }}
              onChange={handleInsuranceChange}
              value={insuranceAmount}
              label="Amount to insure"
              InputLabelProps={{ shrink: true }}
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
