import Box from "@mui/material/Box";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import { Close } from "mdi-material-ui";
import AddressForm from "./addressForm";
import { Address } from "../../types/apps/navashipInterfaces";

interface AddressModalProps {
  open: boolean;
  handleDialogToggle: () => void;
  addressToEdit?: Address; // If value is defined, this means that the modal will be used to edit entry
  fromShipmentWizard?: boolean; // Indicates if the instance of the current modal was opened from shipmentWizard
}

const AddressModal = ({
  open,
  handleDialogToggle,
  fromShipmentWizard,
  addressToEdit
}: AddressModalProps) => {
  return (
    <Box>
      <Dialog
        fullWidth
        open={open}
        scroll="body"
        maxWidth="md"
        onClose={handleDialogToggle}
        onBackdropClick={handleDialogToggle}
        key={!addressToEdit ? "create-address" : "edit-address"}
      >
        <DialogTitle>
          <Box sx={{ textAlign: "center", p: 6 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              {!addressToEdit ? "Create New Address" : "Edit Address"}
            </Typography>
            <Typography variant="body2">
              {!addressToEdit
                ? "Create an address for future use"
                : "Edit existing address"}
            </Typography>
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
          <AddressForm
            handleDialogToggle={handleDialogToggle}
            addressToEdit={addressToEdit}
            fromShipmentWizard={fromShipmentWizard}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AddressModal;
