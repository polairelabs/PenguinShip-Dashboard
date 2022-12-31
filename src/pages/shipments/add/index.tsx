// ** MUI Imports
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CreateShipmentWizard from "../../../views/shipments/list/CreateShipmentWizard";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { useEffect, useState } from "react";
import { fetchAddresses } from "../../../store/apps/addresses";
import BaseApi from "../../../api/api";

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
