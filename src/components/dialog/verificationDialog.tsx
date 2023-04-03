import { useState } from "react";
import { Button, Modal, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";

interface Props {
  open: boolean;
  onClose: () => void;
  onValidate: (token: string) => void;
}

const VerificationDialog = ({ open, onClose, onValidate }: Props) => {
  const [token, setToken] = useState("");

  return (
    <Modal
      open={open}
      onClose={onClose}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "4px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <TextField
          label="Verification Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ marginBottom: "1rem" }}
        />
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button size="large" variant="outlined" color="secondary" disabled>
            Back
          </Button>
          <Button size="large" type="submit" variant="contained">
            Next
          </Button>
        </Grid>
      </div>
    </Modal>
  );
};

export default VerificationDialog;
