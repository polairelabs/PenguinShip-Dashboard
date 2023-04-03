import Grid from "@mui/material/Grid";
import { Box, Hidden, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { InformationOutline } from "mdi-material-ui";
import Button from "@mui/material/Button";
import styled from "@emotion/styled";
import { useTheme } from "@mui/material/styles";
import { BoughtShipment, Shipment } from "../../types/apps/NavashipTypes";
import { convertAndDownloadImageToPdf, printPdf } from "../../utils";
import { useState } from "react";

interface PrintShippingLabelProps {
  shipment: Shipment | BoughtShipment;
  description?: string;
  handleBack?: () => void;
}

const PrintShippingLabel = ({description, shipment, handleBack}: PrintShippingLabelProps) => {
  const [postageImageWidth, setPostageImageWidth] = useState<number>();
  const [postageImageHeight, setPostageImageHeight] = useState<number>();
  const [postageImageLoaded, setPostageImageLoaded] = useState<boolean>(false);

  const theme = useTheme();

  // Style to be applied on the grid that contains the vertical divider between the two columns
  const GridDividerStyle = styled(Grid)(() => ({
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  }));

  // Style to be applied on the second grid column on the left
  const SecondColumnGridStyle = styled(Grid)(() => ({
    [theme.breakpoints.down("sm")]: {
      marginTop: "0.5rem"
    }
  }));

  const handleImageLoad = (event) => {
    const imgElement = event.target;
    setPostageImageWidth(imgElement.width);
    setPostageImageHeight(imgElement.height);
    setPostageImageLoaded(true);
  };

  const handleDownloadPdf = (imageUrl: string, trackingNumber: string) => {
    if (!postageImageWidth || !postageImageHeight) {
      return;
    }
    convertAndDownloadImageToPdf(
      imageUrl,
      postageImageWidth,
      postageImageHeight,
      `shipping-label-${trackingNumber}`
    );
  };

  const handlePrintPdf = (imageUrl: string) => {
    if (!postageImageWidth || !postageImageHeight) {
      return;
    }
    printPdf(imageUrl, postageImageWidth, postageImageHeight);
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              mb: 4,
              display: "flex",
              justifyContent: "center"
            }}
          >
            {description}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 2,
            mb: 4
          }}
        >
          <Box
            component="img"
            sx={{
              maxHeight: { xs: "400px", md: "630px" },
              maxWidth: { xs: "300px", md: "400px" },
              border: "1px dashed black"
            }}
            alt="Shipping label"
            src={`${shipment.postageLabelUrl}`}
            onLoad={handleImageLoad}
          />
        </Box>
      </Grid>
      <GridDividerStyle
        item
        container
        sm={1}
        justifyContent="center"
        alignItems="center"
      >
        <Divider orientation="vertical" />
      </GridDividerStyle>
      <SecondColumnGridStyle item xs={12} sm={5}>
        <Hidden smUp>
          <Divider
            orientation="horizontal"
            sx={{ width: "50%", my: 4 }}
          />
        </Hidden>
        <Grid item xs={12} sm={12}>
          <Box>
            <Box>
              <Typography variant="body2">
                <IconButton aria-label="info">
                  <InformationOutline color="info" />
                </IconButton>
                Your label is ready to print
              </Typography>
            </Box>
            <Box my={3}>
              <Button
                sx={{ padding: 2 }}
                variant="outlined"
                color="info"
                onClick={() =>
                  handlePrintPdf(shipment.postageLabelUrl)
                }
                disabled={!postageImageLoaded}
              >
                Print
              </Button>
            </Box>
            <Box my={3}>
              <Button
                sx={{ padding: 2 }}
                variant="outlined"
                color="info"
                onClick={() =>
                  handleDownloadPdf(
                    shipment.postageLabelUrl,
                    shipment.trackingCode
                  )
                }
                disabled={!postageImageLoaded}
              >
                Download
              </Button>
            </Box>
          </Box>
        </Grid>
      </SecondColumnGridStyle>
      {handleBack && (<Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "end" }}
      >
        <Button
          size="large"
          variant="contained"
          onClick={handleBack}
        >
          Back To Start
        </Button>
      </Grid>
      )}
    </Grid>
  );
};

export default PrintShippingLabel;