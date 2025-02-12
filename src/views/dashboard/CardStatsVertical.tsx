import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

import CustomAvatar from "src/@core/components/mui/avatar";
import { Tooltip } from "@mui/material";
import { InformationOutline } from "mdi-material-ui";

const CardStatsVertical = (props) => {
  const {
    title,
    subtitle,
    color,
    icon,
    stats,
    trend,
    trendNumber,
    infoIcon,
    tooltip
  } = props;

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            mb: 5.5,
            alignItems: "flex-start",
            justifyContent: "space-between"
          }}
        >
          <CustomAvatar color={color} sx={{ boxShadow: 3, mr: 4 }}>
            {icon}
          </CustomAvatar>
          {infoIcon && (
            <IconButton
              size="small"
              aria-label="settings"
              className="card-more-options"
              sx={{ color: "text.secondary" }}
            >
              <Tooltip title={tooltip}>
                <InformationOutline />
              </Tooltip>
            </IconButton>
          )}
        </Box>
        <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
          {title}
        </Typography>
        <Box
          sx={{
            mt: 1.5,
            display: "flex",
            flexWrap: "wrap",
            mb: 1.5,
            alignItems: "flex-start"
          }}
        >
          <Typography variant="h6" sx={{ mr: 2 }}>
            {stats}
          </Typography>
          <Typography
            component="sup"
            variant="caption"
            sx={{ color: trend === "positive" ? "success.main" : "error.main" }}
          >
            {trendNumber}
          </Typography>
        </Box>
        <Typography variant="caption">{subtitle}</Typography>
      </CardContent>
    </Card>
  );
};

export default CardStatsVertical;

CardStatsVertical.defaultProps = {
  color: "primary",
  trend: "positive"
};
