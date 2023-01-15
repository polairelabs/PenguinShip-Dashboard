// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Imports
import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'

// ** Step Components
import StepPersonalInfo from 'src/views/pages/auth/register-multi-steps/StepPersonalInfo'
import StepAccountDetails from 'src/views/pages/auth/register-multi-steps/StepAccountDetails'
import StepBillingDetails from 'src/views/pages/auth/register-multi-steps/StepBillingDetails'

// ** Custom Component Import
import StepperCustomDot from 'src/views/forms/form-wizard/StepperCustomDot'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import { dispatch } from "react-hot-toast/dist/core/store";
import { createAccount, fetchMemberships } from "../../../../store/auth";
import { useDispatch, useSelector } from "react-redux";
import { AddressDetails } from "../../../../components/addresses/addressForm";
import { AppDispatch, RootState } from "../../../../store";
import { fetchShipments } from "../../../../store/apps/shipments";
import { AccountData } from "../../../../types/apps/navashipInterfaces";

const steps = [
  {
    title: 'Account',
    subtitle: 'Account Details'
  },
  {
    title: 'Personal',
    subtitle: 'Enter Information'
  },
  {
    title: 'Billing',
    subtitle: 'Payment Details'
  }
]


const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;


const RegisterMultiSteps = () => {
  // ** States
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<AccountData>({
    firstName: "",
    lastName: "",
    state: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    membershipId: 0,
  });
  const store = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  // Handle Stepper
  const handleNext = () => {
    if (activeStep === 2) {
      dispatch(createAccount({...formData}));
    }
    setActiveStep(activeStep + 1)
  }

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <StepAccountDetails handleChange={handleChange} formData={formData} handleNext={handleNext} />
      case 1:
        return <StepPersonalInfo handleChange={handleChange} formData={formData} handleNext={handleNext} handlePrev={handlePrev} />
      case 2:
        return <StepBillingDetails handleChange={handleChange} formData={formData} handlePrev={handlePrev} handleNext={handleNext} />

      default:
        return null
    }
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }

  return (
    <>
      <StepperWrapper sx={{ mb: 10 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((step, index) => {
            return (
              <Step key={index}>
                <StepLabel StepIconComponent={StepperCustomDot}>
                  <div className='step-label'>
                    <Typography className='step-number'>{`0${index + 1}`}</Typography>
                    <div>
                      <Typography className='step-title'>{step.title}</Typography>
                      <Typography className='step-subtitle'>{step.subtitle}</Typography>
                    </div>
                  </div>
                </StepLabel>
              </Step>
            )
          })}
        </Stepper>
      </StepperWrapper>
      {renderContent()}
    </>
  )
}

export default RegisterMultiSteps
