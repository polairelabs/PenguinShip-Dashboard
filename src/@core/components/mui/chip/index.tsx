import MuiChip from "@mui/material/Chip";

import { CustomChipProps } from "./types";

import useBgColor, { UseBgColorType } from "src/@core/hooks/useBgColor";
import { Tooltip } from "@mui/material";

const Chip = (props: CustomChipProps) => {
  const { sx, skin, color } = props;
  const bgColors = useBgColor();

  const colors: UseBgColorType = {
    primary: { ...bgColors.primaryLight },
    secondary: { ...bgColors.secondaryLight },
    success: { ...bgColors.successLight },
    error: { ...bgColors.errorLight },
    warning: { ...bgColors.warningLight },
    info: { ...bgColors.infoLight }
  };

  return (
    <Tooltip title={props.title ? props.title : ""}>
      <MuiChip
        {...props}
        variant="filled"
        {...(skin === "light" && { className: "MuiChip-light" })}
        sx={skin === "light" && color ? Object.assign(colors[color], sx) : sx}
      />
    </Tooltip>
  );
};

export default Chip;
