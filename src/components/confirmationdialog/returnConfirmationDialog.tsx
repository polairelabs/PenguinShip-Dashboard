import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { Shipment, ShipmentAddressType } from "../../types/apps/NavashipTypes";
import { Typography } from "@mui/material";

interface ReturnConfirmationDialogProps {
  open: boolean;
  handleDialogToggle: () => void;
  shipment: Shipment | undefined;
  title: string;
  description?: string;
  confirmButtonLabel?: string;
  confirmButtonCallback: Function;
  hideCancelButton?: boolean;
  cancelButtonLabel?: string;
}

const ReturnConfirmationDialog = ({
  open,
  handleDialogToggle,
  shipment,
  title,
  description,
  confirmButtonLabel,
  confirmButtonCallback,
  hideCancelButton,
  cancelButtonLabel
}: ReturnConfirmationDialogProps) => {
  return (
    <Box>
      <Dialog fullWidth={true} open={open} onClose={handleDialogToggle}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{description ?? ""}</DialogContentText>
          <Typography variant={"body2"}>
            {`Label is currently being ${shipment?.easyPostStatus}`}
          </Typography>
        </DialogContent>
        <DialogActions>
          {!hideCancelButton && (
            <Button onClick={handleDialogToggle}>
              {cancelButtonLabel ?? "Cancel"}
            </Button>
          )}
          <Button
            onClick={() => {
              confirmButtonCallback();
            }}
          >
            {confirmButtonLabel ?? "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReturnConfirmationDialog;
