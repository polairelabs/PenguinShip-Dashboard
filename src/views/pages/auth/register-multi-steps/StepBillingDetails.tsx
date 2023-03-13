import { ChangeEvent, useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Icon from "src/@core/components/icon";

import "react-credit-cards/es/styles-compiled.css";
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
          Select plan as per your requirement
        </Typography>
      </Box>

      <Grid spacing={5}>
        <MembershipSelect
          setSelectedMembership={setSelectedMembership}
          handleSubmit={submit}
          handlePrev={handlePrev}
        />
      </Grid>
    </Grid>
  );
};

export default StepBillingDetails;
