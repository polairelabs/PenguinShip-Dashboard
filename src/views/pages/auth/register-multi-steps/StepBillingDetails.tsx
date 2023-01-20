// ** React Imports
import { useState, ChangeEvent, useEffect } from "react";

// ** MUI Components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";

// ** Type Import
import { CustomRadioIconsData } from "src/@core/components/custom-radio/types";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Custom Components Imports
import CustomRadioIcons from "src/@core/components/custom-radio/icons";

// ** Util Import
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from "src/@core/utils/format";

// ** Styles Import
import "react-credit-cards/es/styles-compiled.css";
import { fetchMemberships } from "../../../../store/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { Membership } from "../../../../types/apps/navashipInterfaces";


interface Props {
  formData: any;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handlePrev: () => void;
  handleNext: (selectedMembershipId: string) => void;
  membershipId: React.Dispatch<React.SetStateAction<string>>;
}

const StepBillingDetails = ({
                              formData,
                              handleChange,
                              handlePrev,
                              handleNext,
                              membershipId
                            }: Props) => {
  // ** State
  const [selectedRadio, setSelectedRadio] = useState<string>();
  const dispatch = useDispatch<AppDispatch>();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMembershipId, setSelectedMembershipId] = useState("");
// TODO : NEED TO MAKE MEMBERSHIPID MANDATORY AND RETURN AN ERROR IF IT ISNT PASSED
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await dispatch(fetchMemberships());
      setMemberships(response.payload);
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const data: CustomRadioIconsData[] = memberships.map((membership) => {
    return {
      value: membership.stripePriceId,
      title: <Typography variant="h5">{membership.name}</Typography>,
      content: (
        <Box sx={{ my: "auto", display: "flex", alignItems: "center", flexDirection: "column" }}>
          <Typography sx={{ textAlign: "center", color: "text.secondary" }}>{membership.description}</Typography>
          <Box sx={{ mt: 2, display: "flex" }}>
            <Typography component="sup" sx={{ mt: 1.5, color: "primary.main", alignSelf: "flex-start" }}>
              $
            </Typography>
            <Typography component="span" sx={{ fontSize: "2rem", color: "primary.main" }}>
              {membership.unitAmount / 100}
            </Typography>
            <Typography component="sub" sx={{ mb: 1.5, alignSelf: "flex-end", color: "text.disabled" }}>
              /month
            </Typography>
          </Box>
        </Box>
      )
    };
  });

  const handleRadioChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === "string") {
      setSelectedRadio(prop);
      setSelectedMembershipId(prop);
      formData.membershipProductLink = selectedMembershipId;
    } else {
      setSelectedRadio((prop.target as HTMLInputElement).value);
      setSelectedMembershipId((prop.target as HTMLInputElement).value);
      formData.membershipProductLink = selectedMembershipId;
    }
  };

  const submit = () => {
    handleNext(selectedMembershipId);
  }

  if (loading) {
    return (
      <>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5">Select Plan</Typography>
          <Typography sx={{ color: "text.secondary" }}>Select plan as per your requirement</Typography>
        </Box>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress />
        </div>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                color="secondary"
                variant="contained"
                onClick={handlePrev}
                startIcon={<Icon icon="mdi:chevron-left" fontSize={20} />}
              >
                Previous
              </Button>
              <Button color="success" variant="contained" onClick={submit}>
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5">Select Plan</Typography>
        <Typography sx={{ color: "text.secondary" }}>Select plan as per your requirement</Typography>
      </Box>

      <Grid container spacing={5}>
        {data.map((item, index) => (
          <CustomRadioIcons
            key={index}
            data={data[index]}
            selected={selectedRadio}
            name="custom-radios-plan"
            gridProps={{ sm: 4, xs: 12 }}
            handleChange={handleRadioChange}
          />
        ))}


        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              color="secondary"
              variant="contained"
              onClick={handlePrev}
              startIcon={<Icon icon="mdi:chevron-left" fontSize={20} />}
            >
              Previous
            </Button>
            <Button color="success" variant="contained" onClick={submit}>
              Submit
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default StepBillingDetails;
