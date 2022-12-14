import { Dispatch } from "redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import BaseApi from "../../../api/api";
import { Rate } from "../../../types/apps/navashipInterfaces";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const createShipment = createAsyncThunk(
  "shipments/createShipment",
  async (
    data: { [key: string]: number | string | undefined },
    { getState, dispatch }: Redux
  ) => {
    console.log("A.A Creating this shipment", data);
    const res = await BaseApi.post("/shipments", data);
    console.log("res", res);
    return res;
  }
);

export const buyShipmentRate = createAsyncThunk(
  "shipments/setShipmentRate",
  async (
    data: { [key: string]: number | string | undefined },
    { getState, dispatch }: Redux
  ) => {
    return await BaseApi.post("/shipments/buy", data);
  }
);

export const shipmentsSlice = createSlice({
  name: "shipments",
  initialState: {
    data: {},
    rates: [] as Rate[],
    total: 1,
    params: {},
    allData: [],
    createShipmentStatus: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createShipment.fulfilled, (state, action) => {
        state.data = action.payload;
        state.rates = action.payload.rates;
        state.rates = action.payload.rates.sort((r1: Rate, r2: Rate) => r1?.rate - r2.rate);
        state.createShipmentStatus = "CREATED";
        console.log(state.createShipmentStatus);
        // state.total = action.payload.total;
        // state.params = action.payload.params;
        // state.allData = action.payload.allData;
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.data = {};
        state.rates = [];
        state.createShipmentStatus = "FAILED";
        console.log(state.createShipmentStatus);
      })
      .addCase(buyShipmentRate.rejected, (state, action) => {
        console.log("REJECTED BUY!!");
      });
  }
});

export default shipmentsSlice.reducer;
