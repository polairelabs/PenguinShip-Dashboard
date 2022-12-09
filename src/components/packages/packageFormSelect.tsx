import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import { Autocomplete, FormControlLabel, Switch } from "@mui/material";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { Package } from "../../types/apps/navashipInterfaces";

interface PackageSelectProps {
  currentParcel: Package | null | undefined,
  selectablePackages: Package[];
  handleSelectedPackageChange: (parcel: Package | null) => void,
  control: any;
  errors: any;
}

const PackageFormSelect = ({currentParcel, selectablePackages, handleSelectedPackageChange, control, errors}: PackageSelectProps) => {
  const handlePackageChange = (event, newValue) => {
    let selectedPackage: Package | null = null;
    errors.parcel = "";

    if (newValue) {
      selectedPackage = findPackage(newValue.id);
    }

    handleSelectedPackageChange(selectedPackage);
  }

  const findPackage = (packageId: number) => {
    return selectablePackages.find((parcel: Package) => parcel.id == packageId) as Package;
  }

  const parcelOptionLabel = (parcel: Package) => {
    return parcel.name;
  }

  return (
    <Grid item xs={12} sm={6} direction="column">
      <Grid item xs={12} sm={6} mb={8}>
        <FormControl fullWidth>
          <Controller
            name="first-name"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                options={selectablePackages}
                id="autocomplete-default"
                value={currentParcel ? currentParcel : null}
                getOptionLabel={(parcel) => parcelOptionLabel(parcel)}
                onChange={handlePackageChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={value}
                    label="Choose parcel"
                    variant="standard"
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
      <Grid container spacing={2} my={1} sx={{"ml": 1}}>
        <FormControlLabel
          label='Insure Parcel'
          sx={{ mt: 2 }}
          control={<Switch onChange={() => {}} />}
        />
      </Grid>
    </Grid>
  )
};

export default PackageFormSelect;