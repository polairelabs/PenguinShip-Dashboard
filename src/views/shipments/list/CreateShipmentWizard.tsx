import { ChangeEvent, useEffect, useState } from "react";

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
import {
  buyShipmentRate, clearBuyShipmentError,
  clearBuyShipmentRateStatus,
  clearCreateShipmentError,
  clearCreateShipmentStatus,
  createShipment
} from "../../../store/apps/shipments";
import SelectAddressFormController, {
  AddressType
} from "../../../components/addresses/selectAddressFormController";
import { Address, Package, Rate } from "../../../types/apps/navashipInterfaces";
import ShippingLabel from "../../../components/shippingLabel/ShippingLabel";
import SelectPackageFormController from "../../../components/packages/selectPackageFormController";
import { fetchAddresses } from "../../../store/apps/addresses";
import RateSelect from "../../../components/rates/rateSelect";
import { LoadingButton } from "@mui/lab";
import AddressModal from "../../../components/addresses/addressModal";
import PackageModal from "../../../components/packages/packagesModal";
import { fetchPackages } from "../../../store/apps/packages";
import { Box } from "@mui/material";
import styled from "@emotion/styled";
import { useTheme } from "@mui/material/styles";

const steps = [
  {
    title: "Source address",
    subtitle: "Set source address",
    description: "Select an existing source address",
    notExist: "Address doesn't exist?"
  },
  {
    title: "Delivery address",
    subtitle: "Set delivery address",
    description: "Select an existing delivery address",
    notExist: "Address doesn't exist?"
  },
  {
    title: "Parcel",
    subtitle: "Set the parcel to be sent",
    description: "Select an existing parcel",
    notExist: "Parcel doesn't exist?"
  },
  {
    title: "Rates",
    subtitle: "Choose a shipping rate",
    description: "Select one of these following rates"
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
  email: ""
};

const defaultPackageValues = {
  parcel: ""
};

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const additionalInfoSchema = yup.object().shape({
  name: yup
    .string()
    .optional()
    .max(30, "Name must be at most 30 characters")
    .nullable(true),
  company: yup
    .string()
    .optional()
    .max(30, "Company must be at most 30 characters")
    .nullable(true),
  email: yup.string().email("Email is not valid").optional().nullable(true),
  // transform() empty string into a null
  phone: yup
    .string()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .matches(phoneRegExp, "Phone number is not valid")
    .optional()
    .nullable(true)
});

const fromAddressSchema = additionalInfoSchema.shape({
  source: yup.string().required("Source address is required")
});

const deliveryAddressSchema = additionalInfoSchema.shape({
  delivery: yup.string().required("Delivery address is required")
});

const packageSchema = additionalInfoSchema.shape({
  parcel: yup.string().required("Parcel is required")
});

const CreateShipmentWizard = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const shipmentStore = useSelector((state: RootState) => state.shipments);

  // Lists from the store
  const addresses = useSelector(
    (state: RootState) => state.addresses.data
  ) as Address[];
  const packages = useSelector(
    (state: RootState) => state.packages.data
  ) as Package[];
  const rates = useSelector(
    (state: RootState) => state.shipments.createdShipmentRates
  ) as Rate[];

  // Selectable lists as to not change the store when we filter on them
  const [selectableAddresses, setSelectableAddresses] = useState<Address[]>([]);
  const [selectablePackages, setSelectablePackages] = useState<Package[]>([]);

  const lastInsertedAddress = useSelector(
    (state: RootState) => state.addresses.lastInsertedAddress
  ) as Address;
  const lastInsertedPackage = useSelector(
    (state: RootState) => state.packages.lastInsertedPackage
  ) as Package;

  // Selected entities
  const [sourceAddress, setSourceAddress] = useState<Address | null>();
  const [deliveryAddress, setDeliveryAddress] = useState<Address | null>();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>();
  const [selectedRate, setSelectedRate] = useState<Rate | null>();

  // To show/hide "Rate is required error"
  const [showRateError, setShowRateError] = useState<boolean>(false);

  // To create a shipment or keep old one
  const [createNewShipment, setCreateNewShipment] = useState<boolean>(true);
  // Create shipment loading
  const [createShipmentLoading, setCreateShipmentLoading] =
    useState<boolean>(false);
  // Select rate loading
  const [selectRateLoading, setSelectRateLoading] = useState<boolean>(false);

  // Modals
  const [openAddressModal, setOpenAddressModal] = useState<boolean>(false);
  const [openPackageModal, setOpenPackageModal] = useState<boolean>(false);

  const handleAddressModalToggle = () => {
    setOpenAddressModal(!openAddressModal);
  };

  const handlePackageModalToggle = () => {
    setOpenPackageModal(!openPackageModal);
  };

  const SOURCE_ADDRESS_SELECT_INDEX = 0;
  const DELIVERY_ADDRESS_SELECT_INDEX = 1;
  const PARCEL_SELECT_INDEX = 2;

  useEffect(() => {
    dispatch(fetchAddresses({ order: "desc" }));
    dispatch(fetchPackages({ order: "desc" }));
  }, [dispatch]);

  // Once addresses in store change
  useEffect(() => {
    setSelectableAddresses(addresses);
  }, [addresses]);

  // Once packages in store change
  useEffect(() => {
    setSelectablePackages(packages);
  }, [packages]);

  // Invalidate user selected rate when addresses or parcel change, in this case a new shipment will always be created
  useEffect(() => {
    setSelectedRate(null);
    setCreateNewShipment(true);
  }, [sourceAddress, deliveryAddress, selectedPackage]);

  // Hide "Rate required" error accordingly
  useEffect(() => {
    setShowRateError(false);
  }, [selectedRate]);

  // If new address was created in Address Modal
  useEffect(() => {
    // Populate address with the last inserted
    if (activeStep === SOURCE_ADDRESS_SELECT_INDEX) {
      setSourceAddress(lastInsertedAddress);
    } else if (activeStep === DELIVERY_ADDRESS_SELECT_INDEX) {
      setDeliveryAddress(lastInsertedAddress);
    }
  }, [lastInsertedAddress]);

  // If new package was created in Package Modal
  useEffect(() => {
    // Populate package with the last inserted
    setSelectedPackage(lastInsertedPackage);
  }, [lastInsertedPackage]);

  useEffect(() => {
    // Handle next page from shipment to rates (Once shipment object in the store changes)
    if (shipmentStore.createShipmentStatus === "SUCCESS") {
      toast.success("Shipment was successfully created", {
        position: "top-center"
      });

      setActiveStep(activeStep + 1);
    } else if (shipmentStore.createShipmentStatus === "ERROR") {
      toast.error(
        `Error: ${
          shipmentStore.createShipmentError ?? "Error creating shipment"
        }`,
        {
          position: "top-center"
        }
      );
      dispatch(clearCreateShipmentError());
    }

    dispatch(clearCreateShipmentStatus());
  }, [shipmentStore.createShipmentStatus]);

  useEffect(() => {
    // Handle page once rate is bought
    if (shipmentStore.buyShipmentRateStatus === "SUCCESS") {
      toast.success("Label was successfully purchased", {
        position: "top-center"
      });
      setSourceAddress(null);
      setDeliveryAddress(null);
      setSelectedPackage(null);
      setSelectedRate(null);
      setActiveStep(0);
    } else if (shipmentStore.buyShipmentRateStatus === "ERROR") {
      toast.error(
        `Error: ${shipmentStore.buyShipmentError ?? "Error buying label"}`,
        {
          position: "top-center"
        }
      );
      dispatch(clearBuyShipmentError());
    }
    dispatch(clearBuyShipmentRateStatus());
  }, [shipmentStore.buyShipmentRateStatus]);

  const scrollToTheTop = () => {
    window.scrollTo(0, 0);
  };

  const asAddressValues = (address: Address | null) => {
    return {
      id: address?.id,
      street1: address?.street1,
      street2: address?.street2,
      city: address?.city,
      state: address?.state,
      zip: address?.zip,
      country: address?.country,
      residential: address?.residential
    } as Address;
  };

  const clearSourceAddress = () => {
    if (sourceAddress?.street1) {
      setSourceAddress({ ...sourceAddress, ...asAddressValues(null) });
    }
  };

  const clearDeliveryAddress = () => {
    if (deliveryAddress?.street1) {
      setDeliveryAddress({ ...deliveryAddress, ...asAddressValues(null) });
    }
  };

  const handleSourceAddressChange = (newSourceAddress: Address | null) => {
    if (newSourceAddress) {
      clearSourceAddress(); // Clear if source address already selected
      setSourceAddress({
        ...sourceAddress,
        ...asAddressValues(newSourceAddress)
      });
    } else {
      // newSourceAddress is undefined - Clear sourceAddress when user hits "clear" on the auto complete
      clearSourceAddress();
    }
  };

  const handleDestinationAddressChange = (
    newDeliveryAddress: Address | null
  ) => {
    if (newDeliveryAddress) {
      clearDeliveryAddress(); // Clear if delivery address already selected
      setDeliveryAddress({
        ...deliveryAddress,
        ...asAddressValues(newDeliveryAddress)
      });
    } else {
      clearDeliveryAddress();
    }
  };

  const handleSelectedPackageChange = (parcel: Package | null) => {
    setSelectedPackage(parcel);
  };

  const handleAdditionalInfoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const additionalInfoDetailName = event.target.name;
    const additionalInfoDetailValue = event.target.value;

    const newAddressAdditionalInfoValue = {};
    newAddressAdditionalInfoValue[additionalInfoDetailName] =
      additionalInfoDetailValue;
    return newAddressAdditionalInfoValue;
  };

  const handleSourceAdditionalInfoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSourceAddress({
      ...sourceAddress,
      ...handleAdditionalInfoChange(event)
    } as Address);
  };

  const handleDeliveryAdditionalInfoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setDeliveryAddress({
      ...deliveryAddress,
      ...handleAdditionalInfoChange(event)
    } as Address);
  };

  const {
    control: sourceAddressControl,
    handleSubmit: handleSourceAddressSubmit,
    formState: { errors: sourceAddressErrors }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      ...defaultSourceAddressValues,
      ...defaultAdditionalInfoValues
    },
    resolver: async (data, context, options) => {
      const schemaValues = { source: sourceAddress?.street1, ...sourceAddress };
      // @ts-ignore
      return yupResolver(fromAddressSchema)(schemaValues, context, options);
    }
  });

  const {
    control: deliveryAddressControl,
    handleSubmit: handleDeliveryAddressSubmit,
    formState: { errors: deliveryAddressErrors }
  } = useForm({
    defaultValues: {
      ...defaultDeliveryAddressValues,
      ...defaultAdditionalInfoValues
    },
    resolver: async (data, context, options) => {
      const schemaValues = {
        delivery: deliveryAddress?.street1,
        ...deliveryAddress
      };
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
      const schemaValues = { parcel: selectedPackage?.name };
      // @ts-ignore
      return yupResolver(packageSchema)(schemaValues, context, options);
    }
  });

  const { handleSubmit: handleRateSubmit } = useForm();

  const handleBack = () => {
    scrollToTheTop();
    const prevActiveStep = activeStep - 1;
    setActiveStep(prevActiveStep);
    if (prevActiveStep === PARCEL_SELECT_INDEX) {
      // Back from "RATE" STEP
      setShowRateError(false);
      setCreateNewShipment(false);
    }
  };

  const onSubmitAddress = () => {
    scrollToTheTop();
    setActiveStep(activeStep + 1);
  };

  const onSubmitCreateShipment = async () => {
    if (createNewShipment) {
      const createShipmentPayload = {
        fromAddressId: sourceAddress?.id,
        toAddressId: deliveryAddress?.id,
        parcelId: selectedPackage?.id,
        senderName: sourceAddress?.name,
        senderCompany: sourceAddress?.company,
        senderPhone: sourceAddress?.phone,
        senderEmail: sourceAddress?.email,
        receiverName: deliveryAddress?.name,
        receiverCompany: deliveryAddress?.company,
        receiverPhone: deliveryAddress?.phone,
        receiverEmail: deliveryAddress?.email
      };

      setCreateShipmentLoading(true);
      await dispatch(createShipment(createShipmentPayload));
      setCreateShipmentLoading(false);

      // use effect will handle next page stepper
    } else {
      // No new shipment is created
      setActiveStep(activeStep + 1);
    }
  };

  const onSubmitSelectRate = async () => {
    const setShipmentRatePayload = {
      easypostShipmentId: shipmentStore.createdShipment?.id,
      easypostRateId: selectedRate?.id
    };

    // If no rate selected, return and don't submit the form yet
    if (!selectedRate) {
      setShowRateError(true);
      return;
    }

    setSelectRateLoading(true);
    await dispatch(buyShipmentRate(setShipmentRatePayload));
    setSelectRateLoading(false);

    // use effect handle toaster message and reset
  };

  // Style to be applied on the grid that contains the vertical divider between the two columns
  const GridDividerStyle = styled(Grid)(() => ({
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  }));

  // Style to be applied on the second grid column on the left
  const SecondColumnGridStyle = styled(Grid)(() => ({
    [theme.breakpoints.down("sm")]: {
      marginTop: "5.2rem"
    }
  }));

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleSourceAddressSubmit(onSubmitAddress)}>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.primary", mb: 4 }}
                >
                  {steps[activeStep].description}
                </Typography>
                <SelectAddressFormController
                  addressType={AddressType.SOURCE}
                  currentAddress={sourceAddress}
                  selectableAddresses={selectableAddresses}
                  handleAddressChange={handleSourceAddressChange}
                  handleAddressAdditionalInformationChange={
                    handleSourceAdditionalInfoChange
                  }
                  control={sourceAddressControl}
                  errors={sourceAddressErrors}
                />
              </Grid>
              <GridDividerStyle
                item
                container
                sm={1}
                justifyContent="center"
                alignItems="center"
              >
                <Divider orientation="vertical" />
              </GridDividerStyle>
              <SecondColumnGridStyle item xs={12} sm={5}>
                <Grid item>
                  <Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "text.primary", mb: 4 }}
                      >
                        {steps[activeStep].notExist}
                      </Typography>
                    </Box>
                    <Box>
                      <Button
                        sx={{ padding: 2 }}
                        onClick={handleAddressModalToggle}
                        variant="outlined"
                        color="info"
                      >
                        Create Address
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                <Divider
                  orientation="horizontal"
                  sx={{ width: "50%", display: "flex", my: 4 }}
                />
                <ShippingLabel
                  sourceAddress={sourceAddress}
                  deliveryAddress={deliveryAddress}
                  parcel={selectedPackage}
                  rate={selectedRate}
                />
              </SecondColumnGridStyle>
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
          <form key={0} onSubmit={handleDeliveryAddressSubmit(onSubmitAddress)}>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.primary", mb: 4 }}
                >
                  {steps[activeStep].description}
                </Typography>
                <SelectAddressFormController
                  addressType={AddressType.DELIVERY}
                  currentAddress={deliveryAddress}
                  selectableAddresses={selectableAddresses}
                  handleAddressChange={handleDestinationAddressChange}
                  handleAddressAdditionalInformationChange={
                    handleDeliveryAdditionalInfoChange
                  }
                  control={deliveryAddressControl}
                  errors={deliveryAddressErrors}
                />
              </Grid>
              <GridDividerStyle
                item
                container
                sm={1}
                justifyContent="center"
                alignItems="center"
              >
                <Divider orientation="vertical" />
              </GridDividerStyle>
              <SecondColumnGridStyle item xs={12} sm={5}>
                <Grid item xs={12} sm={12}>
                  <Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "text.primary", mb: 4 }}
                      >
                        {steps[activeStep].notExist}
                      </Typography>
                    </Box>
                    <Box>
                      <Button
                        sx={{ padding: 2 }}
                        onClick={handleAddressModalToggle}
                        variant="outlined"
                        color="info"
                      >
                        Create Address
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                <Divider
                  orientation="horizontal"
                  sx={{ width: "50%", display: "flex", my: 4 }}
                />
                <ShippingLabel
                  sourceAddress={sourceAddress}
                  deliveryAddress={deliveryAddress}
                  parcel={selectedPackage}
                  rate={selectedRate}
                />
              </SecondColumnGridStyle>
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
          <form key={1} onSubmit={handlePackageSubmit(onSubmitCreateShipment)}>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.primary", mb: 4 }}
                >
                  {steps[activeStep].description}
                </Typography>
                <SelectPackageFormController
                  currentParcel={selectedPackage}
                  selectablePackages={selectablePackages}
                  handleSelectedPackageChange={handleSelectedPackageChange}
                  control={packageControl}
                  errors={packageErrors}
                />
              </Grid>
              <GridDividerStyle
                item
                container
                sm={1}
                justifyContent="center"
                alignItems="center"
              >
                <Divider orientation="vertical" />
              </GridDividerStyle>
              <SecondColumnGridStyle item xs={12} sm={5}>
                <Grid item xs={12} sm={12}>
                  <Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "text.primary", mb: 4 }}
                      >
                        {steps[activeStep].notExist}
                      </Typography>
                    </Box>
                    <Box>
                      <Button
                        sx={{ padding: 2 }}
                        onClick={handlePackageModalToggle}
                        variant="outlined"
                        color="info"
                      >
                        Create Parcel
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                <Divider
                  orientation="horizontal"
                  sx={{ width: "50%", display: "flex", my: 4 }}
                />
                <ShippingLabel
                  sourceAddress={sourceAddress}
                  deliveryAddress={deliveryAddress}
                  parcel={selectedPackage}
                  rate={selectedRate}
                />
              </SecondColumnGridStyle>
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
                <LoadingButton
                  size="large"
                  type="submit"
                  loading={createShipmentLoading}
                  loadingIndicator="Loading..."
                  variant="contained"
                >
                  {createNewShipment ? "Create shipment" : "Next"}
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        );
      case 3:
        return (
          <form key={2} onSubmit={handleRateSubmit(onSubmitSelectRate)}>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.primary", mb: 4 }}
                >
                  {steps[activeStep].description}
                </Typography>
                <Box height={"40vh"}>
                  <RateSelect
                    rates={rates}
                    selectedRate={selectedRate}
                    setSelectedRate={setSelectedRate}
                    showRateError={showRateError}
                  />
                </Box>
              </Grid>
              <GridDividerStyle
                item
                container
                sm={1}
                justifyContent="center"
                alignItems="center"
              >
                <Divider orientation="vertical" />
              </GridDividerStyle>
              <Grid item xs={12} sm={5}>
                <ShippingLabel
                  sourceAddress={sourceAddress}
                  deliveryAddress={deliveryAddress}
                  parcel={selectedPackage}
                  rate={selectedRate}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "end" }}>
                <Typography my={4} variant="body2">
                  {selectedRate ? `You're going to be charged $${selectedRate?.rate} amount via Visa ending with 1111` : ""}
                </Typography>
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
                <LoadingButton
                  size="large"
                  type="submit"
                  disabled={rates?.length == 0 || selectedRate == null}
                  loading={selectRateLoading}
                  loadingIndicator="Loading..."
                  variant="contained"
                >
                  Buy label
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    return getStepContent(activeStep);
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

      {/* Modals */}
      <AddressModal
        open={openAddressModal}
        handleDialogToggle={handleAddressModalToggle}
        fromShipmentWizard={true}
      />
      <PackageModal
        open={openPackageModal}
        handleDialogToggle={handlePackageModalToggle}
        fromShipmentWizard={true}
      />
    </Card>
  );
};

export default CreateShipmentWizard;
