import { useState, ChangeEvent } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CardContent from "@mui/material/CardContent";
import AddressAutoCompleteField from "../fields/addressAutoCompleteField";
import { addAddress } from "../../store/apps/addresses";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormHelperText from "@mui/material/FormHelperText";
import { InputAdornment, Typography } from "@mui/material";
import { addPackage } from "../../store/apps/packages";
import { toast } from "react-hot-toast";

export type PackageDetails = {
  name: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  monetaryValue: string;
};

const PackageForm = ({ handleDialogToggle }) => {
  const [packageDetails, setPackageDetails] = useState<PackageDetails>({
    name: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    monetaryValue: ""
  });

  const defaultValues: PackageDetails = {
    name: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    monetaryValue: ""
  };

  yup.setLocale({
    mixed: {
      required: "Required field"
    }
  });

  const numberValidation = () => {
    return yup
      .string()
      .optional()
      .matches(
        /^[\d]*\.?[\d]*$/,
        "Incorrect format. Must be an integer or a decimal"
      )
      .max(6, "Must be less than or equal to 6 digits");
  };

  const schema = yup.object().shape(
    {
      name: yup.string().required(),
      weight: numberValidation().required(),
      monetaryValue: numberValidation().required(),
      length: numberValidation()
        .ensure()
        .when(["width", "height"], {
          is: (width, height) => width !== "" || height !== "",
          then: (SettingsSchema) =>
            SettingsSchema.required("Length is required")
        }),
      width: numberValidation()
        .ensure()
        .when(["length", "height"], {
          is: (length, height) => length !== "" || height !== "",
          then: (SettingsSchema) => SettingsSchema.required("Width is required")
        }),
      height: numberValidation()
        .ensure()
        .when(["width", "length"], {
          is: (width, length) => width !== "" || length !== "",
          then: (SettingsSchema) =>
            SettingsSchema.required("Height is required")
        })
    },
    [
      ["width", "height"],
      ["length", "height"],
      ["width", "length"]
    ]
  );

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: async (data, context, options) => {
      // @ts-ignore
      return yupResolver(schema)(packageDetails, context, options);
    }
  });

  const dispatch = useDispatch<AppDispatch>();

  const handleData = (data: PackageDetails) => {
    const packageDetailsToSend = JSON.parse(JSON.stringify(data));
    packageDetailsToSend.value = packageDetailsToSend.monetaryValue;
    delete packageDetailsToSend.monetaryValue;
    dispatch(addPackage({ ...packageDetailsToSend }));
    toast.success("Package was successfully added", {
      position: "top-center"
    });
    handleDialogToggle();
  };

  const handlePackageValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const addressDetailName = event.target.name;
    const addressDetailValue = event.target.value;

    const newAddressDetailValue = {};
    newAddressDetailValue[addressDetailName] = addressDetailValue;

    const newAddressDetails = { ...packageDetails, ...newAddressDetailValue };
    setPackageDetails(newAddressDetails);
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(handleData)}>
          <Grid container spacing={5}>
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    1. Package Details
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        name="name"
                        value={packageDetails.name}
                        onChange={handlePackageValueChange}
                        label="Name"
                        error={Boolean(errors.name)}
                      />
                    )}
                  />
                  {errors.name && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.name.message}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="monetaryValue"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        name="monetaryValue"
                        label="Value"
                        onChange={handlePackageValueChange}
                        value={packageDetails.monetaryValue}
                        error={Boolean(errors.monetaryValue)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                  {errors.monetaryValue && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="validation-schema-first-name"
                    >
                      {errors.monetaryValue.message}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="weight"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        name="weight"
                        label="Weight"
                        onChange={handlePackageValueChange}
                        value={packageDetails.weight}
                        error={Boolean(errors.weight)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">oz</InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                  {errors.weight && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="validation-schema-first-name"
                    >
                      {errors.weight.message}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            </CardContent>
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    2. Package Dimensions
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Controller
                    name="length"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        name="length"
                        label="Length"
                        onChange={handlePackageValueChange}
                        value={packageDetails.length}
                        error={Boolean(errors.length)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">in</InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                  {errors.length && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="validation-schema-first-name"
                    >
                      {errors.length.message}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Controller
                    name="width"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label="Width"
                        name="width"
                        onChange={handlePackageValueChange}
                        value={packageDetails.width}
                        error={Boolean(errors.width)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">in</InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                  {errors.width && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="validation-schema-first-name"
                    >
                      {errors.width.message}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="height"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        name="height"
                        label="Height"
                        onChange={handlePackageValueChange}
                        value={packageDetails.height}
                        error={Boolean(errors.height)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">in</InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                  {errors.height && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="validation-schema-first-name"
                    >
                      {errors.height.message}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            </CardContent>
            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 5,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Button type="submit" variant="contained" size="large">
                  Add package
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default PackageForm;
