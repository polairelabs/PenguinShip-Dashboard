import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BaseApi from "../../../api/api";
import { fetchPackages } from "../packages";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAddresses = createAsyncThunk(
  "appAddresses/fetchData",
  async (p) => {
    return await BaseApi.get("/addresses");
  }
);

export const addAddress = createAsyncThunk(
  "appAddresses/addAddress",
  async (
    data: { [key: string]: number | string },
    { getState, dispatch }: Redux
  ) => {
    const response = await BaseApi.post("/addresses", data);
    dispatch(fetchAddresses());
    return response;
  }
);

export const deleteAddress = createAsyncThunk(
  "appAddresses/deleteAddress",
  async (id: number | string, { getState, dispatch }: Redux) => {
    // Todo implement
  }
);

export const addressSlice = createSlice({
  name: "appAddresses",
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    status: "idle"
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.data = action.payload;
        // state.total = action.payload.total;
        // state.params = action.payload.params;
        // state.allData = action.payload.allData;
        state.status = "success";
      })
      .addCase(fetchAddresses.rejected, (state) => {
        state.status = "failed";
      });
  }
});

export default addressSlice.reducer;
