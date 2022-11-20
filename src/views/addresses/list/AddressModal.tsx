import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import { Close } from "mdi-material-ui";
import AddressForm from "../../../pages/addresses/add";

const AddressModal = () => {
  const [open, setOpen] = useState<boolean>(false);

  const {
    setValue,
    formState: { errors }
  } = useForm({ defaultValues: { name: "" } });

  const handleDialogToggle = () => {
    setOpen(!open);
    setValue("name", "");
  };

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
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <Button sx={{ mb: 2 }} onClick={handleDialogToggle} variant="contained">
          Add Address
        </Button>
      </Box>
      <Dialog
        fullWidth
        open={open}
        scroll="body"
        maxWidth="md"
        onClose={handleDialogToggle}
        onBackdropClick={handleDialogToggle}
      >
        <DialogTitle sx={{ pt: 12, mx: "auto", textAlign: "center" }}>
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
            pt: { xs: 8, sm: 12.5 },
            pr: { xs: 5, sm: 12 },
            pb: { xs: 5, sm: 9.5 },
            pl: { xs: 4, sm: 11 },
            position: "relative"
          }}
        >
          <AddressForm></AddressForm>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AddressModal;
