import { FormControlLabel, Grid, InputAdornment, Radio, Switch, Typography } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import { Package, Rate, ShipmentInsurance } from "../../types/apps/NavashipTypes";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";

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
  setShipmentInsurance: (insurance: ShipmentInsurance) => void,
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
  const INSURANCE_FEE = 0.05; // 5% on top of existing price
  const [insuranceAmount, setInsuranceAmount] = useState<string | undefined>();
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

  const getInsurance = () => {
    const insuranceFee = Math.round(Number(insuranceAmount) * INSURANCE_FEE * 100) / 100;
    return isInsured && insuranceAmount ? ` + (${insuranceFee} USD)*` : "";
  };

  const CalcWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // '&:not(:last-of-type)': {
    //   marginBottom: theme.spacing(2)
    // }
  }));

  const deliveryDays = (rate) => {
    return rate.deliveryDays
      ? `Delivery in ${rate.deliveryDays} ${
        rate.deliveryDays > 1 ? "days" : "day"
      }`
      : "";
  };

  const handleInsuranceAmountChange = (event) => {
    // Limit to 5 digits
    setInsuranceAmount(event.target.value.slice(0, 5));
  };

  const splitStringByCapitalCase = (input: string) => {
    return input.match(/[A-Z][a-z]+/g)?.join(" ");
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
                  sx={{ mr: 2, ml: -2.5, mt: -2.5, alignItems: "flex-start" }}
                />
                <Box sx={{ width: "100%" }}>

                  {/*<Box*/}
                  {/*  component="img"*/}
                  {/*  sx={{*/}
                  {/*    width: 200,*/}
                  {/*    height: 25,*/}
                  {/*    justifyContent: "flex-end"*/}
                  {/*  }}*/}
                  {/*  alt={rate?.carrier}*/}
                  {/*  src={}*/}
                  {/*/>*/}
                  {/*<Typography variant="body2" sx={{ fontWeight: "bold", flexGrow: 1 }}>*/}
                  {/*  {rate.carrier} {rate.service}*/}
                  {/*</Typography>*/}
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Typography variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  flexGrow: 1
                                }}>{rate.carrier} {splitStringByCapitalCase(rate.service)}</Typography>
                    <Typography variant="body2"
                                sx={{ fontWeight: 700, justifyContent: "flex-end" }}>${rate.rate}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Typography variant="body2">
                      {deliveryDays(rate)} &nbsp;
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
      <Grid container mt={6}>
        <Grid item sm={8}>
          <Typography variant="body2">
            Insurance
          </Typography>
          <FormControlLabel
            label="Insure Shipment"
            control={
              <Switch
                checked={isInsured}
                onChange={(e) => setInsured(e.target.checked)}
              />
            }
          />
          <TextField
            autoFocus
            variant="standard"
            type="number"
            onChange={handleInsuranceAmountChange}
            value={insuranceAmount}
            label="Insurance coverage"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <InputAdornment position="start">US$</InputAdornment>
            }}
            // helperText="Insurance rate is 0.5% of declared value"
            sx={{ width: 115, visibility: isInsured ? "visible" : "hidden", marginLeft: "1rem" }}
          />
        </Grid>
        <Grid item sm={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
          <CalcWrapper>
            <Typography variant='body2'>Rate:</Typography>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              $0
            </Typography>
          </CalcWrapper>
          <CalcWrapper>
            <Typography variant='body2'>Insurance:</Typography>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              $0
            </Typography>
          </CalcWrapper>
          <Divider />
          <CalcWrapper>
            <Typography variant='body2'>Total:</Typography>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              $0
            </Typography>
          </CalcWrapper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RateSelect;
