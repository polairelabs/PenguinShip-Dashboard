// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Step from "@mui/material/Step";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { DataGrid } from "@mui/x-data-grid";

// ** Third Party Imports
import * as yup from "yup";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

// ** Icons Imports

// ** Custom Components Imports
import StepperCustomDot from "./StepperCustomDot";

// ** Styled Components
import StepperWrapper from "src/@core/styles/mui/stepper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import BaseApi from "../../../api/api";
import {
  Autocomplete,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { Address } from "../../../types/apps/addressType";
import { Package } from "../../../types/apps/packageType";
import { createShipment, setShipmentRate } from "../../../store/apps/shipments";

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
    subtitle: "Set a parcel to be sent"
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
  // country: yup.string().required(),
  // "last-name": yup.string().required(),
  // "first-name": yup.string().required(),
  // language: yup.array().min(1).required()
});

const socialSchema = yup.object().shape({
  // google: yup.string().required(),
  // twitter: yup.string().required(),
  // facebook: yup.string().required(),
  // linkedIn: yup.string().required()
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

  const [sourceAddress, setSourceAddress] = useState<Address | null>();
  const [destinationAddress, setDestinationAddress] = useState<Address>();

  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package>();

  // TODO add type for Rate
  const [selectedRate, setSelectedRate] = useState({});

  // @ts-ignore
  const shipment = useSelector((state) => state.shipments.data);

  // @ts-ignore
  const rates = useSelector((state) => state.shipments.rates);

  useEffect(() => {
    async function fetchAddresses() {
      const response: Address[] = await BaseApi.get("/addresses");
      setAddresses(response);
      setSelectableAddresses(response);
    }

    async function fetchPackages() {
      const response: Package[] = await BaseApi.get("/packages");
      setPackages(response);
    }

    fetchAddresses();
    fetchPackages();
  }, []);

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
    console.log("sourceAddress: ", sourceAddress);
    console.log("destinationAddress: ", destinationAddress);
    console.log("selectedPackage: ", selectedPackage);

    setActiveStep(activeStep + 1);
    // if (activeStep === steps.length - 1) {
    //   toast.success("Form Submitted");
    // }
  };

  const dispatch = useDispatch<AppDispatch>();

  const onSubmitCreateShipment = async () => {
    // TODO create interface for payload
    const createShipmentPayload = {
      fromAddressId: sourceAddress?.id,
      toAddressId: destinationAddress?.id,
      parcelId: selectedPackage?.id
    };

    await dispatch(createShipment(createShipmentPayload));
    // TODO add loading here
    // console.log("RATES", rates);

    setActiveStep(activeStep + 1);
  };

  const onSubmitSetRate = async () => {
    // TODO
    console.log(`Setting rate ${selectedRate["id"]}`);
    const setShipmentRatePayload = {
      easypostShipmentId: shipment?.id,
      easypostRateId: selectedRate?.id
    };
    await dispatch(setShipmentRate(setShipmentRatePayload));
    if (activeStep === steps.length - 1) {
      toast.success("Rate was successfully set");
      setActiveStep(0);
    }
  };

  const findAddress = (addressId: number) => {
    return addresses.find((address) => address.id == addressId);
  };

  const handleSourceAddressChange = (event, newValue) => {
    console.log("1. selectableAddresses", selectableAddresses);
    console.log("newValue", newValue);
    if (!newValue) {
      console.log("CLEARRRR!!");
      // When newValue is empty/null
      if (sourceAddress) {
        // Put back sourceAddress in the list
        setSelectableAddresses((list) => [...list, sourceAddress]);
        setSourceAddress(null);
      }
      return;
    } else if (sourceAddress && newValue.id !== sourceAddress.id) {
      console.log("CHANGED ADDRESS");
      console.log("From", sourceAddress.id, "to", newValue.id);
      // Different address was selected when a different one is already selected, put back sourceAddress in the list and continue
      const currentAddress: Address | undefined = addresses.find(
        (address) => address.id === sourceAddress.id
      );
      if (currentAddress) {
        console.log("2. PUTTING BACK!!!!", currentAddress);
        setSelectableAddresses((list) => [...list, currentAddress]);
      }
      // setSelectableAddresses(
      //   selectableAddresses.filter((address) => address.id !== newValue?.id)
      // );
    }
    setSourceAddress(findAddress(newValue.id));
    // filter out/remove address with newValue.id
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

  const handleSelectedPackageChange = (event, newValue) => {
    setSelectedPackage(newValue);
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

              {/*{selectableAddresses.map((address) => (*/}
              {/*  <Grid>{address.street1}</Grid>*/}
              {/*))}*/}

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
          <form key={1} onSubmit={handlePersonalSubmit(onSubmitCreateShipment)}>
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
                      <Autocomplete
                        options={packages}
                        id="autocomplete-default"
                        getOptionLabel={(parcel) =>
                          parcel.id + " : " + parcel.name
                        }
                        onChange={handleSelectedPackageChange}
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
                  Create shipment
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      case 2:
        return (
          <form key={2} onSubmit={handleSocialSubmit(onSubmitSetRate)}>
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
              <Grid item xs={12}>
                <Card>
                  <TableContainer
                    component={Paper}
                    sx={{
                      "& .MuiTableRow-root:hover": {
                        backgroundColor: "rgba(58, 53, 65, 0.04)"
                      }
                    }}
                  >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Carrier</TableCell>
                          <TableCell align="left">Service</TableCell>
                          <TableCell align="right">Rate (USD)</TableCell>
                          <TableCell align="right">Delivery days</TableCell>
                          <TableCell align="right">
                            Est. delivery days
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rates.map((rate) => (
                          <TableRow
                            onClick={() => setSelectedRate(rate)}
                            key={rate.id}
                            sx={{
                              "&:last-of-type td, &:last-of-type th": {
                                border: 0
                              }
                            }}
                            selected={selectedRate?.id === rate.id}
                          >
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              <Box
                                component="img"
                                alt={rate.carrier}
                                src={`/images/carriers/${rate.carrier}.png`}
                              />
                            </TableCell>
                            <TableCell align="left" sx={{ fontWeight: "bold" }}>
                              {rate.service}
                            </TableCell>
                            <TableCell align="right">${rate.rate}</TableCell>
                            <TableCell align="right">
                              {rate.deliveryDays}
                            </TableCell>
                            <TableCell align="right">
                              {rate.estDeliveryDays}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
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
                  Set rate
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
