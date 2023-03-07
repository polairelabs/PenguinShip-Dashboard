import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

import CustomAvatar from "src/@core/components/mui/avatar";
import TruckFastOutline from "mdi-material-ui/TruckFastOutline";
import {
  InformationOutline,
  TruckDelivery,
  TruckDeliveryOutline,
  TruckOutline
} from "mdi-material-ui";
import { IconButton, Tooltip } from "@mui/material";

interface StatisticsCardProp {
  totalShipmentsCreatedCount: number;
  totalShipmentsInTransitCount: number;
  totalShipmentsDeliveredCount: number;
}

const ShipmentStatisticsCard = ({
  totalShipmentsCreatedCount,
  totalShipmentsInTransitCount,
  totalShipmentsDeliveredCount
}: StatisticsCardProp) => {
  const salesData = [
    {
      stats: totalShipmentsCreatedCount,
      color: "secondary",
      title: "Created",
      icon: <TruckOutline sx={{ fontSize: "1.75rem" }} />
    },
    {
      stats: totalShipmentsInTransitCount,
      title: "In transit",
      color: "info",
      icon: <TruckFastOutline sx={{ fontSize: "1.75rem" }} />
    },
    {
      stats: totalShipmentsDeliveredCount,
      title: "Delivered",
      color: "success",
      icon: <TruckDeliveryOutline sx={{ fontSize: "1.75rem" }} />
    }
  ];

  const renderStats = () => {
    return salesData.map((item, index) => (
      <Grid item xs={12} sm={4} key={index}>
        <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
          <CustomAvatar
            variant="rounded"
            color={
              item.color as
                | "primary"
                | "success"
                | "warning"
                | "secondary"
                | "error"
                | "info"
                | undefined
            }
            sx={{ mr: 3, boxShadow: 3, width: 44, height: 44 }}
          >
            {item.icon}
          </CustomAvatar>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body2">{item.title}</Typography>
            <Typography variant="h6">{item.stats}</Typography>
          </Box>
        </Box>
      </Grid>
    ));
  };

  return (
    <Card>
      <CardHeader
        title="Shipment Overview"
        action={
          <Tooltip
            title={
              <Typography
                sx={{ fontSize: "0.6875rem", color: "#fff", fontWeight: 500 }}
              >
                Created: The shipments that were created
                <br />
                In transit: The shipments that are currently in transit
                <br />
                Delivered: The shipments that have been delivered
              </Typography>
            }
          >
            <IconButton
              size="small"
              aria-label="settings"
              className="card-more-options"
              sx={{ color: "text.secondary" }}
            >
              <InformationOutline />
            </IconButton>
          </Tooltip>
        }
        subheader={
          <Typography variant="body2">
            <Box component="span" sx={{ color: "text.primary" }}>
              Current shipment progress
            </Box>
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.25,
            lineHeight: "2rem !important",
            letterSpacing: "0.15px !important"
          }
        }}
      />
      <CardContent sx={{ pt: (theme) => `${theme.spacing(0.75)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ShipmentStatisticsCard;
