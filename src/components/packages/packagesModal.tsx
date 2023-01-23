import Box from "@mui/material/Box";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import { Close } from "mdi-material-ui";
import PackageForm from "./packageForm";
import { Package } from "../../types/apps/navashipInterfaces";

interface PackageModalProps {
  open: boolean;
  handleDialogToggle: () => void;
  packageToEdit?: Package; // If value is defined, this means that the modal will be used to edit entry
  fromShipmentWizard?: boolean;
}

const PackageModal = ({
  open,
  handleDialogToggle,
  packageToEdit,
  fromShipmentWizard
}: PackageModalProps) => {
  return (
    <Box>
      <Dialog
        fullWidth
        open={open}
        scroll="body"
        maxWidth="md"
        onClose={handleDialogToggle}
        onBackdropClick={handleDialogToggle}
        key={!packageToEdit ? "create-parcel" : "edit-parcel"}
      >
        <DialogTitle>
          <Box sx={{ textAlign: "center", p: 6 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              {!packageToEdit ? "Create New Parcel" : "Edit Parcel"}
            </Typography>
            <Typography variant="body2">
              {!packageToEdit
                ? "Create a parcel for future use"
                : "Edit existing parcel"}
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
          <PackageForm
            handleDialogToggle={handleDialogToggle}
            packageToEdit={packageToEdit}
            fromShipmentWizard={fromShipmentWizard}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PackageModal;
