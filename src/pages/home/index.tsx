import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import ShipmentStatisticsCard from "../../views/dashboard/ShipmentStatisticsCard";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchDashboardStats } from "../../store/auth";
import ActivityTimeline from "../../views/dashboard/ActivityTimeline";
import { useAuth } from "../../hooks/useAuth";
import { CurrencyUsd, InformationOutline } from "mdi-material-ui";
import CardStatsVertical from "../../views/dashboard/CardStatsVertical";
import PackageVariantClosed from "mdi-material-ui/PackageVariantClosed";
import { IconButton } from "@mui/material";
import { capitalizeFirstLetterOnly } from "../../utils";
import { styled } from "@mui/material/styles";
import { Role } from "../../configs/acl";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const statistics = useSelector(
    (state: RootState) => state.auth.dashboardStatistics
  );
  const auth = useAuth();

  const StyledGrid = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
      order: -1,
      display: "flex",
      justifyContent: "center"
    }
  }));

  const Img = styled("img")(({ theme }) => ({
    right: 0,
    bottom: 0,
    height: 180,
    position: "absolute",
    [theme.breakpoints.down("sm")]: {
      visibility: "hidden"
    }
  }));

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, []);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={8} sx={{ order: 0, alignSelf: "flex-end" }}>
        <Card
          sx={{
            position: "relative",
            overflow: "visible",
            mt: { xs: 0, sm: 7.5, md: 0 }
          }}
        >
          <CardContent
            sx={{
              p: (theme) => `${theme.spacing(8.25, 7.5, 6.25, 7.5)} !important`
            }}
          >
            <Grid container spacing={6}>
              <Grid item xs={12} sm={12}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  {`Welcome ${capitalizeFirstLetterOnly(
                    auth?.user?.firstName ?? ""
                  )}!`}
                </Typography>
                <Typography variant="body2">
                  <IconButton aria-label="info">
                    <InformationOutline
                      color={auth?.user?.role === Role.USER ? "info" : "error"}
                    />
                  </IconButton>
                  {auth.user?.role === Role.USER
                    ? statistics.currentMonthShipmentCreated > 0
                      ? `You have created ${statistics.currentMonthShipmentCreated} out of ${statistics.maxShipmentCreatedLimit} allowed shipments for this month`
                      : `You can create up to ${
                          statistics.maxShipmentCreatedLimit ?? 0
                        } shipments per month`
                    : auth.user?.role === Role.UNPAID_USER &&
                      "No subscription active. Go to user settings to choose a new plan"}
                </Typography>
                <Typography variant="body2">
                  <IconButton aria-label="info">
                    <InformationOutline
                      color={
                        statistics.totalShipmentsDraftCount === 0
                          ? "info"
                          : "warning"
                      }
                    />
                  </IconButton>
                  {statistics.totalShipmentsDraftCount === 0
                    ? "No shipments in draft"
                    : statistics.totalShipmentsDraftCount === 1
                    ? `You have ${statistics.totalShipmentsDraftCount} shipment in draft`
                    : `You have ${
                        statistics.totalShipmentsDraftCount ?? 0
                      } shipments that are still in draft`}
                </Typography>
                <StyledGrid item xs={12} sm={6}>
                  <Img
                    alt="Congratulations John"
                    src="/images/misc/triangle-dark.png"
                  />
                </StyledGrid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2} sx={{ order: 0 }}>
        <CardStatsVertical
          stats={
            statistics.totalMoneySaved ? `$${statistics.totalMoneySaved}` : "$0"
          }
          color="success"
          title="Money saved"
          icon={<CurrencyUsd />}
          subtitle={"Total money saved"}
          infoIcon={true}
          tooltip={
            "Amount of money saved by purchasing at a discounted price through Navaship instead of buying at full retail value from carriers' website"
          }
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2} sx={{ order: 0 }}>
        <CardStatsVertical
          stats={statistics.totalPackagesCount ?? 0}
          color="secondary"
          title="Parcels created"
          icon={<PackageVariantClosed />}
          subtitle={"Total parcels created"}
          infoIcon={false}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <ShipmentStatisticsCard
          totalShipmentsCreatedCount={statistics.totalShipmentsCreatedCount}
          totalShipmentsInTransitCount={statistics.totalShipmentsInTransitCount}
          totalShipmentsDeliveredCount={statistics.totalShipmentsDeliveredCount}
        />
      </Grid>

      <Grid item sm={6} xs={12}>
        <ActivityTimeline activityLogs={statistics.logs} />
      </Grid>
    </Grid>
  );
};

export default Home;
