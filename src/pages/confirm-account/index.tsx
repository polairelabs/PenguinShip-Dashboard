import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import authConfig from "../../configs/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { clearConfirmEmailStatus, confirmEmail } from "../../store/auth";
import { toast } from "react-hot-toast";
import BlankLayout from "../../@core/layouts/BlankLayout";
import { useAuth } from "../../hooks/useAuth";

const ConfirmAccount = () => {
  const router = useRouter();
  const auth = useAuth();

  const dispatch = useDispatch<AppDispatch>();
  const confirmEmailStatus = useSelector(
    (state: RootState) => state.auth.confirmEmailStatus
  );

  useEffect(() => {
    const { query } = router;
    if (query.token) {
      dispatch(confirmEmail(query.token as string));
      if (window.localStorage.getItem(authConfig.storageUserDataKey)) {
        // auth.updateUserData();
        router.push("/home");
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router.query]);

  useEffect(() => {
    if (confirmEmailStatus === "SUCCESS") {
      toast.success("Successfully verified email", {
        position: "top-center"
      });
    } else if (confirmEmailStatus === "ERROR") {
      toast.error("Expired verify account link. Please request a new one", {
        position: "top-center"
      });
    }
    dispatch(clearConfirmEmailStatus());
  }, [confirmEmailStatus]);

  return (
    <>
      <div>
        <p>Loading...</p>
      </div>
    </>
  );
};

ConfirmAccount.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
);

ConfirmAccount.guestGuard = false;
ConfirmAccount.authGuard = false;

export default ConfirmAccount;
