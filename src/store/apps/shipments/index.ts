import { Dispatch } from "redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import BaseApi, { ApiError } from "../../../api/api";
import {
  CreatedShipment,
  Rate,
  Shipment
} from "../../../types/apps/navashipInterfaces";
import { Status } from "../../index";

export const fetchShipments = createAsyncThunk(
  "shipments/fetchShipments",
  async (params?: { [key: string]: number | string }) => {
    return await BaseApi.get("/shipments", params);
  }
);

export const createShipment = createAsyncThunk(
  "shipments/createShipment",
  async (
    data: { [key: string]: number | string | undefined },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      return await BaseApi.post("/shipments", data);
    } catch (error) {
      let apiError = error as ApiError;
      return rejectWithValue(apiError.messages?.[0] ?? "Server error");
    }
  }
);

export const buyShipmentRate = createAsyncThunk(
  "shipments/setShipmentRate",
  async (
    data: { [key: string]: number | string | undefined },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      return await BaseApi.post("/shipments/buy", data);
    } catch (error) {
      let apiError = error as ApiError;
      return rejectWithValue(apiError.messages?.[0] ?? "Server error");
    }
  }
);

export const shipmentsSlice = createSlice({
  name: "shipments",
  initialState: {
    // createdShipment is used to retrieve the rates of the shipment (+ its easypost id)
    createdShipment: {} as CreatedShipment,
    createdShipmentRates: [] as Rate[],
    allShipments: [] as Shipment[],
    total: 0,
    createShipmentStatus: "" as Status,
    buyShipmentRateStatus: "" as Status,
    createShipmentError: "",
    buyShipmentError: "",
    // Offset and size to be used for pagination in all fetchAll calls inside the store
    offset: 1,
    size: 100
  },
  reducers: {
    clearCreateShipmentStatus: (state) => {
      state.createShipmentStatus = "";
    },
    clearBuyShipmentRateStatus: (state) => {
      state.buyShipmentRateStatus = "";
    },
    clearCreateShipmentError: (state) => {
      state.createShipmentError = "";
    },
    clearBuyShipmentError: (state) => {
      state.buyShipmentError = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createShipment.fulfilled, (state, action) => {
        state.createdShipment = action.payload;
        state.createdShipmentRates = action.payload?.rates?.sort(
          (r1: Rate, r2: Rate) => r1?.rate - r2.rate
        );
        state.createShipmentStatus = "SUCCESS";
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.createdShipment.id = "";
        state.createdShipmentRates = [];
        state.createShipmentStatus = "ERROR";
        state.createShipmentError = action.payload as string;
      })
      .addCase(buyShipmentRate.fulfilled, (state, action) => {
        state.buyShipmentRateStatus = "SUCCESS";
      })
      .addCase(buyShipmentRate.rejected, (state, action) => {
        state.buyShipmentRateStatus = "ERROR";
        state.buyShipmentError = action.payload as string;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.allShipments = action.payload.data;
        state.total = action.payload.totalCount;
      });
  }
});

export const {
  clearCreateShipmentStatus,
  clearBuyShipmentRateStatus,
  clearCreateShipmentError,
  clearBuyShipmentError
} = shipmentsSlice.actions;
export default shipmentsSlice.reducer;
