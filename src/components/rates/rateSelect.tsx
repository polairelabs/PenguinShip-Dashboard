import { Grid, Radio, Typography } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import { Rate } from "../../types/apps/NavashipTypes";

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
  showRateError?: any;
}

const RateSelect = ({
  rates,
  selectedRate,
  setSelectedRate,
  showRateError
}: RateSelectProps) => {
  const deliveryDays = (rate) => {
    return rate.deliveryDays
      ? `- Delivery in ${rate.deliveryDays} ${
          rate.deliveryDays > 1 ? "days" : "day"
        }`
      : "";
  };

  return (
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
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between"
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {rate.carrier} {rate.service}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {rate.rate} {rate.currency} {deliveryDays(rate)}
                </Typography>
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
  );
};

export default RateSelect;
