import Grid from "@mui/material/Grid";
import { FormControlLabel, InputAdornment, Switch } from "@mui/material";
import TextField from "@mui/material/TextField";
import { ChangeEvent, useEffect, useState } from "react";
import { Package, ShipmentInsurance } from "../../types/apps/NavashipTypes";

interface InsuranceFieldProps {
  setAmountToInsure: (value: string) => void;
  setInsured: (value: boolean) => void;
  amountToInsure: string | undefined;
  insured: boolean;
}

const InsuranceField = ({
  setAmountToInsure,
  setInsured,
  amountToInsure,
  insured
}: InsuranceFieldProps) => {
  return (
    <Grid item>
      <FormControlLabel
        label="Insure Parcel"
        control={
          <Switch
            checked={insured}
            onChange={(e) => setInsured(e.target.checked)}
          />
        }
      />
      <TextField
        autoFocus
        sx={{ width: 200 }}
        onChange={(e) => setAmountToInsure(e.target.value)}
        value={amountToInsure}
        label="Amount to insure"
        InputLabelProps={{ shrink: true }}
        InputProps={{
          startAdornment: <InputAdornment position="start">US$</InputAdornment>
        }}
      />
    </Grid>
  );
};

export default InsuranceField;
