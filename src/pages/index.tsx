import { useEffect } from "react";
import { useRouter } from "next/router";
import Spinner from "src/@core/components/spinner";
import { useAuth } from "src/hooks/useAuth";

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = (role: string) => {
  return "/home";
};

const Home = () => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (auth.user && auth.user.role) {
      const homeRoute = getHomeRoute(auth.user.role);

      // Redirect packages to Home URL
      router.replace(homeRoute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Spinner />;
};

export default Home;
