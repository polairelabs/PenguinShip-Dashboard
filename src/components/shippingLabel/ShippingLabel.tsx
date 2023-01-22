import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Address, Package, Rate } from "../../types/apps/navashipInterfaces";

interface ShippingLabelProps {
  sourceAddress: Address | null | undefined;
  deliveryAddress: Address | null | undefined;
  parcel: Package | null | undefined;
  rate?: Rate | null | undefined;
}

const ShippingLabel = ({
  sourceAddress,
  deliveryAddress,
  parcel,
  rate
}: ShippingLabelProps) => {
  const addressLabel = (address: Address) => {
    return address?.street1
      ? address?.street1 +
          (address?.street2 ? " , " + address?.street2 : "") +
          ", " +
          address?.zip +
          ", " +
          address?.city +
          ", " +
          address?.country
      : "";
  };

  const displayAdditionalPersonInfo = (address: Address) => {
    const infos = [address.name, address.company, address.phone, address.email]
      .filter((value) => value != "")
      .filter((value) => value != undefined);
    return infos.map((value, index) => value + (infos[index + 1] ? ", " : ""));
  };

  const deliveryDays = (rate: Rate) => {
    return rate?.deliveryDays
      ? `Delivery in ${rate.deliveryDays} ${
          rate.deliveryDays > 1 ? "days" : "day"
        }`
      : "";
  };

  const packageDimensions = (parcel: Package) => {
    return parcel?.length
      ? `${parcel?.length}" x ${parcel?.width}" x ${parcel?.height}`
      : "";
  };

  return (
    <Box sx={{ height: "26vh", overflowY: "auto" }} mb={4}>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, color: "text.primary", mb: 2 }}
      >
        Shipping Label (preview)
      </Typography>
      {sourceAddress?.street1 && (
        <Grid item sx={{ mb: 3 }}>
          <Typography variant="body2" component="div">
            <Box fontWeight="bold" display="inline">
              From:
            </Box>{" "}
            {addressLabel(sourceAddress)}
          </Typography>
          {(sourceAddress?.name ||
            sourceAddress?.company ||
            sourceAddress?.phone ||
            sourceAddress?.email) && (
            <Typography variant="body2" fontStyle="italic">
              {displayAdditionalPersonInfo(sourceAddress)}
            </Typography>
          )}
        </Grid>
      )}
      {deliveryAddress?.street1 && (
        <Grid item sx={{ mb: 3 }}>
          <Typography variant="body2" component="div">
            <Box fontWeight="bold" display="inline">
              Ship to:
            </Box>{" "}
            {addressLabel(deliveryAddress)}
          </Typography>
          {(deliveryAddress?.name ||
            deliveryAddress?.company ||
            deliveryAddress?.phone ||
            deliveryAddress?.email) && (
            <Typography variant="body2" fontStyle="italic">
              {displayAdditionalPersonInfo(deliveryAddress)}
            </Typography>
          )}
        </Grid>
      )}
      {parcel?.name && (
        <Grid item sx={{ mb: 3 }}>
          <Typography variant="body2" component="div">
            <Box fontWeight="bold" display="inline">
              Parcel information:
            </Box>
          </Typography>
          {parcel?.length && (
            <Typography variant="body2">{packageDimensions(parcel)}</Typography>
          )}
          {parcel?.weight && (
            <Typography variant="body2">{parcel?.weight} oz</Typography>
          )}
          {parcel?.value && (
            <Typography variant="body2">${parcel?.value}</Typography>
          )}
        </Grid>
      )}

      {rate && (
        <Grid item>
          <Typography variant="body2">
            <Box fontWeight="bold" display="inline">
              Shipping service:
            </Box>{" "}
            {rate?.carrier} {rate?.service} - {rate?.rate} {rate?.currency}
          </Typography>
          <Typography variant="body2">{deliveryDays(rate)}</Typography>
        </Grid>
      )}
    </Box>
  );
};

export default ShippingLabel;
