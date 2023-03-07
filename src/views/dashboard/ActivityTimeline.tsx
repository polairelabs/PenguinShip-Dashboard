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
  ActivityMessageType,
  Shipment
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
  const getDotColor = (messageType: ActivityMessageType) => {
    let color;
    if (messageType == ActivityMessageType.NEW) {
      color = "primary";
    } else if (messageType == ActivityMessageType.PURCHASE) {
      color = "success";
    } else if (messageType == ActivityMessageType.STATUS_UPDATE) {
      color = "error";
    }
    return color;
  };

  const getSubMessage = (
    shipment: Shipment,
    messageType: ActivityMessageType
  ) => {
    let subMessage = "";
    if (messageType == ActivityMessageType.NEW) {
      const recipientAddress = getRecipientAddress(shipment);
      subMessage = `Shipping to: ${
        recipientAddress.street1
      }, ${getRecipientInfo(shipment)}, ${recipientAddress.zip}, ${
        recipientAddress.country
      }`;
    }

    if (messageType == ActivityMessageType.PURCHASE) {
      subMessage = `Rate was purchased from ${shipment?.rate?.carrier} for $${shipment?.rate?.rate}`;
    }

    if (messageType == ActivityMessageType.STATUS_UPDATE) {
      if (shipment.easyPostStatus == "IN_TRANSIT") {
        // TODO once status gets done in easypost webhook
      }
    }

    return subMessage;
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
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color={getDotColor(activityLog.messageType)} />
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
                    {activityLog.message}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>
                    {dateToHumanReadableFormat(activityLog.createdAt)}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {getSubMessage(activityLog.shipment, activityLog.messageType)}
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
