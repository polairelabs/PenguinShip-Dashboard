import { Grid, Radio, Typography } from "@mui/material";
import Box, { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import FormHelperText from "@mui/material/FormHelperText";

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  borderWidth: 1,
  display: 'flex',
  cursor: 'pointer',
  borderStyle: 'solid',
  padding: theme.spacing(5),
  borderColor: theme.palette.divider,
  '&:first-of-type': {
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius
  },
  '&:last-of-type': {
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius
  }
}))

const RateSelect = ({rates, selectedRate, setSelectedRate, showRateError}) => {
  const deliveryDays = (rate) => {
    return rate.deliveryDays ? `Delivery in ${rate.deliveryDays} ${rate.deliveryDays > 1 ? "days" : "day"}` : "";
  }

  const serviceDisplayName = (service: string) => {
    return service.replace(/([A-Z])/g, ' $1');
  }

  return (
    // component="div" sx={{ height: 370 , overflow: "overflow-y" }}
    <Box>
      <Grid item sm={6}>
        {showRateError && (
          <FormHelperText
            sx={{ color: "error.main", "ml": 1, }}
            id="validation-schema-first-name">
            Rate is required
          </FormHelperText>
          )
        }
      </Grid>
      <Box sx={{"mt": 2}}>
        {rates?.map((rate) =>
          (
            <BoxWrapper
              onClick={() => setSelectedRate(rate)}
              sx={rate.id === selectedRate?.id ? { borderColor: 'primary.main' } : {}}
              key={rate.id}
            >
              <Radio
                value='standard'
                checked={rate.id === selectedRate?.id}
                name='form-layouts-collapsible-options-radio'
                inputProps={{ 'aria-label': 'Standard Delivery' }}
                sx={{ mr: 2, ml: -2.5, mt: -2.5, alignItems: 'flex-start' }}
              />
              <Box sx={{ width: '100%' }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 600 }}>{rate.carrier} - {serviceDisplayName(rate.service)}</Typography>
                  <Typography sx={{ fontWeight: 700 }}>${rate.rate}</Typography>
                  {/*<Typography variant='body2'>{rate.id} - {selectedRate?.id}</Typography>*/}
                </Box>
                <Typography variant='body2'>{deliveryDays(rate)}</Typography>
              </Box>
            </BoxWrapper>
          )
        )}
      </Box>

      {(!rates || rates?.length === 0) && (
        <Typography variant="body2">
          No rates found
        </Typography>
      )}
  </Box>
  );
};

export default RateSelect;