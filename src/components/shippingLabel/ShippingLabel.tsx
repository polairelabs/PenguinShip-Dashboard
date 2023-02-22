import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Address, Package, Rate } from "../../types/apps/NavashipTypes";
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
  display: "flex",
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
  hideTitle?: boolean;
}

const ShippingLabel = ({
  sourceAddress,
  deliveryAddress,
  parcel,
  hideTitle
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

  return (
    <Box sx={{ minHeight: "16vh", overflowY: "auto" }} mb={4}>
      {hideTitle === undefined && (
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: "text.primary", mb: 2 }}
        >
          Shipping Label (Preview)
        </Typography>
      )}
      <TableContainer>
        <Table>
          <TableBody>
            {sourceAddress?.street1 && (
              <TableRow>
                <MUITableCell>
                  <Typography component="span" variant="body2" color="primary">
                    From:
                  </Typography>
                  {
                    <Typography
                      variant="body2"
                      display="inline"
                      sx={{ marginLeft: "2rem", fontWeight: "480" }}
                    >
                      {addressLabel(sourceAddress)}
                    </Typography>
                  }
                </MUITableCell>
                {(sourceAddress?.name ||
                  sourceAddress?.company ||
                  sourceAddress?.phone ||
                  sourceAddress?.email) && (
                  <MUITableCell>
                    <Typography
                      component="span"
                      variant="body2"
                      color="primary"
                      sx={{ visibility: "hidden" }}
                    >
                      From:
                    </Typography>
                    {
                      <Typography
                        variant="body2"
                        display="inline"
                        sx={{ marginLeft: "2rem" }}
                      >
                        {displayAdditionalPersonInfo(sourceAddress)}
                      </Typography>
                    }
                  </MUITableCell>
                )}
              </TableRow>
            )}

            {deliveryAddress?.street1 && (
              <TableRow>
                <MUITableCell>
                  <Typography component="span" variant="body2" color="primary">
                    To:
                  </Typography>
                  {
                    <Typography
                      variant="body2"
                      display="inline"
                      sx={{ marginLeft: "3.15rem", fontWeight: "480" }}
                    >
                      {addressLabel(deliveryAddress)}
                    </Typography>
                  }
                </MUITableCell>
                {(deliveryAddress?.name ||
                  deliveryAddress?.company ||
                  deliveryAddress?.phone ||
                  deliveryAddress?.email) && (
                  <MUITableCell>
                    <Typography
                      component="span"
                      variant="body2"
                      color="primary"
                      sx={{ visibility: "hidden" }}
                    >
                      To:
                    </Typography>
                    {
                      <Typography
                        variant="body2"
                        display="inline"
                        sx={{ marginLeft: "3.15rem" }}
                      >
                        {displayAdditionalPersonInfo(deliveryAddress)}
                      </Typography>
                    }
                  </MUITableCell>
                )}
              </TableRow>
            )}

            {parcel?.name && (
              <TableRow>
                <MUITableCell>
                  <Typography component="span" variant="body2" color="primary">
                    Parcel:
                  </Typography>
                  {
                    <Typography
                      variant="body2"
                      display="inline"
                      sx={{ marginLeft: "1.6rem", fontWeight: "480" }}
                    >
                      {displayPackageInfo(parcel)}
                    </Typography>
                  }
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
