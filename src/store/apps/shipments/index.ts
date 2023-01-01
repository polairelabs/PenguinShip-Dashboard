import { Dispatch } from "redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import BaseApi from "../../../api/api";
import { Rate, Shipment } from "../../../types/apps/navashipInterfaces";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const createShipment = createAsyncThunk(
  "shipments/createShipment",
  async (
    data: { [key: string]: number | string | undefined },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      return await BaseApi.post("/shipments", data);
    } catch (error) {
      return rejectWithValue(error);
    }
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
    data: {} as Shipment,
    rates: [] as Rate[],
    total: 1,
    params: {},
    allData: [],
    createShipmentStatus: "",
    buyShipmentRateStatus: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createShipment.fulfilled, (state, action) => {
        state.data = action.payload;
        state.rates = action.payload?.rates;
        state.rates = action.payload?.rates?.sort((r1: Rate, r2: Rate) => r1?.rate - r2.rate);
        state.createShipmentStatus = "CREATED";
        // state.total = action.payload.total;
        // state.params = action.payload.params;
        // state.allData = action.payload.allData;
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.data.id = "";
        state.rates = [];
        state.createShipmentStatus = "FAILED";
      })
      .addCase(buyShipmentRate.fulfilled, (state, action) => {
        state.buyShipmentRateStatus = "CREATED";
      })
      .addCase(buyShipmentRate.rejected, (state, action) => {
        state.buyShipmentRateStatus = "FAILED";
      });
  }
});

export default shipmentsSlice.reducer;
