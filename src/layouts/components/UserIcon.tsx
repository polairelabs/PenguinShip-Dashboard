import { ReactNode } from "react";

import { SvgIconProps } from "@mui/material";

interface UserIconProps {
  iconProps?: SvgIconProps;
  icon: string | ReactNode;
  componentType: "search" | "vertical-menu" | "horizontal-menu";
}

const UserIcon = (props: UserIconProps) => {
  const { icon, iconProps, componentType } = props;
  const IconTag = icon;

  // @ts-ignore
  return <IconTag {...iconProps} />;
};

export default UserIcon;
