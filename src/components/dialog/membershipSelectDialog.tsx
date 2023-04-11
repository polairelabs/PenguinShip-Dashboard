import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { Membership } from "../../types/apps/NavashipTypes";
import MembershipSelect from "../memberships/membershipSelect";
import { useEffect, useState } from "react";
import { IconButton, Typography } from "@mui/material";
import { Close, InformationOutline } from "mdi-material-ui";
import BaseApi from "../../api/api";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const MembershipSelectDialog = () => {
  const router = useRouter();
  const auth = useAuth();
  const [selectedMembership, setSelectedMembership] = useState<
    Membership | undefined
  >();
  const [successOpen, setSuccessOpen] = useState(false);

  const submit = async () => {
    if (!selectedMembership || !auth.user) {
      toast.error("No membership selected", {
        position: "top-center"
      });
      return;
    }
    const checkoutSessionResponse = await BaseApi.createCheckoutSession(
      selectedMembership.id,
      auth.user.id
    );
    await router.push(checkoutSessionResponse.checkout_url);
  };

  useEffect(() => {
    const { query } = router;
    if (query.success === "true") {
      // Show success message
      setSuccessOpen(true);
      // Update user information
      auth.updateUser();
      router.replace("/");
    } else if (query.canceled === "true") {
      toast.error("Payment was cancelled", {
        position: "top-center"
      });
    }
  }, [router.query]);

  return (
    <Dialog fullWidth open={true} maxWidth="md">
      <DialogTitle>
        Choose the plan that best fits your needs
        <IconButton
          size="small"
          onClick={() => auth.logout()}
          sx={{ position: "absolute", right: "1rem", top: "1rem" }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box mb={4}>
          <Typography variant="body2">
            <IconButton aria-label="info">
              <InformationOutline color="info" />
            </IconButton>
            A membership is required to access the dashboard
          </Typography>
        </Box>
        <MembershipSelect
          setSelectedMembership={setSelectedMembership}
          handleSubmit={submit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MembershipSelectDialog;
