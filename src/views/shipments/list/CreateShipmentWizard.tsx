import { ChangeEvent, Fragment, useEffect, useState } from "react";

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
import { createShipment, buyShipmentRate } from "../../../store/apps/shipments";
import SelectAddressFormController, { AddressType } from "../../../components/addresses/selectAddressFormController";
import { Address, Package, Rate } from "../../../types/apps/navashipInterfaces";
import ShippingLabel from "../../../components/shippingLabel/ShippingLabel";
import SelectPackageFormController from "../../../components/packages/selectPackageFormController";
import { fetchAddresses } from "../../../store/apps/addresses";
import RateSelect from "../../../components/rates/rateSelect";
import { LoadingButton } from "@mui/lab";
import AddressModal from "../../../components/addresses/addressModal";
import PackageModal from "../../../components/packages/packagesModal";
import { fetchPackages } from "../../../store/apps/packages";

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

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const additionalInfoSchema = yup.object().shape({
  name: yup.string().optional().max(30, "Name must be at most 30 characters").nullable(true),
  company: yup.string().optional().max(30,"Company must be at most 30 characters").nullable(true),
  email: yup.string().email("Email is not valid").optional().nullable(true),
  // transform() empty string into a null
  phone: yup.string().nullable().transform((v, o) => (o === '' ? null : v)).matches(phoneRegExp, "Phone number is not valid").optional().nullable(true),
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

const CreateShipmentWizard = (props) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();

  const shipmentStore = useSelector((state: RootState) => state.shipments);

  let createShipmentStatus;
  let buyShipmentRateStatus;

  // Lists from the store
  const addresses = useSelector((state: RootState) => state.addresses.data) as Address[];
  const packages = useSelector((state: RootState) => state.packages.data) as Package[];
  const rates = useSelector((state: RootState) => state.shipments.rates) as Rate[];

  // Selectable lists as to not change the store when we filter on them
  const [selectableAddresses, setSelectableAddresses] = useState<Address[]>([]);
  const [selectablePackages, setSelectablePackages] = useState<Package[]>([]);

  const lastInsertedAddress = useSelector((state: RootState) => state.addresses.lastInsertedAddress) as Address;
  const lastInsertedPackage = useSelector((state: RootState) => state.packages.lastInsertedPackage) as Package;

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
  const [createShipmentLoading, setCreateShipmentLoading] = useState<boolean>(false);
  // Select rate loading
  const [selectRateLoading, setSelectRateLoading] = useState<boolean>(false);

  // Modals
  const [openAddressModal, setOpenAddressModal] = useState<boolean>(false);
  const [openPackageModal, setOpenPackageModal] = useState<boolean>(false);

  // Used in modals to select last created entry once a new entry is created
  const [createdAddress, setCreatedAddress] = useState<boolean>(false);
  const [createdPackage, setCreatedPackage] = useState<boolean>(false);

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
    dispatch(fetchAddresses());
    dispatch(fetchPackages());
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
    if (createdAddress) {
      if (activeStep === SOURCE_ADDRESS_SELECT_INDEX) {
        setSourceAddress(lastInsertedAddress);
      } else if (activeStep === DELIVERY_ADDRESS_SELECT_INDEX) {
        setDeliveryAddress(lastInsertedAddress);
      }
      setCreatedAddress(false);
    }
  }, [lastInsertedAddress]);

  // If new package was created in Package Modal
  useEffect(() => {
    // Populate address with the last inserted
    if (createdPackage) {
      setSelectedPackage(lastInsertedPackage);
      setCreatedPackage(false);
    }
  }, [lastInsertedPackage]);

  useEffect(() => {
    // Handle next page from shipment to rates (Once rate state change fo to the next page)
    createShipmentStatus = shipmentStore.createShipmentStatus;
    buyShipmentRateStatus = shipmentStore.buyShipmentRateStatus;
    if (createShipmentStatus === "CREATED") {
      toast.success("Shipment successfully created", {
        position: "top-center"
      });

      setActiveStep(activeStep + 1);
    } else if (createShipmentStatus === "FAILED") {
      toast.error("Error creating shipment", {
        position: "top-center"
      });
      return;
    }
  }, [shipmentStore.data])


  const asAddressValues = (address: Address | null) => {
    return {
      id: address?.id ,
      street1: address?.street1,
      street2: address?.street2,
      city: address?.city,
      state: address?.state,
      zip: address?.zip,
      country: address?.country,
    } as Address;
  }

  const handleSourceAddressChange = (newSourceAddress: Address | null) => {
    if (newSourceAddress) {
      setSourceAddress({...sourceAddress, ...asAddressValues(newSourceAddress)});
      // setSelectableAddresses(
      //   selectableAddresses.filter((address) => address.id !== newSourceAddress?.id)
      // );
    } else {
      // if (sourceAddress) {
      //   setSelectableAddresses((list: (Address)[]) => [...list, sourceAddress]);
      // }
      setSourceAddress({...sourceAddress, ...asAddressValues(null)})
    }
  }

  const handleDestinationAddressChange = (newDeliveryAddress: Address | null) => {
    if (newDeliveryAddress) {
      setDeliveryAddress({...deliveryAddress, ...asAddressValues(newDeliveryAddress)});
      // setSelectableAddresses(
      //   selectableAddresses.filter((address) => address.id !== deliveryAddress?.id)
      // );
    } else {
      // if (deliveryAddress) {
      //   setSelectableAddresses((list: (Address)[]) => [...list, deliveryAddress]);
      // }
      setDeliveryAddress({...deliveryAddress, ...asAddressValues(null)});
    }
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
    setSourceAddress({ ...sourceAddress, ...handleAdditionalInfoChange(event)} as Address);
  }

  const handleDeliveryAdditionalInfoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDeliveryAddress({ ...deliveryAddress, ...handleAdditionalInfoChange(event)} as Address);
  }

  const {
    control: sourceAddressControl,
    handleSubmit: handleSourceAddressSubmit,
    formState: { errors: sourceAddressErrors },
  } = useForm({
    mode: "onBlur",
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
    handleSubmit: handleRateSubmit,
  } = useForm();

  const handleBack = () => {
    const prevActiveStep = activeStep - 1;
    setActiveStep(prevActiveStep);
    if (prevActiveStep === PARCEL_SELECT_INDEX) {
      // Back from "RATE" STEP
      setShowRateError(false);
      setCreateNewShipment(false);
    }
  };

  const onSubmitAddress = () => {
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
        receiverEmail: deliveryAddress?.email,
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
      easypostShipmentId: shipmentStore.data?.id,
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

    if (shipmentStore.buyShipmentRateStatus === "CREATED") {
      toast.success("Label successfully created", {
        position: "top-center"
      });
    } else if (shipmentStore.buyShipmentRateStatus === "FAILED") {
      toast.success("Error creating label", {
        position: "top-center"
      });
    }

    toast.success("Label was successfully created", {
      position: "top-center"
    });
    setSourceAddress(null);
    setDeliveryAddress(null);
    setSelectedPackage(null);
    setSelectedRate(null);
    setActiveStep(0);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleSourceAddressSubmit(onSubmitAddress)}>
            <Grid container spacing={12}>
              <SelectAddressFormController
                addressType={AddressType.SOURCE}
                currentAddress={sourceAddress}
                selectableAddresses={selectableAddresses}
                handleAddressChange={handleSourceAddressChange}
                handleAddressAdditionalInformationChange={handleSourceAdditionalInfoChange}
                control={sourceAddressControl}
                errors={sourceAddressErrors}
                handleAddressModalToggle={handleAddressModalToggle}
               />
              <ShippingLabel
                sourceAddress={sourceAddress}
                deliveryAddress={deliveryAddress}
                parcel={selectedPackage}
                rate={selectedRate}
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
              <SelectAddressFormController
                addressType={AddressType.DELIVERY}
                currentAddress={deliveryAddress}
                selectableAddresses={selectableAddresses}
                handleAddressChange={handleDestinationAddressChange}
                handleAddressAdditionalInformationChange={handleDeliveryAdditionalInfoChange}
                control={deliveryAddressControl}
                errors={deliveryAddressErrors}
                handleAddressModalToggle={handleAddressModalToggle}
              />
              <ShippingLabel
                sourceAddress={sourceAddress}
                deliveryAddress={deliveryAddress}
                parcel={selectedPackage}
                rate={selectedRate}
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
              <SelectPackageFormController
                currentParcel={selectedPackage}
                selectablePackages={selectablePackages}
                handleSelectedPackageChange={handleSelectedPackageChange}
                control={packageControl}
                errors={packageErrors}
                handlePackageModalToggle={handlePackageModalToggle}
              />
              <ShippingLabel
                sourceAddress={sourceAddress}
                deliveryAddress={deliveryAddress}
                parcel={selectedPackage}
                rate={selectedRate}
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
                <LoadingButton
                  size="large"
                  type="submit"
                  loading={createShipmentLoading}
                  loadingIndicator="Loading..."
                  variant="contained">
                  {createNewShipment ? "Create shipment" : "Next"}
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        );
      case 3:
        return (
          <form key={2} onSubmit={handleRateSubmit(onSubmitSelectRate)}>
            <Grid container item spacing={12}>
              <Grid item xs={12} sm={6} direction="column">
                <RateSelect
                  rates={rates}
                  selectedRate={selectedRate}
                  setSelectedRate={setSelectedRate}
                  showRateError={showRateError}
                />
              </Grid>
              <ShippingLabel
                sourceAddress={sourceAddress}
                deliveryAddress={deliveryAddress}
                parcel={selectedPackage}
                rate={selectedRate}
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
                <LoadingButton
                  size="large"
                  type="submit"
                  disabled={rates?.length == 0 || selectedRate == null}
                  loading={selectRateLoading}
                  loadingIndicator="Loading..."
                  variant="contained">
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
    // if (activeStep === steps.length) {
    //   return (
    //     <Fragment>
    //       <Typography>All steps are completed!</Typography>
    //       <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
    //         <Button size="large" variant="contained" onClick={handleReset}>
    //           Reset
    //         </Button>
    //       </Box>
    //     </Fragment>
    //   );
    // } else {}
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
              // if (index === activeStep) {
              //   labelProps.error = false;
              //   if (
              //     (sourceAddressErrors.email ||
              //       sourceAddressErrors.username ||
              //       sourceAddressErrors.password ||
              //       sourceAddressErrors["confirm-password"]) &&
              //     activeStep === 0
              //   ) {
              //     labelProps.error = true;
              //   } else if (
              //     (personalErrors.country ||
              //       personalErrors.language ||
              //       personalErrors["last-name"] ||
              //       personalErrors["first-name"]) &&
              //     activeStep === 1
              //   ) {
              //     labelProps.error = true;
              //   } else if (
              //     (socialErrors.google ||
              //       socialErrors.twitter ||
              //       socialErrors.facebook ||
              //       socialErrors.linkedIn) &&
              //     activeStep === 2
              //   ) {
              //     labelProps.error = true;
              //   } else {
              //     labelProps.error = false;
              //   }
              // }

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

      <CardContent>
        {renderContent()}
      </CardContent>

      {/* Modals */}
      <AddressModal open={openAddressModal} handleDialogToggle={handleAddressModalToggle} setCreatedAddress={setCreatedAddress} />
      <PackageModal open={openPackageModal} handleDialogToggle={handlePackageModalToggle} setCreatedPackage={setCreatedPackage} />
    </Card>
  );
};

export default CreateShipmentWizard;
