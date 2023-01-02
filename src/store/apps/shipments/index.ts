import { Dispatch } from "redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import BaseApi from "../../../api/api";
import { CreatedShipment, Rate, Shipment } from "../../../types/apps/navashipInterfaces";

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

export const fetchShipments = createAsyncThunk(
  "shipments/fetchShipments",
  async () => {
    return await BaseApi.get("/shipments");
  }
);

export const shipmentsSlice = createSlice({
  name: "shipments",
  initialState: {
    // createdShipment is to retrieve the array of rates of th shipment + its easypost id
    createdShipment: {} as CreatedShipment,
    createdShipmentRates: [] as Rate[],
    allShipments: [] as Shipment[],
    createShipmentStatus: "",
    buyShipmentRateStatus: ""
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createShipment.fulfilled, (state, action) => {
        state.createdShipment = action.payload;
        state.createdShipmentRates = action.payload?.rates?.sort((r1: Rate, r2: Rate) => r1?.rate - r2.rate);
        state.createShipmentStatus = "CREATED";
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.createdShipment.id = "";
        state.createdShipmentRates = [];
        state.createShipmentStatus = "FAILED";
      })
      .addCase(buyShipmentRate.fulfilled, (state, action) => {
        state.buyShipmentRateStatus = "CREATED";
      })
      .addCase(buyShipmentRate.rejected, (state, action) => {
        state.buyShipmentRateStatus = "FAILED";
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.allShipments = action.payload;
      });
  }
});

export default shipmentsSlice.reducer;
