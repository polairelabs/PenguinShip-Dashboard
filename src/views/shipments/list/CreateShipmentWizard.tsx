// ** React Imports
import { Fragment, MouseEvent, useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Step from "@mui/material/Step";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import Stepper from "@mui/material/Stepper";
import MenuItem from "@mui/material/MenuItem";
import StepLabel from "@mui/material/StepLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";

// ** Third Party Imports
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

// ** Icons Imports
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";

// ** Custom Components Imports
import StepperCustomDot from "./StepperCustomDot";

// ** Styled Components
import StepperWrapper from "src/@core/styles/mui/stepper";

import { dispatch } from "react-hot-toast/dist/core/store";
import { fetchAddresses } from "../../../store/apps/addresses";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import BaseApi from "../../../api/api";
import { Autocomplete } from "@mui/material";
import { Address } from "../../../types/apps/addressType";

interface State {
  password: string;
  password2: string;
  showPassword: boolean;
  showPassword2: boolean;
}

const steps = [
  {
    title: "Addresses",
    subtitle: "Set source and destination address"
  },
  {
    title: "Parcel",
    subtitle: "Create parcel to be sent"
  },
  {
    title: "Rates",
    subtitle: "Choose shipping rate"
  }
];

const defaultAccountValues = {
  email: "",
  username: "popo",
  password: "",
  "confirm-password": ""
};

const defaultPersonalValues = {
  country: "",
  language: [],
  "last-name": "",
  "first-name": ""
};

const defaultSocialValues = {
  google: "",
  twitter: "",
  facebook: "",
  linkedIn: ""
};

const accountSchema = yup.object().shape({
  username: yup.string().required()
  // email: yup.string().email().required(),
  // password: yup.string().min(6).required(),
  // "confirm-password": yup
  //   .string()
  //   .required()
  //   .oneOf([yup.ref("password"), null], "Passwords must match")
});

const personalSchema = yup.object().shape({
  country: yup.string().required(),
  "last-name": yup.string().required(),
  "first-name": yup.string().required(),
  language: yup.array().min(1).required()
});

const socialSchema = yup.object().shape({
  google: yup.string().required(),
  twitter: yup.string().required(),
  facebook: yup.string().required(),
  linkedIn: yup.string().required()
});

const StepperLinearWithValidation = (props) => {
  const { setAddressDetails } = props;

  const [activeStep, setActiveStep] = useState<number>(0);
  const [state, setState] = useState<State>({
    password: "",
    password2: "",
    showPassword: false,
    showPassword2: false
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectableAddresses, setSelectableAddresses] = useState<Address[]>([]);

  const [sourceAddress, setSourceAddress] = useState<Address>();
  const [destinationAddress, setDestinationAddress] = useState<Address>();

  useEffect(() => {
    async function fetchAddresses() {
      const response: Address[] = await BaseApi.get("/addresses");
      setAddresses(response);
      setSelectableAddresses(response);
    }

    fetchAddresses();
  }, []);

  // ** Hooks
  const {
    reset: accountReset,
    control: accountControl,
    handleSubmit: handleAccountSubmit,
    formState: { errors: accountErrors }
  } = useForm({
    defaultValues: defaultAccountValues,
    resolver: yupResolver(accountSchema)
  });

  const {
    reset: personalReset,
    control: personalControl,
    handleSubmit: handlePersonalSubmit,
    formState: { errors: personalErrors }
  } = useForm({
    defaultValues: defaultPersonalValues,
    resolver: yupResolver(personalSchema)
  });

  const {
    reset: socialReset,
    control: socialControl,
    handleSubmit: handleSocialSubmit,
    formState: { errors: socialErrors }
  } = useForm({
    defaultValues: defaultSocialValues,
    resolver: yupResolver(socialSchema)
  });

  // Handle Stepper
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    socialReset({ google: "", twitter: "", facebook: "", linkedIn: "" });
    accountReset({
      email: "",
      username: "",
      password: "",
      "confirm-password": ""
    });
    personalReset({
      country: "",
      language: [],
      "last-name": "",
      "first-name": ""
    });
  };

  const onSubmit = () => {
    console.log("Values: ", defaultAccountValues);
    console.log("Values: ", sourceAddress);
    console.log("Values: ", destinationAddress);

    setActiveStep(activeStep + 1);
    if (activeStep === steps.length - 1) {
      toast.success("Form Submitted");
    }
  };

  const findAddress = (addressId: number) => {
    return addresses.find((address) => address.id == addressId);
  };

  const handleSourceAddressChange = (event, newValue) => {
    if (!newValue) {
      if (sourceAddress)
        setSelectableAddresses((list) => [...list, sourceAddress]);
      return;
    }
    setSourceAddress(findAddress(newValue.id));
    setSelectableAddresses(
      selectableAddresses.filter((address) => address.id !== newValue?.id)
    );
  };

  const handleDestinationAddressChange = (event, newValue) => {
    if (!newValue) {
      if (destinationAddress)
        setSelectableAddresses((list) => [...list, destinationAddress]);
      return;
    }
    setDestinationAddress(findAddress(newValue.id));
    setSelectableAddresses(
      selectableAddresses.filter((address) => address.id !== newValue?.id)
    );
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleAccountSubmit(onSubmit)}>
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {steps[0].title}
                </Typography>
                <Typography variant="caption" component="p">
                  {steps[0].subtitle}
                </Typography>
              </Grid>

              <Grid container item spacing={6}>
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
                            onChange={handleSourceAddressChange}
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
                          value={sourceAddress?.zip}
                          label="Zip/Postal Code"
                          id="form-props-disabled"
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          disabled
                          value={sourceAddress?.city}
                          label="City"
                          id="form-props-disabled"
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          disabled
                          value={sourceAddress?.country}
                          label="Country"
                          id="form-props-disabled"
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={6} direction="column">
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <Controller
                        name="email"
                        control={accountControl}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          // <TextField
                          //   type="email"
                          //   value={value}
                          //   label="Email"
                          //   onChange={onChange}
                          //   error={Boolean(accountErrors.email)}
                          //   placeholder="carterleonard@gmail.com"
                          //   aria-describedby="stepper-linear-account-email"
                          // />
                          <Autocomplete
                            options={selectableAddresses}
                            id="autocomplete-default"
                            getOptionLabel={(address) => address.street1}
                            onChange={handleDestinationAddressChange}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                value={value}
                                label="Destination address"
                                variant="standard"
                              />
                            )}
                          />
                        )}
                      />
                      {accountErrors.email && (
                        <FormHelperText
                          sx={{ color: "error.main" }}
                          id="stepper-linear-account-email"
                        >
                          {accountErrors.email.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} my={6}>
                    <Grid container item direction="row" spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          disabled
                          value={destinationAddress?.zip}
                          label="Zip/Postal Code"
                          id="form-props-disabled"
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          disabled
                          value={destinationAddress?.city}
                          label="City"
                          id="form-props-disabled"
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          disabled
                          value={destinationAddress?.country}
                          label="Country"
                          id="form-props-disabled"
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  disabled
                >
                  Back
                </Button>
                <Button size="large" type="submit" variant="contained">
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      case 1:
        return (
          <form key={1} onSubmit={handlePersonalSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {steps[1].title}
                </Typography>
                <Typography variant="caption" component="p">
                  {steps[1].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name="first-name"
                    control={personalControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label="First Name"
                        onChange={onChange}
                        placeholder="Leonard"
                        error={Boolean(personalErrors["first-name"])}
                        aria-describedby="stepper-linear-personal-first-name"
                      />
                    )}
                  />
                  {personalErrors["first-name"] && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="stepper-linear-personal-first-name"
                    >
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name="last-name"
                    control={personalControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label="Last Name"
                        onChange={onChange}
                        placeholder="Carter"
                        error={Boolean(personalErrors["last-name"])}
                        aria-describedby="stepper-linear-personal-last-name"
                      />
                    )}
                  />
                  {personalErrors["last-name"] && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="stepper-linear-personal-last-name"
                    >
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel
                    id="stepper-linear-personal-country"
                    error={Boolean(personalErrors.country)}
                    htmlFor="stepper-linear-personal-country"
                  >
                    Country
                  </InputLabel>
                  <Controller
                    name="country"
                    control={personalControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        value={value}
                        label="Country"
                        onChange={onChange}
                        error={Boolean(personalErrors.country)}
                        labelId="stepper-linear-personal-country"
                        aria-describedby="stepper-linear-personal-country-helper"
                      >
                        <MenuItem value="UK">UK</MenuItem>
                        <MenuItem value="USA">USA</MenuItem>
                        <MenuItem value="Australia">Australia</MenuItem>
                        <MenuItem value="Germany">Germany</MenuItem>
                      </Select>
                    )}
                  />
                  {personalErrors.country && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="stepper-linear-personal-country-helper"
                    >
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel
                    error={Boolean(personalErrors.language)}
                    htmlFor="stepper-linear-personal-language"
                    id="stepper-linear-personal-language-label"
                  >
                    Language
                  </InputLabel>
                  <Controller
                    name="language"
                    control={personalControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        multiple
                        onChange={onChange}
                        id="stepper-linear-personal-language"
                        value={Array.isArray(value) ? value : []}
                        error={Boolean(personalErrors.language)}
                        labelId="stepper-linear-personal-language-label"
                        input={
                          <OutlinedInput
                            label="Language"
                            id="stepper-linear-select-multiple-language"
                          />
                        }
                      >
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="French">French</MenuItem>
                        <MenuItem value="Spanish">Spanish</MenuItem>
                        <MenuItem value="Portuguese">Portuguese</MenuItem>
                        <MenuItem value="Italian">Italian</MenuItem>
                        <MenuItem value="German">German</MenuItem>
                        <MenuItem value="Arabic">Arabic</MenuItem>
                      </Select>
                    )}
                  />
                  {personalErrors.language && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="stepper-linear-personal-language-helper"
                    >
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button size="large" type="submit" variant="contained">
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      case 2:
        return (
          <form key={2} onSubmit={handleSocialSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {steps[2].title}
                </Typography>
                <Typography variant="caption" component="p">
                  {steps[2].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name="twitter"
                    control={socialControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label="Twitter"
                        onChange={onChange}
                        error={Boolean(socialErrors.twitter)}
                        placeholder="https://twitter.com/carterLeonard"
                        aria-describedby="stepper-linear-social-twitter"
                      />
                    )}
                  />
                  {socialErrors.twitter && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="stepper-linear-social-twitter"
                    >
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name="facebook"
                    control={socialControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label="Facebook"
                        onChange={onChange}
                        error={Boolean(socialErrors.facebook)}
                        placeholder="https://facebook.com/carterLeonard"
                        aria-describedby="stepper-linear-social-facebook"
                      />
                    )}
                  />
                  {socialErrors.facebook && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="stepper-linear-social-facebook"
                    >
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name="google"
                    control={socialControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label="Google+"
                        onChange={onChange}
                        error={Boolean(socialErrors.google)}
                        aria-describedby="stepper-linear-social-google"
                        placeholder="https://plus.google.com/carterLeonard"
                      />
                    )}
                  />
                  {socialErrors.google && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="stepper-linear-social-google"
                    >
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name="linkedIn"
                    control={socialControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label="LinkedIn"
                        onChange={onChange}
                        error={Boolean(socialErrors.linkedIn)}
                        placeholder="https://linkedin.com/carterLeonard"
                        aria-describedby="stepper-linear-social-linkedIn"
                      />
                    )}
                  />
                  {socialErrors.linkedIn && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="stepper-linear-social-linkedIn"
                    >
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button size="large" type="submit" variant="contained">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed!</Typography>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Button size="large" variant="contained" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Fragment>
      );
    } else {
      return getStepContent(activeStep);
    }
  };

  return (
    <Card>
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps: {
                error?: boolean;
              } = {};
              if (index === activeStep) {
                labelProps.error = false;
                if (
                  (accountErrors.email ||
                    accountErrors.username ||
                    accountErrors.password ||
                    accountErrors["confirm-password"]) &&
                  activeStep === 0
                ) {
                  labelProps.error = true;
                } else if (
                  (personalErrors.country ||
                    personalErrors.language ||
                    personalErrors["last-name"] ||
                    personalErrors["first-name"]) &&
                  activeStep === 1
                ) {
                  labelProps.error = true;
                } else if (
                  (socialErrors.google ||
                    socialErrors.twitter ||
                    socialErrors.facebook ||
                    socialErrors.linkedIn) &&
                  activeStep === 2
                ) {
                  labelProps.error = true;
                } else {
                  labelProps.error = false;
                }
              }

              return (
                <Step key={index}>
                  <StepLabel
                    {...labelProps}
                    StepIconComponent={StepperCustomDot}
                  >
                    <div className="step-label">
                      <Typography className="step-number">
                        0{index + 1}
                      </Typography>
                      <div>
                        <Typography className="step-title">
                          {step.title}
                        </Typography>
                        <Typography className="step-subtitle">
                          {step.subtitle}
                        </Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <Divider sx={{ m: 0 }} />

      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
};

export default StepperLinearWithValidation;
