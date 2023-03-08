import {
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  Radio,
  Switch,
  Typography
} from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import {
  Package,
  Rate,
  ShipmentInsurance
} from "../../types/apps/NavashipTypes";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { calculateInsuranceFee, splitStringByCapitalCase } from "../../utils";

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  borderWidth: 1,
  display: "flex",
  cursor: "pointer",
  borderStyle: "solid",
  padding: theme.spacing(5),
  borderColor: theme.palette.divider,
  "&:first-of-type": {
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius
  },
  "&:last-of-type": {
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius
  }
}));

interface RateSelectProps {
  rates: Rate[];
  selectedRate: Rate | null | undefined;
  setSelectedRate: (rate: Rate | null | undefined) => void;
  setShipmentInsurance: (insurance: ShipmentInsurance) => void;
  parcel: Package | null | undefined;
  showRateError?: any;
}

const RateSelect = ({
  rates,
  selectedRate,
  setSelectedRate,
  setShipmentInsurance,
  parcel,
  showRateError
}: RateSelectProps) => {
  const [insuranceAmount, setInsuranceAmount] = useState<string | undefined>(
    undefined
  );
  const [isInsured, setInsured] = useState<boolean>(false);

  useEffect(() => {
    // Mounted
    setInsuranceAmount(parcel?.value);
  }, []);

  useEffect(() => {
    setShipmentInsurance({
      isInsured,
      insuranceAmount
    });
  }, [insuranceAmount, isInsured]);

  const deliveryDays = (rate) => {
    return rate.deliveryDays
      ? `Delivery in ${rate.deliveryDays} ${
          rate.deliveryDays > 1 ? "days" : "day"
        }`
      : "";
  };

  const handleInsuranceAmountChange = (event) => {
    // Limit to 5 digits
    if (event.target.value.includes("-")) {
      return;
    }
    setInsuranceAmount(event.target.value.slice(0, 5));
  };

  return (
    <Box>
      <Box sx={{ maxHeight: "38vh", overflowY: "auto" }}>
        <Grid item>
          <Grid item sm={6}>
            {showRateError && (
              <FormHelperText
                sx={{ color: "error.main", ml: 1 }}
                id="validation-schema-first-name"
              >
                Rate is required
              </FormHelperText>
            )}
          </Grid>
          <Box>
            {rates?.map((rate) => (
              <BoxWrapper
                onClick={() => setSelectedRate(rate)}
                sx={
                  rate.id === selectedRate?.id
                    ? { borderColor: "primary.main" }
                    : {}
                }
                key={rate.id}
              >
                <Radio
                  value="standard"
                  checked={rate.id === selectedRate?.id}
                  name="form-layouts-collapsible-options-radio"
                  inputProps={{ "aria-label": "Standard Delivery" }}
                  sx={{ alignItems: "flex-start" }}
                />
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        flexGrow: 1
                      }}
                    >
                      {rate.carrier} {splitStringByCapitalCase(rate.service)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, justifyContent: "flex-end" }}
                    >
                      ${rate.rate}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Typography variant="body2">
                      {deliveryDays(rate)}
                    </Typography>
                  </Box>
                </Box>
              </BoxWrapper>
            ))}
          </Box>
          {(!rates || rates?.length === 0) && (
            <Typography
              variant="body2"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              No rates found
            </Typography>
          )}
        </Grid>
      </Box>
      <Typography mt={6} variant="body2">
        Insurance (optional)
      </Typography>
      <Grid item sm={8} xs={12} mt={2}>
        <Grid sx={{ display: "flex", flexDirection: "column" }}>
          <FormControlLabel
            label="Insure Shipment"
            control={
              <Switch
                checked={isInsured}
                onChange={(e) => setInsured(e.target.checked)}
              />
            }
          />
          <Grid
            my={4}
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <TextField
              autoFocus
              type="number"
              onChange={handleInsuranceAmountChange}
              value={insuranceAmount}
              label="Parcel value"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">US$</InputAdornment>
                )
              }}
              sx={{ visibility: isInsured ? "visible" : "hidden" }}
            />
            <Typography
              mx={2}
              variant="h5"
              sx={{ visibility: isInsured ? "visible" : "hidden" }}
            >
              =
            </Typography>
            <Box sx={{ visibility: isInsured ? "visible" : "hidden" }}>
              <Typography variant="body2" sx={{ width: "6rem" }}>
                Your cost
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                ${calculateInsuranceFee(insuranceAmount ?? "").toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          <Typography
            mx={2}
            my={-3}
            mb={1}
            sx={{
              fontSize: "0.75rem",
              lineHeight: "1.66",
              fontWeight: "400",
              visibility: isInsured ? "visible" : "hidden"
            }}
          >
            Insurance rate is 0.5% of declared value
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RateSelect;
