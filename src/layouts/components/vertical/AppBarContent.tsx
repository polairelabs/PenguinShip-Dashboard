import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import MenuIcon from "mdi-material-ui/Menu";

import { Settings } from "src/@core/context/settingsContext";

import ModeToggler from "src/@core/layouts/components/shared-components/ModeToggler";
import UserDropdown from "src/layouts/components/UserDropdown";

interface Props {
  hidden: boolean;
  settings: Settings;
  toggleNavVisibility: () => void;
  saveSettings: (values: Settings) => void;
}

const AppBarContent = ({
  hidden,
  settings,
  saveSettings,
  toggleNavVisibility
}: Props) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <Box
        className="actions-left"
        sx={{ mr: 2, display: "flex", alignItems: "center" }}
      >
        {hidden ? (
          <IconButton
            color="inherit"
            sx={{ ml: -2.75 }}
            onClick={toggleNavVisibility}
          >
            <MenuIcon />
          </IconButton>
        ) : null}

        <ModeToggler settings={settings} saveSettings={saveSettings} />
      </Box>
      <Box
        className="actions-right"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <UserDropdown settings={settings} />
      </Box>
    </Box>
  );
};

export default AppBarContent;
