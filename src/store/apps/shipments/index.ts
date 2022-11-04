// ** Redux Imports
import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import BaseApi from "../../../api/api";
import { fetchAddresses } from "../addresses";

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
    const response = await BaseApi.post("/shipments", data);
    return response;
  }
);

export const setShipmentRate = createAsyncThunk(
  "setShipmentRate",
  async (
    data: { [key: string]: number | string | undefined },
    { getState, dispatch }: Redux
  ) => {
    console.log("Sending in", data);
    const response = await BaseApi.post("/shipments/buy", data);
    return response;
  }
);

// ** Fetch Packages
export const fetchData = createAsyncThunk(
  "appPackages/fetchData",
  async (p) => {
    const response = await axios.get("http://localhost:8080/apps/packages/");
    return response.data;
  }
);

// ** Add User
export const addPackages = createAsyncThunk(
  "appPackages/addPackage",
  async (
    data: { [key: string]: number | string },
    { getState, dispatch }: Redux
  ) => {
    const response = await axios.post("http://localhost:8080/apps/packages/", {
      data
    });
    dispatch(fetchData());

    return response.data;
  }
);

// ** Delete Packages
export const deletePackages = createAsyncThunk(
  "appPackages/deletePackage",
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete(
      "http://localhost:8080/apps/packages/",
      {
        data: id
      }
    );
    dispatch(fetchData());

    return response.data;
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
      console.log(action);
      console.log(action.payload);
      console.log("Cool", action.payload.rates);
      state.data = action.payload;
      state.rates = action.payload.rates;
      // state.total = action.payload.total;
      // state.params = action.payload.params;
      // state.allData = action.payload.allData;
    });
  }
});

export default shipmentsSlice.reducer;
