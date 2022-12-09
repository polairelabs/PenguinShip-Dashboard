import { ChangeEvent, Fragment, useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Step from "@mui/material/Step";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

import StepperCustomDot from "./StepperCustomDot";

import StepperWrapper from "src/@core/styles/mui/stepper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import BaseApi from "../../../api/api";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { createShipment, setShipmentRate } from "../../../store/apps/shipments";
import AddressFormSelect, { AddressType } from "../../../components/addresses/addressFormSelect";
import { Address, Package } from "../../../types/apps/navashipInterfaces";
import ShippingLabel from "../../../components/shippingLabel/ShippingLabel";
import PackageFormSelect from "../../../components/packages/packageFormSelect";

const steps = [
  {
    title: "Source address",
    subtitle: "Set source address"
  },
  {
    title: "Delivery address",
    subtitle: "Set delivery address"
  },
  {
    title: "Parcel",
    subtitle: "Set the parcel to be sent"
  },
  {
    title: "Rates",
    subtitle: "Choose a shipping rate"
  }
];

const defaultSourceAddressValues = {
  source: ""
};

const defaultDeliveryAddressValues = {
  delivery: ""
};

const defaultAdditionalInfoValues = {
  name: "",
  company: "",
  phone: "",
  email: "",
}

const defaultPackageValues = {
  parcel: ""
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

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const additionalInfoSchema = yup.object().shape({
  name: yup.string().optional().max(30, "Name must be at most 30 characters").nullable(true),
  company: yup.string().optional().max(30,"Company must be at most 30 characters").nullable(true),
  email: yup.string().email("Email is not valid").optional().nullable(true),
  phone: yup.string().matches(phoneRegExp, "Phone number is not valid").optional().nullable(true),
});

const fromAddressSchema = additionalInfoSchema.shape({
  source: yup.string().required("Source address is required"),
});

const deliveryAddressSchema = additionalInfoSchema.shape({
  delivery: yup.string().required("Delivery address is required"),
});

const packageSchema = additionalInfoSchema.shape({
  parcel: yup.string().required("Parcel is required"),
});

const StepperLinearWithValidation = (props) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();

  // const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectableAddresses, setSelectableAddresses] = useState<Address[]>([]);

  const [sourceAddress, setSourceAddress] = useState<Address | null>();
  const [deliveryAddress, setDeliveryAddress] = useState<Address | null>();

  const [selectablePackages, setSelectablePackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>();

  // TODO add type for Rate
  const [selectedRate, setSelectedRate] = useState({});

  // @ts-ignore
  const shipment = useSelector((state) => state.shipments.data);

  // @ts-ignore
  const rates = useSelector((state) => state.shipments.rates);

  useEffect(() => {
    async function fetchAddresses() {
      const response: Address[] = await BaseApi.get("/addresses");
      setSelectableAddresses(response);
    }

    async function fetchPackages() {
      const response: Package[] = await BaseApi.get("/packages");
      setSelectablePackages(response);
    }

    fetchAddresses();
    fetchPackages();
  }, []);

  const handleSourceAddressChange = (newSourceAddress: Address | null) => {
    if (newSourceAddress) {
      setSourceAddress(newSourceAddress);
      setSelectableAddresses(
        selectableAddresses.filter((address) => address.id !== newSourceAddress?.id)
      );
    } else {
      if (sourceAddress)
        setSelectableAddresses((list: (Address)[]) => [...list, sourceAddress]);
      setSourceAddress(null);
    }
  }

  const handleDestinationAddressChange = (deliveryAddress: Address | null) => {
    setDeliveryAddress(deliveryAddress);
  };

  const handleSelectedPackageChange = (parcel: Package | null) => {
    setSelectedPackage(parcel);
  };

  const handleAdditionalInfoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const additionalInfoDetailName = event.target.name;
    const additionalInfoDetailValue = event.target.value;

    const newAddressAdditionalInfoValue = {};
    newAddressAdditionalInfoValue[additionalInfoDetailName] = additionalInfoDetailValue;
    return newAddressAdditionalInfoValue;
  };

  const handleSourceAdditionalInfoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSourceAddress({ ...sourceAddress, ...handleAdditionalInfoChange(event) } as Address);
  }

  const handleDeliveryAdditionalInfoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDeliveryAddress({ ...deliveryAddress, ...handleAdditionalInfoChange(event) } as Address);
  }

  const {
    control: sourceAddressControl,
    handleSubmit: handleSourceAddressSubmit,
    formState: { errors: sourceAddressErrors }
  } = useForm({
    defaultValues: {...defaultSourceAddressValues, ...defaultAdditionalInfoValues},
    resolver: async (data, context, options) => {
      const schemaValues = { "source": sourceAddress?.street1, ...sourceAddress };
      // @ts-ignore
      return yupResolver(fromAddressSchema)(schemaValues, context, options);
    }
  });

  const {
    control: deliveryAddressControl,
    handleSubmit: handleDeliveryAddressSubmit,
    formState: { errors: deliveryAddressErrors }
  } = useForm({
    defaultValues: {...defaultDeliveryAddressValues, ...defaultAdditionalInfoValues},
    resolver: async (data, context, options) => {
      const schemaValues = { "delivery": deliveryAddress?.street1, ...deliveryAddress };
      // @ts-ignore
      return yupResolver(deliveryAddressSchema)(schemaValues, context, options);
    }
  });

  const {
    control: packageControl,
    handleSubmit: handlePackageSubmit,
    formState: { errors: packageErrors }
  } = useForm({
    defaultValues: defaultPackageValues,
    resolver: async (data, context, options) => {
      const schemaValues = { "parcel": selectedPackage?.name };
      // @ts-ignore
      return yupResolver(packageSchema)(schemaValues, context, options);
    }
  });

  const {
    reset: personalReset,
    control: personalControl,
    handleSubmit: handlePersonalSubmit,
    formState: { errors: personalErrors }
  } = useForm({
    defaultValues: defaultPersonalValues,
    // resolver: yupResolver(personalSchema)
  });

  const {
    reset: socialReset,
    control: socialControl,
    handleSubmit: handleSocialSubmit,
    formState: { errors: socialErrors }
  } = useForm({
    defaultValues: defaultSocialValues,
    // resolver: yupResolver(socialSchema)
  });

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const onSubmitAddress = () => {
    setActiveStep(activeStep + 1);
  };

  const onSubmitCreateShipment = async () => {
    // TODO create interface for payload
    const createShipmentPayload = {
      fromAddressId: sourceAddress?.id,
      toAddressId: deliveryAddress?.id,
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

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleSourceAddressSubmit(onSubmitAddress)}>
            <Grid container item spacing={12}>
              <AddressFormSelect
                addressType={AddressType.SOURCE}
                currentAddress={sourceAddress}
                selectableAddresses={selectableAddresses}
                handleAddressChange={handleSourceAddressChange}
                handleAddressAdditionalInformationChange={handleSourceAdditionalInfoChange}
                control={sourceAddressControl}
                errors={sourceAddressErrors}
               />

              <ShippingLabel
                sourceAddress={sourceAddress}
                deliveryAddress={deliveryAddress}
                parcel={selectedPackage}
              />

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  disabled>
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
          <form key={0} onSubmit={handleDeliveryAddressSubmit(onSubmitAddress)}>
            <Grid container item spacing={12}>
              <AddressFormSelect
                addressType={AddressType.DELIVERY}
                currentAddress={deliveryAddress}
                selectableAddresses={selectableAddresses}
                handleAddressChange={handleDestinationAddressChange}
                handleAddressAdditionalInformationChange={handleDeliveryAdditionalInfoChange}
                control={deliveryAddressControl}
                errors={deliveryAddressErrors}
              />

              <ShippingLabel
                sourceAddress={sourceAddress}
                deliveryAddress={deliveryAddress}
                parcel={selectedPackage}
              />

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={handleBack}>
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
          <form key={1} onSubmit={handlePackageSubmit(onSubmitCreateShipment)}>
            <Grid container spacing={12}>
              <PackageFormSelect
                currentParcel={selectedPackage}
                selectablePackages={selectablePackages}
                handleSelectedPackageChange={handleSelectedPackageChange}
                control={packageControl}
                errors={packageErrors}
              />

              <ShippingLabel
                sourceAddress={sourceAddress}
                deliveryAddress={deliveryAddress}
                parcel={selectedPackage}
              />

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={handleBack}>
                  Back
                </Button>
                <Button size="large" type="submit" variant="contained">
                  Create shipment
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      case 3:
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
                  (sourceAddressErrors.email ||
                    sourceAddressErrors.username ||
                    sourceAddressErrors.password ||
                    sourceAddressErrors["confirm-password"]) &&
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
