import { ReactNode, ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "src/hooks/useAuth";
import authConfig from "../../../configs/auth";

interface GuestGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props;
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    // If user exists, disallow him from accessing guest pages (e.g login and register)
    if (window.localStorage.getItem(authConfig.storageUserDataKey)) {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route]);

  if (auth.loading || (!auth.loading && auth.user !== null)) {
    return fallback;
  }

  return <>{children}</>;
};

export default GuestGuard;
