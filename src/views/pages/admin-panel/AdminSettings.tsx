import { ReactElement, useState, useEffect, SyntheticEvent } from "react";

import { useRouter } from "next/router";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import Typography from "@mui/material/Typography";
import { styled, Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MuiTabList, { TabListProps } from "@mui/lab/TabList";
import CircularProgress from "@mui/material/CircularProgress";

import Icon from "src/@core/components/icon";

import { PricingPlanType } from "src/@core/components/plan-details/types";

import TabEditMembership from "src/views/pages/admin-panel/TabEditMembership";

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  "& .MuiTabs-indicator": {
    display: "none"
  },
  "& .Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  "& .MuiTab-root": {
    minWidth: 65,
    minHeight: 40,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up("md")]: {
      minWidth: 130
    }
  }
}));

const AdminSettings = ({
  tab,
  // apiPricingPlanData
}: {
  tab: string;
  // apiPricingPlanData: PricingPlanType[];
}) => {
  const [activeTab, setActiveTab] = useState<string>(tab);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const hideText = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true);
    router
      .push(`/admin/${value.toLowerCase()}`)
      .then(() => setIsLoading(false));
  };

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const tabContentList: { [key: string]: ReactElement } = {
    "edit-memberships": <TabEditMembership />
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TabList
                variant="scrollable"
                scrollButtons="auto"
                onChange={handleChange}
                aria-label="admin tabs"
              >
                <Tab
                  value="edit-memberships"
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        ...(!hideText && { "& svg": { mr: 2 } })
                      }}
                    >
                      <Icon icon="mdi:account-outline" />
                      {!hideText && "Edit Memberships"}
                    </Box>
                  }
                />
                {/*<Tab*/}
                {/*  value="faq"*/}
                {/*  label={*/}
                {/*    <Box sx={{ display: "flex", alignItems: "center", ...(!hideText && { "& svg": { mr: 2 } }) }}>*/}
                {/*      <Icon icon="mdi:frequently-asked-questions" />*/}
                {/*      {!hideText && "Edit FAQ"}*/}
                {/*    </Box>*/}
                {/*  }*/}
                {/*/>*/}
              </TabList>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ pt: (theme) => `${theme.spacing(4)} !important` }}
            >
              {isLoading ? (
                <Box
                  sx={{
                    mt: 6,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                  }}
                >
                  <CircularProgress sx={{ mb: 4 }} />
                  <Typography>Loading...</Typography>
                </Box>
              ) : (
                <TabPanel sx={{ p: 0 }} value={activeTab}>
                  {tabContentList[activeTab]}
                </TabPanel>
              )}
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
    </Grid>
  );
};

export default AdminSettings;
