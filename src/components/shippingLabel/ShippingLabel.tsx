import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Address, Package } from "../../types/apps/navashipInterfaces";

interface ShippingLabelProps {
  sourceAddress: Address | null | undefined,
  deliveryAddress: Address | null | undefined,
  parcel: Package | null | undefined,
}

const ShippingLabel = ({sourceAddress, deliveryAddress, parcel}: ShippingLabelProps) => {
  const addressLabel = (address: Address | null) => {
    return address?.street1 +  (address?.street2 ? " , " + address?.street2 : "") + ", " + address?.zip + ", " + address?.city + ", " + address?.country;
  }

  return (
    <Grid item xs={12} sm={6} direction="column">
      <Box display="flex" flexDirection="column" sx={{"height": 270, "borderLeft": 1, "pl": 5, }}>
        <Typography variant="body1" sx={{textAlign: "left"}} mb={4}>
          Preview
        </Typography>
        {sourceAddress && (
          <Grid item sx={{"mb": 3}}>
            <Typography variant="body2">
              From: {addressLabel(sourceAddress)}
            </Typography>
            {sourceAddress?.name && (
              <Typography variant="body2">
                {sourceAddress?.name}
              </Typography>)
            }
          </Grid>
          )
        }
        {deliveryAddress && (
          <Grid item sx={{"mb": 3}}>
            <Typography variant="body2">
              Ship to: {addressLabel(deliveryAddress)}
            </Typography>
            {deliveryAddress?.name && (
              <Typography variant="body2">
                {deliveryAddress?.name}
              </Typography>)
            }
          </Grid>
          )
        }
        {parcel && (
          <Grid item>
            <Typography variant="body2">
              Parcel information
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
      </Box>
    </Grid>
  );
};

export default ShippingLabel;