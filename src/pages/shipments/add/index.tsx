import Grid from "@mui/material/Grid";
import CreateShipmentWizard from "../../../views/shipments/list/CreateShipmentWizard";

const ShipmentWizard = () => {
  return (
    <Grid container spacing={6}>
      {/*<Grid item xs={12}>*/}
      {/*  <Typography variant="h6">Create Label</Typography>*/}
      {/*</Grid>*/}
      <Grid item xs={12}>
        <CreateShipmentWizard />
      </Grid>
    </Grid>
  );
};

export default ShipmentWizard;
