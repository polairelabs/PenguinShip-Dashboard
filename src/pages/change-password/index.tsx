// ** React Imports
import {
  MouseEvent,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useRef,
  useState
} from "react";

// ** Next Imports
import Link from "next/link";

// ** MUI Components
import Button from "@mui/material/Button";
import Box, { BoxProps } from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";

// ** Icons Imports
import ChevronLeft from "mdi-material-ui/ChevronLeft";

// ** Configs
import themeConfig from "src/configs/themeConfig";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Hooks
import { useSettings } from "src/@core/hooks/useSettings";

// ** Demo Imports
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import { changePassword, clearChangePasswordStatus } from "../../store/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { toast } from "react-hot-toast";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Controller, useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Icon from "../../@core/components/icon";
import { FormHelperText } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { PasswordReset } from "../../types/apps/NavashipTypes";
import { PasswordFieldsVisibility } from "../../views/pages/auth/register-multi-steps/StepAccountDetails";
import { useRouter } from "next/router";
import * as yup from "yup";

// Styled Components
const ForgotPasswordIllustrationWrapper = styled(Box)<BoxProps>(
  ({ theme }) => ({
    padding: theme.spacing(20),
    paddingRight: "0 !important",
    [theme.breakpoints.down("lg")]: {
      padding: theme.spacing(10)
    }
  })
);

const ForgotPasswordIllustration = styled("img")(({ theme }) => ({
  maxWidth: "53.125rem",
  [theme.breakpoints.down("lg")]: {
    maxWidth: "35rem"
  }
}));

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("md")]: {
    maxWidth: 450
  }
}));

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down("xl")]: {
    width: "100%"
  },
  [theme.breakpoints.down("md")]: {
    maxWidth: 400
  }
}));

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down("md")]: { mt: theme.spacing(8) }
}));

const LinkStyled = styled("a")(({ theme }) => ({
  display: "flex",
  fontSize: "0.875rem",
  alignItems: "center",
  textDecoration: "none",
  justifyContent: "center",
  color: theme.palette.primary.main
}));

const schema = yup.object().shape({
  token: yup.string().required(),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password can a have a maximum of 128 characters")
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
});

const ChangePassword = () => {
  const theme = useTheme();
  const router = useRouter();
  const { settings } = useSettings();

  const { skin } = settings;
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const [formData, setFormData] = useState<PasswordReset>({
    token: "",
    password: "",
    confirmPassword: ""
  });
  const [values, setValues] = useState<PasswordFieldsVisibility>({
    showPassword: false,
    showConfirmPassword: false
  });

  const dispatch = useDispatch<AppDispatch>();

  const defaultValues = {
    password: "",
    confirmPassword: ""
  };

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: async (data, context, options) => {
      // @ts-ignore
      return yupResolver(schema)(formData, context, options);
    }
  });

  const changePasswordStatus = useSelector(
    (state: RootState) => state.auth.changePasswordStatus
  );

  useEffect(() => {
    const { query } = router;
    if (query.token) {
      setFormData({ ...formData, token: query.token as string });
    } else {
      router.push("/login");
    }
  }, [router.query]);

  useEffect(() => {
    if (changePasswordStatus === "SUCCESS") {
      toast.success("Password updated successfully", {
        position: "top-center"
      });
      router.push("/login");
    } else if (changePasswordStatus === "ERROR") {
      toast.error("Expired password reset link. Please request a new one", {
        position: "top-center"
      });
    }
    dispatch(clearChangePasswordStatus());
  }, [changePasswordStatus]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  const onSubmit = async () => {
    await dispatch(changePassword({ ...formData }));
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
  };

  const handleMouseDownConfirmPassword = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const imageSource =
    skin === "bordered"
      ? "auth-v2-forgot-password-illustration-bordered"
      : "auth-v2-forgot-password-illustration";

  return (
    <Box className="content-right">
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            position: "relative",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ForgotPasswordIllustrationWrapper>
            <ForgotPasswordIllustration
              alt="forgot-password-illustration"
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </ForgotPasswordIllustrationWrapper>
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper
        sx={
          skin === "bordered" && !hidden
            ? { borderLeft: `1px solid ${theme.palette.divider}` }
            : {}
        }
      >
        <Box
          sx={{
            p: 12,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.paper"
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: "flex",
                position: "absolute",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <svg
                width={35}
                height={29}
                version="1.1"
                viewBox="0 0 30 23"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g
                    id="Artboard"
                    transform="translate(-95.000000, -51.000000)"
                  >
                    <g id="logo" transform="translate(95.000000, 50.000000)">
                      <path
                        id="Combined-Shape"
                        fill={theme.palette.primary.main}
                        d="M30,21.3918362 C30,21.7535219 29.9019196,22.1084381 29.7162004,22.4188007 C29.1490236,23.366632 27.9208668,23.6752135 26.9730355,23.1080366 L26.9730355,23.1080366 L23.714971,21.1584295 C23.1114106,20.7972624 22.7419355,20.1455972 22.7419355,19.4422291 L22.7419355,19.4422291 L22.741,12.7425689 L15,17.1774194 L7.258,12.7425689 L7.25806452,19.4422291 C7.25806452,20.1455972 6.88858935,20.7972624 6.28502902,21.1584295 L3.0269645,23.1080366 C2.07913318,23.6752135 0.850976404,23.366632 0.283799571,22.4188007 C0.0980803893,22.1084381 2.0190442e-15,21.7535219 0,21.3918362 L0,3.58469444 L0.00548573643,3.43543209 L0.00548573643,3.43543209 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 L15,9.19354839 L26.9548759,1.86636639 C27.2693965,1.67359571 27.6311047,1.5715689 28,1.5715689 C29.1045695,1.5715689 30,2.4669994 30,3.5715689 L30,3.5715689 Z"
                      />
                      <polygon
                        id="Rectangle"
                        opacity="0.077704"
                        fill={theme.palette.common.black}
                        points="0 8.58870968 7.25806452 12.7505183 7.25806452 16.8305646"
                      />
                      <polygon
                        id="Rectangle"
                        opacity="0.077704"
                        fill={theme.palette.common.black}
                        points="0 8.58870968 7.25806452 12.6445567 7.25806452 15.1370162"
                      />
                      <polygon
                        id="Rectangle"
                        opacity="0.077704"
                        fill={theme.palette.common.black}
                        points="22.7419355 8.58870968 30 12.7417372 30 16.9537453"
                        transform="translate(26.370968, 12.771227) scale(-1, 1) translate(-26.370968, -12.771227) "
                      />
                      <polygon
                        id="Rectangle"
                        opacity="0.077704"
                        fill={theme.palette.common.black}
                        points="22.7419355 8.58870968 30 12.6409734 30 15.2601969"
                        transform="translate(26.370968, 11.924453) scale(-1, 1) translate(-26.370968, -11.924453) "
                      />
                      <path
                        id="Rectangle"
                        fillOpacity="0.15"
                        fill={theme.palette.common.white}
                        d="M3.04512412,1.86636639 L15,9.19354839 L15,9.19354839 L15,17.1774194 L0,8.58649679 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 Z"
                      />
                      <path
                        id="Rectangle"
                        fillOpacity="0.35"
                        fill={theme.palette.common.white}
                        transform="translate(22.500000, 8.588710) scale(-1, 1) translate(-22.500000, -8.588710) "
                        d="M18.0451241,1.86636639 L30,9.19354839 L30,9.19354839 L30,17.1774194 L15,8.58649679 L15,3.5715689 C15,2.4669994 15.8954305,1.5715689 17,1.5715689 C17.3688953,1.5715689 17.7306035,1.67359571 18.0451241,1.86636639 Z"
                      />
                    </g>
                  </g>
                </g>
              </svg>
              <Typography
                variant="h6"
                sx={{
                  ml: 3,
                  lineHeight: 1,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: "1.5rem !important"
                }}
              >
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant="h5">
                Change your password 🔒
              </TypographyStyled>
            </Box>
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor="input-password">Password</InputLabel>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      name="password"
                      label="Password"
                      value={formData.password}
                      onChange={handleChange}
                      id="input-password"
                      type={values.showPassword ? "text" : "password"}
                      error={Boolean(errors.password)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            <Icon
                              icon={
                                values.showPassword
                                  ? "mdi:eye-outline"
                                  : "mdi:eye-off-outline"
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor="input-confirm-password">
                  Confirm Password
                </InputLabel>
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      label="Confirm Password"
                      id="input-confirm-password"
                      type={values.showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      name="confirmPassword"
                      error={Boolean(errors.confirmPassword)}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownConfirmPassword}
                          >
                            <Icon
                              icon={
                                values.showConfirmPassword
                                  ? "mdi:eye-outline"
                                  : "mdi:eye-off-outline"
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.confirmPassword.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ mb: 5.25 }}
              >
                Change Password
              </Button>
              <Typography
                variant="body2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Link passHref href="/login">
                  <LinkStyled>
                    <ChevronLeft />
                    <span>Back to login</span>
                  </LinkStyled>
                </Link>
              </Typography>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  );
};

ChangePassword.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
);

ChangePassword.guestGuard = true;

export default ChangePassword;
