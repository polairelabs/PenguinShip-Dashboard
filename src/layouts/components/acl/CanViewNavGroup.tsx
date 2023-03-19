import { ReactNode, useContext } from "react";
import { AbilityContext } from "src/layouts/components/acl/Can";
import { NavGroup, NavLink } from "src/@core/layouts/types";

interface Props {
  navGroup?: NavGroup;
  children: ReactNode;
}

const CanViewNavGroup = (props: Props) => {
  const { children, navGroup } = props;

  const ability = useContext(AbilityContext);

  const canViewMenuGroup = (item: NavGroup) => {
    const hasAnyVisibleChild =
      item.children &&
      item.children.some(
        (i: NavLink) => ability && ability.can(i.action, i.subject)
      );

    if (!(item.action && item.subject)) {
      return hasAnyVisibleChild;
    }

    return (
      ability && ability.can(item.action, item.subject) && hasAnyVisibleChild
    );
  };

  return navGroup && canViewMenuGroup(navGroup) ? <>{children}</> : null;
};

export default CanViewNavGroup;
