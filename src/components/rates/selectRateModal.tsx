import Box from "@mui/material/Box";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import { Close } from "mdi-material-ui";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { Rate, Shipment } from "../../types/apps/NavashipTypes";
import { useEffect, useState } from "react";
import {
  buyShipmentRate,
  clearBuyShipmentError,
  clearBuyShipmentRateStatus,
  clearRates,
  fetchRates
} from "../../store/apps/shipments";
import RateSelect from "./rateSelect";
import Grid from "@mui/material/Grid";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

interface SelectRateModalProps {
  open: boolean;
  handleDialogToggle: () => void;
  shipment?: Shipment;
}

const SelectRateModal = ({
  open,
  handleDialogToggle,
  shipment
}: SelectRateModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const shipmentStore = useSelector((state: RootState) => state.shipments);
  const rates = useSelector(
    (state: RootState) => state.shipments.selectedRates
  );
  const [selectedRate, setSelectedRate] = useState<Rate | null>();
  // Select rate button loading
  const [selectRateLoading, setSelectRateLoading] = useState<boolean>(false);
  const auth = useAuth();

  useEffect(() => {
    if (shipment) {
      dispatch(fetchRates(shipment?.id));
    }
  }, [shipment]);

  const { handleSubmit: handleRateSubmit } = useForm();

  const onSubmitSelectRate = async () => {
    const setShipmentRatePayload = {
      easypostShipmentId: shipment?.easypostShipmentId,
      easypostRateId: selectedRate?.id
    };

    setSelectRateLoading(true);
    await dispatch(buyShipmentRate(setShipmentRatePayload));
    setSelectRateLoading(false);

    // use effect handle toaster message and reset
  };

  useEffect(() => {
    // Handle page once rate is bought
    if (shipmentStore.buyShipmentRateStatus === "SUCCESS") {
      toast.success("Label was successfully purchased", {
        position: "top-center"
      });
      handleDialogToggle();
    } else if (shipmentStore.buyShipmentRateStatus === "ERROR") {
      toast.error(
        `Error: ${shipmentStore.buyShipmentError ?? "Error buying label"}`,
        {
          position: "top-center"
        }
      );
      handleDialogToggle();
      dispatch(clearBuyShipmentError());
    }
    dispatch(clearBuyShipmentRateStatus());
  }, [shipmentStore.buyShipmentRateStatus]);

  const getPurchaseLabelMessage = (selectedRate: Rate | null | undefined) => {
    return (
      <Typography my={4} variant="body2">
        {selectedRate ? (
          <Box>
            {"You're going to be charged "}
            <Typography variant="body2" fontWeight="bold" component="span">
              ${selectedRate.rate}
            </Typography>
            {" via "}
            {auth.user?.subscriptionDetail.cardType?.toUpperCase()} ending with{" "}
            {auth.user?.subscriptionDetail.cardLastFourDigits}
          </Box>
        ) : (
          <Box sx={{ visibility: "hidden" }}>&nbsp;</Box>
        )}
      </Typography>
    );
  };

  const onClose = () => {
    setSelectedRate(null);
    dispatch(clearRates());
    handleDialogToggle();
  };

  return (
    <Box>
      <Dialog
        fullWidth
        open={open}
        scroll="body"
        maxWidth="md"
        onClose={onClose}
        onBackdropClick={onClose}
        key={`select-rate-modal-${shipment?.id}`}
      >
        <DialogTitle>
          <Box sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Buy Rate
            </Typography>
            <Typography variant="body2">
              Please select a rate that you would like to purchase
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleDialogToggle}
            sx={{ position: "absolute", right: "1rem", top: "1rem" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: 8,
            px: { xs: 8, sm: 15 },
            pt: { xs: 8, sm: 12.5 }
          }}
        >
          {/*<ShippingLabel*/}
          {/*  sourceAddress={shipment?.addresses.find(*/}
          {/*    (address) => address.type === ShipmentAddressType.SOURCE*/}
          {/*  )}*/}
          {/*  deliveryAddress={shipment?.addresses.find(*/}
          {/*    (address) => address.type === ShipmentAddressType.DESTINATION*/}
          {/*  )}*/}
          {/*  parcel={shipment?.parcel}*/}
          {/*  hideTitle={true}*/}
          {/*/>*/}
          <form onSubmit={handleRateSubmit(onSubmitSelectRate)}>
            <Grid item xs={12} mb={8}>
              <RateSelect
                rates={rates}
                selectedRate={selectedRate}
                setSelectedRate={setSelectedRate}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "end" }}>
              {getPurchaseLabelMessage(selectedRate)}
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <LoadingButton
                size="large"
                type="submit"
                disabled={rates?.length == 0 || selectedRate == null}
                loading={selectRateLoading}
                loadingIndicator="Loading..."
                variant="contained"
              >
                Buy rate
              </LoadingButton>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SelectRateModal;
