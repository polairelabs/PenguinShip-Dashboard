import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const FooterContent = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-end"
      }}
    >
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, Made with `}
        <Box component="span" sx={{ color: "error.main" }}>
          ❤️
        </Box>
        {` by `}
        <Link target="_blank" href="https://polairelabs.com">
          Polaire Labs
        </Link>
      </Typography>
    </Box>
  );
};

export default FooterContent;
