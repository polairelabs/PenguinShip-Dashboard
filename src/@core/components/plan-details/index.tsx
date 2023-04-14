// ** MUI Imports
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box, { BoxProps } from "@mui/material/Box";

// ** Icons Imports
import CircleOutline from "mdi-material-ui/CircleOutline";

// ** Types
import { Membership } from "../../../types/apps/NavashipTypes";

// ** Styled Component for the wrapper of whole component
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadius
}));

// ** Styled Component for the wrapper of all the features of a plan
const BoxFeature = styled(Box)<BoxProps>(({ theme }) => ({
  marginBottom: theme.spacing(5.75),
  "& > :not(:first-of-type)": {
    marginTop: theme.spacing(3.5)
  }
}));
interface Props {
  data: Membership | null
}
const PlanDetails = (props: Props) => {
  const { data } = props;

  return (
    <BoxWrapper>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h5">{data?.name}</Typography>
        <Box sx={{ mt: 4.4, mb: 9.2, position: "relative" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography
              variant="body2"
              sx={{ mt: 1.6, alignSelf: "flex-start" }}
            >
              $
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                color: "primary.main",
                lineHeight: 1.17
              }}
            >
              {data?.unitAmount}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.6, alignSelf: "flex-end" }}>
              /month
            </Typography>
          </Box>
        </Box>
      </Box>
      <BoxFeature>
        <Box  sx={{ display: "flex", alignItems: "center" }}>
          <CircleOutline
            sx={{ fontSize: "0.75rem", mr: 2, color: "text.secondary" }}
          />
          <Typography variant="body2">{data?.description}</Typography>
        </Box>
      </BoxFeature>
      <Button
        fullWidth
        color={localStorage.getItem("currentPlan") ? "success" : "primary"}
      >
        {localStorage.getItem("currentPlan") ? "Your Current Plan" : "Upgrade"}
      </Button>
    </BoxWrapper>
  );
};

export default PlanDetails;
