import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Address, Package, Rate } from "../../types/apps/navashipInterfaces";
import {
  Table,
  TableBody,
  TableCell,
  TableCellBaseProps,
  TableContainer,
  TableRow
} from "@mui/material";
import { styled } from "@mui/material/styles";

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: "0 !important",
  paddingRight: "0 !important",
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`
}));

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
          (address?.street2 ? ", " + address?.street2 : "") +
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

  const packageDimensions = (parcel: Package) => {
    return parcel?.length
      ? `${parcel?.length}" x ${parcel?.width}" x ${parcel?.height}`
      : "";
  };

  const displayPackageInfo = (parcel: Package) => {
    const dimensions = parcel?.length ? ` / ${packageDimensions(parcel)}` : "";
    const value = parcel?.value ? ` / $${parcel.value}` : "";
    return `${parcel.weight} oz ${dimensions} ${value}`;
  };

  const deliveryDays = (rate: Rate) => {
    return rate?.deliveryDays
      ? `Delivery in ${rate.deliveryDays} ${
          rate.deliveryDays > 1 ? "days" : "day"
        }`
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

      <TableContainer>
        <Table>
          <TableBody>
            {sourceAddress?.street1 && (
              <TableRow style={{ width: "10px" }}>
                <MUITableCell>
                  <Typography variant="body2" fontWeight="bold">
                    From:
                  </Typography>
                </MUITableCell>
                <MUITableCell>
                  <Typography variant="body2" fontWeight="480">
                    {addressLabel(sourceAddress)}
                  </Typography>
                </MUITableCell>
              </TableRow>
            )}
            {sourceAddress?.street1 &&
              (sourceAddress?.name ||
                sourceAddress?.company ||
                sourceAddress?.phone ||
                sourceAddress?.email) && (
                <TableRow>
                  <MUITableCell></MUITableCell>
                  <MUITableCell>
                    <Typography variant="body2" fontStyle="italic">
                      {displayAdditionalPersonInfo(sourceAddress)}
                    </Typography>
                  </MUITableCell>
                </TableRow>
              )}
            {deliveryAddress?.street1 && (
              <TableRow>
                <MUITableCell>
                  <Typography variant="body2" fontWeight="bold">
                    To:
                  </Typography>
                </MUITableCell>
                <MUITableCell>
                  <Typography variant="body2" fontWeight="480">
                    {addressLabel(deliveryAddress)}
                  </Typography>
                </MUITableCell>
              </TableRow>
            )}
            {deliveryAddress?.street1 &&
              (deliveryAddress?.name ||
                deliveryAddress?.company ||
                deliveryAddress?.phone ||
                deliveryAddress?.email) && (
                <TableRow>
                  <MUITableCell></MUITableCell>
                  <MUITableCell>
                    <Typography variant="body2" fontStyle="italic">
                      {displayAdditionalPersonInfo(deliveryAddress)}
                    </Typography>
                  </MUITableCell>
                </TableRow>
              )}
            {parcel?.name && (
              <TableRow>
                <MUITableCell>
                  <Typography variant="body2" fontWeight="bold">
                    Parcel:
                  </Typography>
                </MUITableCell>
                <MUITableCell>
                  <Typography variant="body2" fontWeight="480">
                    {displayPackageInfo(parcel)}
                  </Typography>
                </MUITableCell>
              </TableRow>
            )}
            {rate && (
              <TableRow>
                <MUITableCell>
                  <Typography variant="body2" fontWeight="bold">
                    Rate:
                  </Typography>
                </MUITableCell>
                <MUITableCell>
                  <Typography variant="body2" fontWeight="480">
                    {rate?.carrier} {rate?.service} - {rate?.rate}{" "}
                    {rate?.currency}
                  </Typography>
                </MUITableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ShippingLabel;
