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
  packageToEdit?: Package; // if value is defined, this means that the modal will be used to edit entry
}

const PackageModal = ({
  open,
  handleDialogToggle,
  packageToEdit
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
      >
        <DialogTitle sx={{ pt: 12, ml: { xs: "1rem", sm: "2.2rem" } }}>
          <Typography variant="h4" component="span" sx={{ mb: 2 }}>
            {!packageToEdit ? "Create Parcel" : "Edit Parcel"}
          </Typography>
          <Typography variant="body2">
            {!packageToEdit ? "Create a new parcel" : "Edit existing parcel"}
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
          <PackageForm
            handleDialogToggle={handleDialogToggle}
            packageToEdit={packageToEdit}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PackageModal;
