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

// setCreatedPackage will track if a new package was created
// Create interface here, with optional param for updateEntity, if exists we want to update it and not create one entity
const PackageModal = ({ open, handleDialogToggle, setCreatedPackage }) => {
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
            Create Parcel
          </Typography>
          <Typography variant="body2">
            This is a form used to save a parcel for future use.
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
            setCreatedPackage={setCreatedPackage}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PackageModal;
