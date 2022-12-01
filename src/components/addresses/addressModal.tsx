import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import { Close } from "mdi-material-ui";
import AddressForm from "./addressForm";

const AddressModal = ({ open, handleDialogToggle }) => {
  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <Dialog
        fullWidth
        open={open}
        scroll="body"
        maxWidth="md"
        onClose={handleDialogToggle}
        onBackdropClick={handleDialogToggle}
      >
        <DialogTitle sx={{ pt: 12, ml: { xs: "1rem", sm: "2.2rem" } }}>
          <Typography variant="h4" component="span" sx={{ mb: 2 }}>
            ADD NEW ADDRESS
          </Typography>
          <Typography variant="body2">
            This is an autocomplete form to save an address for future use.
          </Typography>
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
            pt: { xs: 4, sm: 8 },
            pr: { xs: 4, sm: 8 },
            pb: { xs: 4, sm: 8 },
            pl: { xs: 4, sm: 8 },
            position: "relative"
          }}
        >
          <AddressForm handleDialogToggle={handleDialogToggle} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AddressModal;
