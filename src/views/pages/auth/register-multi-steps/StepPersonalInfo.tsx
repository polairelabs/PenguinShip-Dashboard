import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";

import Icon from "src/@core/components/icon";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormHelperText } from "@mui/material";

interface Props {
  formData: any;
  handleChange: (event: any) => void;
  handleNext: () => void;
  handlePrev?: () => void;
}

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .max(30, "Last name must be at most 30 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .max(30, "Last name must be at most 30 characters"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  address: yup.string().required("Address is required"),
  phoneNumber: yup
    .string()
    .min(10, "Phone number is not valid")
    .max(20, "Phone number is not valid")
    .required("Phone number is required")
    .transform((v, o) => (o === "" ? null : v))
    .matches(phoneRegExp, "Phone number is not valid")
});

interface PersonalInfo {
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  address: string;
  phoneNumber: string;
}

const StepPersonalDetails = ({
  formData,
  handleChange,
  handleNext,
  handlePrev
}: Props) => {
  const defaultValues: PersonalInfo = {
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    address: "",
    phoneNumber: "US (+1)"
  };

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: async (data, context, options) => {
      // @ts-ignore
      return yupResolver(schema)(formData, context, options);
    }
  });

  const onSubmit = (data) => {
    handleNext();
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5">Personal Information</Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Enter Your Personal Information
        </Typography>
      </Box>

      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  fullWidth
                  placeholder="john"
                  label="First Name"
                  error={!!errors.firstName}
                />
              )}
            />
            {errors.firstName && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.firstName.message}
              </FormHelperText>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="lastName"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  fullWidth
                  label="Last Name"
                  placeholder="Doe"
                  error={!!errors.lastName}
                />
              )}
            />
            {errors.lastName && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.lastName.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="phoneNumber"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Mobile"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="202 555 0111"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">US (+1)</InputAdornment>
                    )
                  }}
                  error={!!errors.phoneNumber}
                />
              )}
            />
            {errors.phoneNumber && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.phoneNumber.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="state-select">State</InputLabel>
              <Controller
                name="state"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <Select
                    value={formData.state}
                    onChange={handleChange}
                    name="state"
                    labelId="state-select"
                    label="State"
                    defaultValue="New York"
                    error={!!errors.state}
                  >
                    <MenuItem value="Alabama">Alabama</MenuItem>
                    <MenuItem value="Alaska">Alaska</MenuItem>
                    <MenuItem value="Arizona">Arizona</MenuItem>
                    <MenuItem value="Arkansas">Arkansas</MenuItem>
                    <MenuItem value="California">California</MenuItem>
                    <MenuItem value="Colorado">Colorado</MenuItem>
                    <MenuItem value="Connecticut">Connecticut</MenuItem>
                    <MenuItem value="Delaware">Delaware</MenuItem>
                    <MenuItem value="Florida">Florida</MenuItem>
                    <MenuItem value="Georgia">Georgia</MenuItem>
                    <MenuItem value="Hawaii">Hawaii</MenuItem>
                    <MenuItem value="Idaho">Idaho</MenuItem>
                    <MenuItem value="Illinois">Illinois</MenuItem>
                    <MenuItem value="Indiana">Indiana</MenuItem>
                    <MenuItem value="Iowa">Iowa</MenuItem>
                    <MenuItem value="Kansas">Kansas</MenuItem>
                    <MenuItem value="Kentucky">Kentucky</MenuItem>
                    <MenuItem value="Louisiana">Louisiana</MenuItem>
                    <MenuItem value="Maine">Maine</MenuItem>
                    <MenuItem value="Maryland">Maryland</MenuItem>
                    <MenuItem value="Massachusetts">Massachusetts</MenuItem>
                    <MenuItem value="Michigan">Michigan</MenuItem>
                    <MenuItem value="Minnesota">Minnesota</MenuItem>
                    <MenuItem value="Mississippi">Mississippi</MenuItem>
                    <MenuItem value="Missouri">Missouri</MenuItem>
                    <MenuItem value="Montana">Montana</MenuItem>
                    <MenuItem value="Nebraska">Nebraska</MenuItem>
                    <MenuItem value="Nevada">Nevada</MenuItem>
                    <MenuItem value="New Hampshire">New Hampshire</MenuItem>
                    <MenuItem value="New Jersey">New Jersey</MenuItem>
                    <MenuItem value="New Mexico">New Mexico</MenuItem>
                    <MenuItem value="New York">New York</MenuItem>
                    <MenuItem value="North Carolina">North Carolina</MenuItem>
                    <MenuItem value="North Dakota">North Dakota</MenuItem>
                    <MenuItem value="Ohio">Ohio</MenuItem>
                    <MenuItem value="Oklahoma">Oklahoma</MenuItem>
                    <MenuItem value="Oregon">Oregon</MenuItem>
                    <MenuItem value="Pennsylvania">Pennsylvania</MenuItem>
                    <MenuItem value="Rhode Island">Rhode Island</MenuItem>
                    <MenuItem value="South Carolina">South Carolina</MenuItem>
                    <MenuItem value="South Dakota">South Dakota</MenuItem>
                    <MenuItem value="Tennessee">Tennessee</MenuItem>
                    <MenuItem value="Texas">Texas</MenuItem>
                    <MenuItem value="Utah">Utah</MenuItem>
                    <MenuItem value="Vermont">Vermont</MenuItem>
                    <MenuItem value="Virginia">Virginia</MenuItem>
                    <MenuItem value="Washington">Washington</MenuItem>
                    <MenuItem value="West Virginia">West Virginia</MenuItem>
                    <MenuItem value="Wisconsin">Wisconsin</MenuItem>
                    <MenuItem value="Wyoming">Wyoming</MenuItem>
                    {/* Canadian Provinces */}
                    <MenuItem value="Alberta">Alberta</MenuItem>
                    <MenuItem value="British Columbia">British Columbia</MenuItem>
                    <MenuItem value="Manitoba">Manitoba</MenuItem>
                    <MenuItem value="New Brunswick">New Brunswick</MenuItem>
                    <MenuItem value="Newfoundland and Labrador">Newfoundland and Labrador</MenuItem>
                    <MenuItem value="Northwest Territories">Northwest Territories</MenuItem>
                    <MenuItem value="Nova Scotia">Nova Scotia</MenuItem>
                    <MenuItem value="Nunavut">Nunavut</MenuItem>
                    <MenuItem value="Ontario">Ontario</MenuItem>
                    <MenuItem value="Prince Edward Island">Prince Edward Island</MenuItem>
                    <MenuItem value="Quebec">Quebec</MenuItem>
                    <MenuItem value="Saskatchewan">Saskatchewan</MenuItem>
                  </Select>
                )}
              />
              {errors.state && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.state.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="address"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    label="Address"
                    placeholder="7777, Mendez Plains, Florida"
                    error={!!errors.address}
                  />
                )}
              />
              {errors.address && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.address.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="city"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  fullWidth
                  label="City"
                  placeholder="Miami"
                  error={!!errors.city}
                />
              )}
            />
            {errors.city && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.city.message}
              </FormHelperText>
            )}
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                color="secondary"
                variant="contained"
                onClick={handlePrev}
                startIcon={<Icon icon="mdi:chevron-left" fontSize={20} />}
              >
                Previous
              </Button>
              <Button
                type="submit"
                variant="contained"
                endIcon={<Icon icon="mdi:chevron-right" fontSize={20} />}
              >
                Next
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default StepPersonalDetails;
