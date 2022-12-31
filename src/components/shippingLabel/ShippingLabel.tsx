import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Address, Package, Rate } from "../../types/apps/navashipInterfaces";

interface ShippingLabelProps {
  sourceAddress: Address | null | undefined,
  deliveryAddress: Address | null | undefined,
  parcel: Package | null | undefined,
  rate?: Rate | null | undefined,
}

const ShippingLabel = ({sourceAddress, deliveryAddress, parcel, rate}: ShippingLabelProps) => {
  const addressLabel = (address: Address | null) => {
    return address?.street1 ? address?.street1 +  (address?.street2 ? " , " + address?.street2 : "") + ", " + address?.zip + ", " + address?.city + ", " + address?.country : "";
  }

  const serviceDisplayName = (service: string) => {
    return service.replace(/([A-Z])/g, ' $1');
  }

  return (
    <Grid item xs={12} sm={6} direction="column">
      <Box display="flex" flexDirection="column" sx={{"pl": 5, "mb": 5 }}>
        <Typography variant="body1" sx={{textAlign: "left"}} mb={4}>
          Preview
        </Typography>
        {sourceAddress?.street1 && (
          <Grid item sx={{"mb": 3}}>
            <Typography variant="body2" component="div">
              <Box fontWeight="bold" display="inline">From:</Box> {addressLabel(sourceAddress)}
            </Typography>
            <Box>
              {sourceAddress?.name && (
                <Typography variant="body2">
                  {sourceAddress?.name}
                </Typography>)
              }
              {sourceAddress?.company && (
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  {sourceAddress?.company}
                </Typography>)
              }
              {sourceAddress?.phone && (
                <Typography variant="body2">
                  {sourceAddress?.phone}
                </Typography>)
              }
              {sourceAddress?.email && (
                <Typography variant="body2">
                  {sourceAddress?.email}
                </Typography>)
              }
            </Box>
          </Grid>
          )
        }
        {deliveryAddress?.street1 && (
          <Grid item sx={{"mb": 3}}>
            <Typography variant="body2" component="div">
              <Box fontWeight="bold" display="inline">Ship to:</Box> {addressLabel(deliveryAddress)}
            </Typography>
            {deliveryAddress?.name && (
              <Typography variant="body2">
                {deliveryAddress?.name}
              </Typography>)
            }
            {deliveryAddress?.company && (
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                {deliveryAddress?.company}
              </Typography>)
            }
            {deliveryAddress?.phone && (
              <Typography variant="body2">
                {deliveryAddress?.phone}
              </Typography>)
            }
            {deliveryAddress?.email && (
              <Typography variant="body2">
                {deliveryAddress?.email}
              </Typography>)
            }
          </Grid>
          )
        }
        {parcel?.name && (
          <Grid item sx={{"mb": 3}}>
            <Typography variant="body2" component="div">
              <Box fontWeight="bold" display="inline">Parcel information</Box>
            </Typography>
            {parcel?.length && (
              <Typography variant="body2">
                {parcel?.length}" x {parcel?.width}" x {parcel?.height}"
              </Typography>)
            }
            {parcel?.weight && (
              <Typography variant="body2">
                {parcel?.weight} oz
              </Typography>)
            }
            {parcel?.value && (
              <Typography variant="body2">
                ${parcel?.value}
              </Typography>)
            }
          </Grid>
        )
        }

        {rate && (
          <Grid item>
            <Typography variant="body2" component="div">
              <Box fontWeight="bold" display="inline">Shipping service:</Box> {rate?.carrier} - {serviceDisplayName(rate?.service)}
            </Typography>
          </Grid>
        )}
      </Box>
    </Grid>
  );
};

export default ShippingLabel;