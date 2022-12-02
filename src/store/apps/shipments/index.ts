import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import BaseApi from "../../../api/api";

interface DataParams {
  weight: number;
  length: number;
  width: number;
  height: number;
}

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const createShipment = createAsyncThunk(
  "createShipment",
  async (
    data: { [key: string]: number | string | undefined },
    { getState, dispatch }: Redux
  ) => {
    console.log("Sending in", data);
    return await BaseApi.post("/shipments", data);
  }
);

export const setShipmentRate = createAsyncThunk(
  "setShipmentRate",
  async (
    data: { [key: string]: number | string | undefined },
    { getState, dispatch }: Redux
  ) => {
    console.log("Sending in", data);
    return await BaseApi.post("/shipments/buy", data);
  }
);

export const shipmentsSlice = createSlice({
  name: "shipments",
  initialState: {
    data: {},
    rates: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createShipment.fulfilled, (state, action) => {
      // console.log(action);
      // console.log(action.payload);
      // console.log("Cool", action.payload.rates);
      state.data = action.payload;
      state.rates = action.payload.rates;
      // state.total = action.payload.total;
      // state.params = action.payload.params;
      // state.allData = action.payload.allData;
    });
  }
});

export default shipmentsSlice.reducer;
