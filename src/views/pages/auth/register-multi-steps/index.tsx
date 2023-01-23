import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

import StepPersonalInfo from "src/views/pages/auth/register-multi-steps/StepPersonalInfo";
import StepAccountDetails from "src/views/pages/auth/register-multi-steps/StepAccountDetails";
import StepBillingDetails from "src/views/pages/auth/register-multi-steps/StepBillingDetails";

import StepperCustomDot from "src/views/forms/form-wizard/StepperCustomDot";

import StepperWrapper from "src/@core/styles/mui/stepper";
import { createAccount, fetchMemberships } from "../../../../store/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { AccountData } from "../../../../types/apps/navashipInterfaces";
import BaseApi from "../../../../api/api";
import { Link } from "@mui/material";
import VerificationModal from "../../../../components/verificationToken/verificationModal";

const steps = [
  {
    title: "Account",
    subtitle: "Account Details"
  },
  {
    title: "Personal",
    subtitle: "Enter Information"
  },
  {
    title: "Billing",
    subtitle: "Payment Details"
  }
];

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const RegisterMultiSteps = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<AccountData>({
    firstName: "",
    lastName: "",
    state: "",
    address: "",
    city: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    membershipProductLink: "",
    stripePriceId: ""
  });
  const store = useSelector((state: RootState) => state.auth);
  const [successOpen, setSuccessOpen] = useState(false);
  const [canceledOpen, setCanceledOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [selectedMembershipId, setSelectedMembershipId] = useState("");

  const handleNext = async (selectedMembershipId?: string) => {
    if (activeStep === 2 && selectedMembershipId) {
      // TODO: If registration doesn't work we need to handle the error and not go to checkout
      dispatch(
        createAccount({ ...formData, stripePriceId: selectedMembershipId })
      ).then((response) => {
        BaseApi.createCheckoutSession(
          selectedMembershipId,
          response?.payload.stripeCustomerId
        ).then((data) => {
          router.push(data.checkout_url);
        });
      });
    }
    setActiveStep(activeStep + 1);
  };

  useEffect(() => {
    const { query } = router;
    if (query.success === "true") {
      // Show success message
      setSuccessOpen(true);
    } else if (query.canceled === "true") {
      // Show canceled message
      setCanceledOpen(true);
    }
  }, [router.query]);

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  const handleCanceledClose = () => {
    setCanceledOpen(false);
  };

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <StepAccountDetails
            handleChange={handleChange}
            formData={formData}
            handleNext={handleNext}
          />
        );
      case 1:
        return (
          <StepPersonalInfo
            handleChange={handleChange}
            formData={formData}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        );
      case 2:
        return (
          <StepBillingDetails
            handleChange={handleChange}
            formData={formData}
            handlePrev={handlePrev}
            handleNext={handleNext}
            membershipId={setSelectedMembershipId}
          />
        );

      default:
        return null;
    }
  };

  const renderContent = () => {
    return getStepContent(activeStep);
  };
  return (
    <>
      {successOpen && (
        <div>
          Payment completed successfully! <Link href="/login">Go to login</Link>
        </div>
      )}
      {canceledOpen && (
        <div>
          Payment cancelled.{" "}
          <Link href="/register">
            Click here if you would like to register again.
          </Link>
        </div>
      )}
      {!successOpen && !canceledOpen && (
        <>
          <StepperWrapper sx={{ mb: 10 }}>
            <Stepper activeStep={activeStep}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel StepIconComponent={StepperCustomDot}>
                    <div className="step-label">
                      <Typography className="step-number">{`0${
                        index + 1
                      }`}</Typography>
                      <div>
                        <Typography className="step-title">
                          {step.title}
                        </Typography>
                        <Typography className="step-subtitle">
                          {step.subtitle}
                        </Typography>
                      </div>
                    </div>
                  </StepLabel>
                  <VerificationModal
                    open={false}
                    onClose={() => alert("cool")}
                    onValidate={() => alert("validate")}
                  />
                </Step>
              ))}
            </Stepper>
          </StepperWrapper>

          {renderContent()}
          <Typography variant="body2" sx={{ mr: 2, mt: 2 }}>
            Already have an account ? <Link href="/login">Go to login</Link>
          </Typography>
        </>
      )}
    </>
  );
};
export default RegisterMultiSteps;