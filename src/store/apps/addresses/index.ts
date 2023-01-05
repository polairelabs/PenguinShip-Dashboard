import { Dispatch } from "redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BaseApi from "../../../api/api";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAddresses = createAsyncThunk(
  "addresses/fetchData",
  async (p) => {
    return await BaseApi.get("/addresses");
  }
);

export const addAddress = createAsyncThunk(
  "addresses/addAddress",
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
  "addresses/deleteAddress",
  async (id: number | string, { getState, dispatch }: Redux) => {
    // Todo implement
  }
);

export const addressesSlice = createSlice({
  name: "addresses",
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    status: "IDLE",
    lastInsertedAddress: {}
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.status = "LOADING";
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "SUCCESS";
      })
      .addCase(fetchAddresses.rejected, (state) => {
        state.status = "FAILED";
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.lastInsertedAddress = action.payload;
      });
  }
});

export default addressesSlice.reducer;
