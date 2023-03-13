import { useState, MouseEvent, ChangeEvent } from "react";
import * as yup from "yup";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

import Icon from "src/@core/components/icon";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormHelperText } from "@mui/material";

interface State {
  showPassword: boolean;
  showConfirmPassword: boolean;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be in a valid format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6)
    .required()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
});

interface AccountDetails {
  email: string;
  password: string;
  confirmPassword: string;
}

const StepAccountDetails = ({
  formData,
  handleChange,
  handleNext
}: {
  formData: any;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleNext: () => void;
}) => {
  // ** States
  const [values, setValues] = useState<State>({
    showPassword: false,
    showConfirmPassword: false
  });

  const defaultValues: AccountDetails = {
    email: "",
    password: "",
    confirmPassword: ""
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

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
  };
  const handleMouseDownConfirmPassword = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onSubmit = (data) => {
    handleNext();
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5">Account Information</Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Enter Your Account Details
        </Typography>
      </Box>

      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    error={!!errors.email}
                    type="email"
                    label="Email"
                    placeholder="john.doe@email.com"
                  />
                )}
              />
              {errors.email && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.email.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="input-password">Password</InputLabel>
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    name="password"
                    label="Password"
                    value={formData.password}
                    onChange={handleChange}
                    id="input-password"
                    type={values.showPassword ? "text" : "password"}
                    error={Boolean(errors.password)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          <Icon
                            icon={
                              values.showPassword
                                ? "mdi:eye-outline"
                                : "mdi:eye-off-outline"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="input-confirm-password">
                Confirm Password
              </InputLabel>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    label="Confirm Password"
                    id="input-confirm-password"
                    type={values.showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    name="confirmPassword"
                    error={Boolean(errors.confirmPassword)}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownConfirmPassword}
                        >
                          <Icon
                            icon={
                              values.showConfirmPassword
                                ? "mdi:eye-outline"
                                : "mdi:eye-off-outline"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.confirmPassword && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.confirmPassword.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                disabled
                variant="contained"
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

export default StepAccountDetails;
