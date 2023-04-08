import { Fragment, SyntheticEvent, useContext, useState } from "react";

import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import CogOutline from "mdi-material-ui/CogOutline";
import LogoutVariant from "mdi-material-ui/LogoutVariant";
import HelpCircleOutline from "mdi-material-ui/HelpCircleOutline";

import { useAuth } from "src/hooks/useAuth";

import { Settings } from "src/@core/context/settingsContext";
import { capitalizeFirstLetterOnly } from "../../utils";
import { FileDocumentEditOutline, ShieldAccountOutline } from "mdi-material-ui";
import { AbilityContext } from "./acl/Can";

interface Props {
  settings: Settings;
}

const BadgeContentSpan = styled("span")(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}));

const UserDropdown = (props: Props) => {
  const ability = useContext(AbilityContext);
  const { settings } = props;
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { direction } = settings;

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url);
    }
    setAnchorEl(null);
  };

  const styles = {
    py: 2,
    px: 4,
    width: "100%",
    display: "flex",
    alignItems: "center",
    color: "text.primary",
    textDecoration: "none",
    "& svg": {
      fontSize: "1.375rem",
      color: "text.secondary"
    }
  };

  const handleLogout = () => {
    logout();
    handleDropdownClose();
  };

  return (
    <Fragment>
      <Badge
        overlap="circular"
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: "pointer" }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
      >
        <Avatar
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src="/images/avatars/1.png"
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ "& .MuiMenu-paper": { width: 230, mt: 4 } }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: direction === "ltr" ? "right" : "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: direction === "ltr" ? "right" : "left"
        }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Badge
              overlap="circular"
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
            >
              <Avatar
                src="/images/avatars/1.png"
                sx={{ width: "2.5rem", height: "2.5rem" }}
              />
            </Badge>
            <Box
              sx={{
                ml: 3,
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column"
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                {capitalizeFirstLetterOnly(user?.firstName ?? "") +
                  " " +
                  capitalizeFirstLetterOnly(user?.lastName ?? "")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8rem",
                  color: "text.disabled"
                }}
              >
                {user?.role}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        {/*<MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>*/}
        {/*  <Box sx={styles}>*/}
        {/*    <AccountOutline sx={{ mr: 2 }} />*/}
        {/*    Profile*/}
        {/*  </Box>*/}
        {/*</MenuItem>*/}
        {/*<MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>*/}
        {/*  <Box sx={styles}>*/}
        {/*    <EmailOutline sx={{ mr: 2 }} />*/}
        {/*    Inbox*/}
        {/*  </Box>*/}
        {/*</MenuItem>*/}
        {ability?.can("read", "admin") ? (
          <MenuItem
            sx={{ p: 0 }}
            onClick={() => handleDropdownClose("/admin/edit-memberships")}
          >
            <Box sx={styles}>
              <ShieldAccountOutline sx={{ mr: 2 }} />
              Admin Panel
            </Box>
          </MenuItem>
        ) : null}
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <CogOutline sx={{ mr: 2 }} />
            User Settings
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => {}}>
          <Box sx={styles}>
            <FileDocumentEditOutline sx={{ mr: 2 }} />
            Submit a claim
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose("/faq")}>
          <Box sx={styles}>
            <HelpCircleOutline sx={{ mr: 2 }} />
            FAQ
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 2 }} onClick={handleLogout}>
          <LogoutVariant
            sx={{
              mr: 2,
              fontSize: "1.375rem",
              color: "text.secondary"
            }}
          />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default UserDropdown;
