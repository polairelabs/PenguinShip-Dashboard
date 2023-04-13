import { Rate, ShipmentInsurance } from "../../types/apps/NavashipTypes";
import { calculateInsuranceFee } from "../../utils";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useAuth } from "../../hooks/useAuth";

interface PurchaseLabelMessageProps {
  selectedRate: Rate | null | undefined;
  shipmentInsurance: ShipmentInsurance;
}

const PurchaseLabelMessage = ({
  selectedRate,
  shipmentInsurance
}: PurchaseLabelMessageProps) => {
  const auth = useAuth();

  const getTotalRate = () => {
    if (!selectedRate) {
      return;
    }
    let insuranceFee = 0;
    if (
      shipmentInsurance.isInsured &&
      Number(shipmentInsurance.insuranceAmount) > 0
    ) {
      insuranceFee = calculateInsuranceFee(
        shipmentInsurance.insuranceAmount ?? ""
      );
    }
    return (Number(selectedRate.rate) + insuranceFee).toFixed(2);
  };

  return (
    <Grid my={2}>
      {selectedRate ? (
        <Typography variant="body2">
          {auth.user?.subscriptionDetail.cardType ? (
            <>
              {"You're going to be charged "}
              <Typography variant="body2" fontWeight="bold" component="span">
                ${getTotalRate()}
              </Typography>
              {" via "}
              {auth.user?.subscriptionDetail.cardType?.toUpperCase()} ending
              with {auth.user?.subscriptionDetail.cardLastFourDigits}
            </>
          ) : (
            "No payment method defined. Go to user settings to set payment method"
          )}
        </Typography>
      ) : (
        <Box>&nbsp;</Box>
      )}
    </Grid>
  );
};

export default PurchaseLabelMessage;
