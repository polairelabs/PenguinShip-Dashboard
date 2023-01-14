import Grid from "@mui/material/Grid";
import CreateShipmentWizard from "../../../views/shipments/list/CreateShipmentWizard";

const ShipmentWizard = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CreateShipmentWizard />
      </Grid>
    </Grid>
  );
};

export default ShipmentWizard;
