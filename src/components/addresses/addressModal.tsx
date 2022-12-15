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

// setCreatedAddress will track if a new address was created
const AddressModal = ({ open, handleDialogToggle, setCreatedAddress }) => {
  return (
    <Box>
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
            Create Address
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
          <AddressForm handleDialogToggle={handleDialogToggle} setCreatedAddress={setCreatedAddress} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AddressModal;
