import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import MuiTimeline from "@mui/lab/Timeline";
import {
  ActivityLog,
  ActivityMessageType
} from "../../types/apps/NavashipTypes";
import {
  dateToHumanReadableFormat,
  getRecipientAddress,
  getRecipientInfo,
  splitStringByCapitalCase
} from "../../utils";

const Timeline = styled(MuiTimeline)({
  paddingLeft: 0,
  paddingRight: 0,
  "& .MuiTimelineItem-root": {
    width: "100%",
    "&:before": {
      display: "none"
    }
  }
});

interface ActivityTimeLineProps {
  activityLogs: ActivityLog[];
}

const ActivityTimeline = ({ activityLogs }: ActivityTimeLineProps) => {
  const getDotColor = (activityLog: ActivityLog) => {
    let color;
    const messageType = activityLog.messageType;
    if (messageType == ActivityMessageType.NEW) {
      color = "primary";
    } else if (messageType == ActivityMessageType.PURCHASE) {
      color = "success";
    } else if (messageType == ActivityMessageType.STATUS_UPDATE) {
      color = "warning";
      if (activityLog.easypostStatus === "DELIVERED") {
        color = "info";
      }
    }
    return color;
  };

  const getMessageTitle = (activityLog: ActivityLog) => {
    const messageType = activityLog.messageType;
    const shipment = activityLog.shipment;
    const easypostStatus = activityLog.easypostStatus;

    if (messageType == ActivityMessageType.STATUS_UPDATE) {
      if (easypostStatus === "PRE_TRANSIT") {
        return `Shipment #${shipment.shipmentNumber} is getting ready for Transit`;
      } else if (easypostStatus === "IN_TRANSIT") {
        return `Shipment #${shipment.shipmentNumber} is in Transit`;
      } else if (easypostStatus === "OUT_FOR_DELIVERY") {
        return `Shipment #${shipment.shipmentNumber} is Out for Delivery`;
      } else if (easypostStatus === "DELIVERED") {
        return `Shipment #${shipment.shipmentNumber} was Delivered!`;
      }
    } else {
      return activityLog.message;
    }
  };

  const getSubMessageComponent = (activityLog: ActivityLog) => {
    const messageType = activityLog.messageType;
    const shipment = activityLog.shipment;
    const easypostStatus = activityLog.easypostStatus;

    const recipientAddress = getRecipientAddress(shipment);

    if (messageType === ActivityMessageType.NEW) {
      return (
        <span>
          Shipping to: {recipientAddress.street1}, {getRecipientInfo(shipment)},{" "}
          {recipientAddress.zip}, {recipientAddress.country}
        </span>
      );
    }

    if (messageType === ActivityMessageType.PURCHASE) {
      return (
        <span>
          Purchased{" "}
          <strong>
            {shipment?.rate?.carrier}{" "}
            {splitStringByCapitalCase(shipment?.rate?.service)}
          </strong>{" "}
          rate for <strong>${shipment?.rate?.rate}</strong>
        </span>
      );
    }

    if (messageType === ActivityMessageType.RETURN_STARTED) {
      return <span>Trying to cancel Shipment</span>;
    }

    if (messageType === ActivityMessageType.RETURN_PROCESSED) {
      return (
        <span>
          Shipping label refund processed and credited to your account
        </span>
      );
    }

    if (messageType === ActivityMessageType.STATUS_UPDATE) {
      if (easypostStatus === "PRE_TRANSIT") {
        return <span>Carrier is notified and awaiting the package</span>;
      } else if (easypostStatus === "IN_TRANSIT") {
        return (
          <span>Package is in transit and moving towards its destination</span>
        );
      } else if (easypostStatus === "OUT_FOR_DELIVERY") {
        return (
          <span>Package is out for delivery and should arrive shortly</span>
        );
      } else if (easypostStatus === "DELIVERED") {
        return <span>Package has been successfully delivered</span>;
      }
    }

    return null;
  };

  return (
    <Card>
      <CardHeader
        title="Activity Timeline"
        titleTypographyProps={{
          sx: {
            lineHeight: "2rem !important",
            letterSpacing: "0.15px !important"
          }
        }}
      />
      <CardContent>
        <Timeline sx={{ my: 0, py: 0 }}>
          {activityLogs?.map((activityLog) => (
            <TimelineItem
              key={activityLog.shipment.id + "_" + activityLog.createdAt}
            >
              <TimelineSeparator>
                <TimelineDot color={getDotColor(activityLog) ?? "error"} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent
                sx={{
                  pr: 0,
                  mt: 0,
                  mb: (theme) => `${theme.spacing(1.5)} !important`
                }}
              >
                <Box
                  sx={{
                    mb: 2.5,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <Typography
                    sx={{ mr: 2, fontWeight: 600, color: "text.primary" }}
                  >
                    {getMessageTitle(activityLog)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>
                    {dateToHumanReadableFormat(activityLog.createdAt)}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {getSubMessageComponent(activityLog)}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
