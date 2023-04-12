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
import {
  clearAccountCreationStatus,
  clearCreateAccountError,
  createAccount
} from "../../../../store/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { AccountData } from "../../../../types/apps/NavashipTypes";
import BaseApi from "../../../../api/api";
import { Link } from "@mui/material";
import VerificationDialog from "../../../../components/dialog/verificationDialog";
import toast from "react-hot-toast";

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
    confirmPassword: ""
  });
  const [successOpen, setSuccessOpen] = useState(false);
  const [canceledOpen, setCanceledOpen] = useState(false);
  const [selectedMembershipId, setSelectedMembershipId] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const authStore = useSelector((state: RootState) => state.auth);

  const handleNext = async (selectedMembershipId?: string) => {
    if (activeStep === 2 && selectedMembershipId) {
      setSelectedMembershipId(selectedMembershipId);
      const createAccountAction = createAccount({ ...formData });
      await dispatch(createAccountAction);
      return; // Next page handled by useEffect
    }
    setActiveStep(activeStep + 1);
  };

  useEffect(() => {
    // Handle next page from shipment to rates (Once shipment object in the store changes)
    if (authStore.accountCreationStatus === "SUCCESS") {
      toast.success(
        "Success! A verification email has been sent to your email address ",
        {
          position: "top-center"
        }
      );
      BaseApi.createCheckoutSession(
        selectedMembershipId,
        authStore.createAccountPayload.id
      )
        .then((checkoutSessionResponse) => {
          router.push(checkoutSessionResponse.checkout_url);
        })
        .catch((e) => {
          toast.error(`Error generating payment link`, {
            position: "top-center"
          });
        });
      setActiveStep(activeStep + 1);
    } else if (authStore.accountCreationStatus === "ERROR") {
      toast.error(
        `${authStore.createAccountError ?? "Error creating account"}`,
        {
          position: "top-center"
        }
      );
      dispatch(clearCreateAccountError());
    }

    dispatch(clearAccountCreationStatus());
  }, [authStore.accountCreationStatus, selectedMembershipId]);

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
          <StepBillingDetails handlePrev={handlePrev} handleNext={handleNext} />
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
          <Link href="/login">Click here if you would like to login.</Link>
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
                  <VerificationDialog
                    open={false}
                    onClose={() => alert("cool")}
                    onValidate={() => alert("validate")}
                  />
                </Step>
              ))}
            </Stepper>
          </StepperWrapper>

          {renderContent()}
          <Typography variant="body2" sx={{ mr: 2, mt: 8 }}>
            Already have an account ? <Link href="/login">Go to login</Link>
          </Typography>
        </>
      )}
    </>
  );
};

export default RegisterMultiSteps;
