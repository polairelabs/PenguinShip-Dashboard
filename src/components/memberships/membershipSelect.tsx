import { ChangeEvent, useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { CustomRadioIconsData } from "src/@core/components/custom-radio/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchMemberships, fetchMembershipsAdmin } from "../../store/auth";
import { Membership } from "../../types/apps/NavashipTypes";
import { CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import CustomRadioIcons from "../../@core/components/custom-radio/icons";
import Button from "@mui/material/Button";
import Icon from "../../@core/components/icon";

interface MembershipSelectProp {
  setSelectedMembership: (membership: Membership | undefined) => void;
  isAdminEditForm?: boolean; // True when in component is used for admin form
  handleSubmit?: () => void;
  handlePrev?: () => void;
}

const MembershipSelect = ({
  setSelectedMembership,
  isAdminEditForm,
  handleSubmit,
  handlePrev
}: MembershipSelectProp) => {
  const [selectedRadio, setSelectedRadio] = useState<string>();
  const memberships = useSelector((state: RootState) => state.auth.memberships);
  const fetchMembershipsStatus = useSelector(
    (state: RootState) => state.auth.fetchMembershipsStatus
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isAdminEditForm) {
      dispatch(fetchMembershipsAdmin());
    } else {
      dispatch(fetchMemberships());
    }
  }, []);

  const membershipRadioButtons: CustomRadioIconsData[] = memberships.map(
    (membership) => {
      return {
        value: membership.id,
        title: (
          <Typography variant="h5" mb={1.2}>
            {membership.name}
          </Typography>
        ),
        content: (
          <Box
            sx={{
              my: "auto",
              display: "flex",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
              {membership.description}
            </Typography>
            <Box sx={{ mt: 2, display: "flex" }}>
              <Typography
                component="sup"
                sx={{ mt: 1.5, color: "primary.main", alignSelf: "flex-start" }}
              >
                $
              </Typography>
              <Typography
                component="span"
                sx={{ fontSize: "2rem", color: "primary.main" }}
              >
                {membership.unitAmount / 100}
              </Typography>
              <Typography
                component="sub"
                sx={{ mb: 1.5, alignSelf: "flex-end", color: "text.disabled" }}
              >
                /month
              </Typography>
            </Box>
          </Box>
        )
      };
    }
  );

  const handleRadioChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === "string") {
      setSelectedRadio(prop);
      setSelectedMembership(
        memberships.find((membership: Membership) => membership.id == prop)
      );
    } else {
      const membershipId = (prop.target as HTMLInputElement).value;
      setSelectedRadio(membershipId);
      setSelectedMembership(
        memberships.find(
          (membership: Membership) => membership.id === membershipId
        )
      );
    }
  };

  return (
    <Box>
      {fetchMembershipsStatus === "LOADING" ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8rem"
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={5}>
          {membershipRadioButtons.map((item, index) => (
            <CustomRadioIcons
              key={index}
              data={membershipRadioButtons[index]}
              selected={selectedRadio}
              name="custom-radios-plan"
              gridProps={{ sm: 4, xs: 12 }}
              handleChange={handleRadioChange}
            />
          ))}
          {!isAdminEditForm && (
            <Grid item>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    color: "text.secondary",
                    mr: 2
                  }}
                >
                  <Icon icon="mdi:circle-outline" fontSize="0.75rem" />
                </Box>
                <Typography variant="body2">
                  All plans come with a <b>free 7-day trial</b>
                </Typography>
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: handlePrev ? "space-between" : "flex-end"
              }}
            >
              {handlePrev && (
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={handlePrev}
                  sx={{ justifyContent: "flex-start" }}
                  startIcon={<Icon icon="mdi:chevron-left" fontSize={20} />}
                >
                  Previous
                </Button>
              )}
              {handleSubmit && (
                <Box>
                  <Button
                    disabled={!selectedRadio}
                    color={isAdminEditForm ? "primary" : "success"}
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ justifyContent: "flex-end" }}
                  >
                    {isAdminEditForm ? "Edit" : "Submit"}
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default MembershipSelect;
