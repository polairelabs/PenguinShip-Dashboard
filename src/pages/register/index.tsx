import { ReactNode } from "react";

import Box, { BoxProps } from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";

import BlankLayout from "src/@core/layouts/BlankLayout";

import { useSettings } from "src/@core/hooks/useSettings";

import RegisterMultiStepsWizard from "src/views/pages/auth/register-multi-steps";

const RegisterMultiStepsIllustration = styled("img")({
  height: "auto",
  maxHeight: 650,
  maxWidth: "100%"
});

const LeftWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(12, 0, 12, 12),
  [theme.breakpoints.up("lg")]: {
    maxWidth: 480
  },
  [theme.breakpoints.down(1285)]: {
    maxWidth: 400
  },
  [theme.breakpoints.up("xl")]: {
    maxWidth: 635
  }
}));

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(6),
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(12)
  }
}));

const WizardWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  maxWidth: 700,
  margin: theme.spacing(0, "auto"),
  [theme.breakpoints.up("md")]: {
    width: 700
  }
}));

const Register = () => {
  const theme = useTheme();
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down("lg"));

  const { skin } = settings;

  return (
    <Box className="content-right">
      {!hidden ? (
        <LeftWrapper>
          <RegisterMultiStepsIllustration
            alt="register-multi-steps-illustration"
            src="/images/pages/auth-v2-register-multi-steps-illustration.png"
          />
        </LeftWrapper>
      ) : null}
      <RightWrapper
        sx={
          skin === "bordered" && !hidden
            ? { borderLeft: `1px solid ${theme.palette.divider}` }
            : {}
        }
      >
        <WizardWrapper>
          <RegisterMultiStepsWizard />
        </WizardWrapper>
      </RightWrapper>
    </Box>
  );
};

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

Register.guestGuard = true;

export default Register;
