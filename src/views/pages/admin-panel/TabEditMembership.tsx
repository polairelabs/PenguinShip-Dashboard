import { ChangeEvent, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from "@mui/material";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MembershipSelect from "../../../components/memberships/membershipSelect";
import { Membership } from "../../../types/apps/NavashipTypes";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Close } from "mdi-material-ui";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  clearUpdateMembershipStatus,
  fetchStripePriceIds,
  updateMembership
} from "../../../store/auth";
import { toast } from "react-hot-toast";

const defaultValues = {
  stripePriceId: "",
  name: "",
  description: "",
  maxLimit: "",
  handlingFeePercentage: ""
};

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return "";
  }
};

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, (obj) => showErrors("Name", obj.value.length, obj.min))
    .required("Name is required"),
  description: yup
    .string()
    .min(6, (obj) => showErrors("Description", obj.value.length, obj.min))
    .required("Description is required"),
  maxLimit: yup
    .number()
    .typeError("Max Limit must be an integer")
    .min(1, "Max limit must be at least 1")
    .max(100000, "Max Limit must be less than or equal to 100000")
    .integer("Max Limit must be an integer")
    .required("Max Limit is required"),
  handlingFeePercentage: yup
    .number()
    .typeError("Handling fee percentage must be a number")
    .min(0.1, "Handling Fee Percentage must be greater than or equal to 0.")
    .max(100, "Percentage must be less than or equal to 100.")
    .required("Percentage is required.")
});

type MembershipDetails = {
  stripePriceId?: string;
  name?: string;
  description?: string;
  maxLimit?: number;
  handlingFeePercentage?: number;
};

const TabEditMembership = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMembership, setSelectedMembership] = useState<
    Membership | undefined
  >();
  const [membershipDetails, setMembershipDetails] = useState<MembershipDetails>(
    {}
  );
  const stripePriceIds = useSelector(
    (state: RootState) => state.auth.stripePriceIds
  );
  const updateMembershipStatus = useSelector(
    (state: RootState) => state.auth.updateMembershipStatus
  );

  const dispatch = useDispatch<AppDispatch>();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues,
    mode: "onChange",
    resolver: async (data, context, options) => {
      // @ts-ignore
      return yupResolver(schema)(membershipDetails, context, options);
    }
  });

  const onSubmitMembership = () => {
    dispatch(
      updateMembership({
        id: selectedMembership?.id ?? "",
        ...membershipDetails
      })
    );
  };

  const onEdit = () => {
    if (selectedMembership) {
      handleDialogToggle();
    }
  };

  const handleDialogToggle = () => {
    setOpen(!open);
  };

  const handleMembershipValueChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const membershipDetailName = event.target.name;
    const membershipDetailValue = event.target.value;

    const newMembershipDetailValue = {};
    newMembershipDetailValue[membershipDetailName] = membershipDetailValue;

    const newMembershipDetails = {
      ...membershipDetails,
      ...newMembershipDetailValue
    };
    setMembershipDetails(newMembershipDetails);
  };

  const handleStripePriceIdChange = (event: SelectChangeEvent<string>) => {
    setMembershipDetails({
      ...membershipDetails,
      stripePriceId: event.target.value
    });
  };

  useEffect(() => {
    dispatch(fetchStripePriceIds());
  }, []);

  useEffect(() => {
    setMembershipDetails({
      stripePriceId: selectedMembership?.stripePriceId,
      name: selectedMembership?.name,
      description: selectedMembership?.description,
      maxLimit: selectedMembership?.maxLimit,
      handlingFeePercentage:
        (selectedMembership?.shipmentHandlingFee ?? 0) * 100
    });
  }, [selectedMembership]);

  // Update toast message
  useEffect(() => {
    if (updateMembershipStatus === "SUCCESS") {
      toast.success("Membership was successfully updated", {
        position: "top-center"
      });
      handleDialogToggle();
    } else if (updateMembershipStatus === "ERROR") {
      toast.error("Error updating membership", {
        position: "top-center"
      });
    }
    dispatch(clearUpdateMembershipStatus());
  }, [updateMembershipStatus]);

  return (
    <Grid container>
      <Grid sm={8} item>
        <Typography variant="body2" mb={4}>
          Select membership to edit
        </Typography>
        <Grid my={4}>
          <MembershipSelect
            setSelectedMembership={setSelectedMembership}
            isAdminEditForm={true}
            handleSubmit={onEdit}
          />
        </Grid>
        <Dialog
          fullWidth
          open={open}
          scroll="body"
          maxWidth="md"
          onClose={handleDialogToggle}
          onBackdropClick={handleDialogToggle}
          key="edit-memberships"
        >
          <DialogTitle>
            <Box sx={{ textAlign: "center", p: 6 }}>
              <Typography variant="h5">Edit membership</Typography>
            </Box>
            <IconButton
              size="small"
              onClick={handleDialogToggle}
              sx={{ position: "absolute", right: "1rem", top: "1rem" }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              pb: 8,
              px: { xs: 8, sm: 15 },
              pt: { xs: 8, sm: 12.5 },
              position: "relative"
            }}
          >
            <CardContent>
              <form
                key={selectedMembership?.name}
                onSubmit={handleSubmit(onSubmitMembership)}
              >
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="validation-stripePriceId"
                        error={Boolean(errors.stripePriceId)}
                        htmlFor="validation-stripePriceId"
                      >
                        Stripe Price Id
                      </InputLabel>
                      <Controller
                        name="stripePriceId"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <Select
                            value={membershipDetails.stripePriceId}
                            label="Stripe Price Id"
                            onChange={handleStripePriceIdChange}
                            error={Boolean(errors.stripePriceId)}
                          >
                            {stripePriceIds.map((stripePriceId) => {
                              return (
                                <MenuItem
                                  key={stripePriceId}
                                  value={stripePriceId}
                                >
                                  {stripePriceId}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      {errors.stripePriceId && (
                        <FormHelperText
                          sx={{ color: "error.main" }}
                          id="validation-stripePriceId"
                        >
                          This field is required
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={membershipDetails.name}
                            autoComplete="off"
                            name="name"
                            label="Name"
                            onChange={handleMembershipValueChange}
                            error={Boolean(errors.name)}
                          />
                        )}
                      />
                      {errors.name && (
                        <FormHelperText
                          sx={{ color: "error.main" }}
                          id="validation-name"
                        >
                          {errors.name.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name="description"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            rows={1}
                            autoComplete="off"
                            multiline
                            name="description"
                            value={membershipDetails.description}
                            label="Description"
                            onChange={handleMembershipValueChange}
                            error={Boolean(errors.description)}
                          />
                        )}
                      />
                      {errors.description && (
                        <FormHelperText sx={{ color: "error.main" }}>
                          {errors.description.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Controller
                        name="maxLimit"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            type="number"
                            autoComplete="off"
                            value={membershipDetails.maxLimit}
                            label="Max Limit"
                            name="maxLimit"
                            onChange={handleMembershipValueChange}
                            error={Boolean(errors.maxLimit)}
                            aria-describedby="validation-schema-email"
                          />
                        )}
                      />
                      {errors.maxLimit && (
                        <FormHelperText sx={{ color: "error.main" }}>
                          {errors.maxLimit.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Controller
                        name="handlingFeePercentage"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            type="number"
                            autoComplete="off"
                            name="handlingFeePercentage"
                            value={membershipDetails.handlingFeePercentage}
                            label="Shipment Handling Fee"
                            onChange={handleMembershipValueChange}
                            error={Boolean(errors.handlingFeePercentage)}
                            helperText="Additional fee (in %) added on top of rate"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  %
                                </InputAdornment>
                              )
                            }}
                          />
                        )}
                      />
                      {errors.handlingFeePercentage && (
                        <FormHelperText sx={{ color: "error.main" }}>
                          {errors.handlingFeePercentage.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button size="large" type="submit" variant="contained">
                      Update
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default TabEditMembership;
