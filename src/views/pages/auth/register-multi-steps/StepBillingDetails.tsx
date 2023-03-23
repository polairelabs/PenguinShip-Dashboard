import { useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { Membership } from "../../../../types/apps/NavashipTypes";
import MembershipSelect from "../../../../components/memberships/membershipSelect";

interface Props {
  handlePrev: () => void;
  handleNext: (selectedMembershipId: string | undefined) => void;
}

const StepBillingDetails = ({ handlePrev, handleNext }: Props) => {
  const [selectedMembership, setSelectedMembership] = useState<
    Membership | undefined
  >();

  const submit = () => {
    handleNext(selectedMembership?.id);
  };

  return (
    <Grid container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5">Select Plan</Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Choose the plan that best fits your needs
        </Typography>
      </Box>

      <MembershipSelect
        setSelectedMembership={setSelectedMembership}
        handleSubmit={submit}
        handlePrev={handlePrev}
      />
    </Grid>
  );
};

export default StepBillingDetails;
