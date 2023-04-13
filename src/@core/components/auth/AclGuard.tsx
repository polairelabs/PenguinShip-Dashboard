import { ReactNode, useState } from "react";

import { useRouter } from "next/router";
import type { ACLObj, AppAbility } from "src/configs/acl";
import { buildAbilityFor, Role } from "src/configs/acl";
import { AbilityContext } from "src/layouts/components/acl/Can";
import NotAuthorized from "src/pages/401";
import BlankLayout from "src/@core/layouts/BlankLayout";

import { useAuth } from "src/hooks/useAuth";

interface AclGuardProps {
  children: ReactNode;
  guestGuard: boolean;
  aclAbilities: ACLObj;
}

const AclGuard = (props: AclGuardProps) => {
  const { aclAbilities, children, guestGuard } = props;

  const [ability, setAbility] = useState<AppAbility | undefined>(undefined);

  const auth = useAuth();
  const router = useRouter();

  // If guestGuard is true and packages is not logged in or its an error page, render the page without checking access
  if (
    guestGuard ||
    router.route === "/404" ||
    router.route === "/500" ||
    router.route === "/"
  ) {
    return <>{children}</>;
  }

  // User is logged in, build ability for the packages based on his role
  if (auth.user && auth.user.role && !ability) {
    setAbility(buildAbilityFor(auth.user.role, aclAbilities.subject));
  }

  // Check the access of current packages and render pages
  if (ability && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return (
      <AbilityContext.Provider value={ability}>
        {children}
      </AbilityContext.Provider>
    );
  }

  if (
    auth.user &&
    auth.user.role == Role.NEW_USER &&
    router.pathname !== "/init"
  ) {
    router.push("/init");
    return null;
  }

  if (router.pathname === "/confirm-account") {
    // Always render this page
    return <>{children}</>;
  }

  // Render Not Authorized component if the current package has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  );
};

export default AclGuard;
