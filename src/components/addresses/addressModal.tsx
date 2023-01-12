import Box from "@mui/material/Box";

import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { Close } from "mdi-material-ui";
import AddressForm from "./addressForm";
import { Address } from "../../types/apps/navashipInterfaces";

interface AddressModalProps {
  open: boolean;
  handleDialogToggle: () => void;
  setCreatedAddress?: (value: boolean) => void; // // setCreatedAddress will track if a new address was created in shipmentWizard
  addressToEdit?: Address; // if value is defined, this means that the modal will be used to edit entry
}

const AddressModal = ({ open, handleDialogToggle, setCreatedAddress, addressToEdit }: AddressModalProps) => {
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
            {!addressToEdit ? "Create Address" : "Edit Address"}
          </Typography>
          <Typography variant="body2">
            {!addressToEdit ? "Create a new address" : "Edit existing address"}
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
          <AddressForm
            handleDialogToggle={handleDialogToggle}
            setCreatedAddress={setCreatedAddress}
            addressToEdit={addressToEdit}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AddressModal;
