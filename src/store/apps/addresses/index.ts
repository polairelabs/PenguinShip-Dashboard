import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BaseApi from "../../../api/api";
import {fetchData} from "../packages";

interface Address {
  // weight: number;
  // length: number;
  // width: number;
  // height: number;
}

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;


}

// ** Fetch Addresses
export const fetchAddresses = createAsyncThunk(
  "appAddress/fetchData",
  async (p) => {
    const response = await BaseApi.get("/addresses");
    return response;
  }
);

// ** Add Address
export const addAddress = createAsyncThunk(
  "appAddress/addAddress",
  async (
    data: { [key: string]: number | string },
    { getState, dispatch }: Redux
  ) => {
    const response = await BaseApi.post("/addresses", data);
      dispatch(fetchAddresses());
    return response;
  }
);

// ** Delete Address
export const deleteAddress = createAsyncThunk(
  "appPackages/deleteAddress",
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete(
      "http://localhost:8080/apps/packages/",
      {
        data: id
      }
    );
    dispatch(fetchAddresses());

    return response.data;
  }
);

export const addressSlice = createSlice({
  name: "addresses",
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
      status: "idle"
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state) => {
        state.status = "loading";
    })
        .addCase(fetchAddresses.fulfilled, (state, action) => {
      state.data = action.payload;
      // state.total = action.payload.total;
      // state.params = action.payload.params;
      // state.allData = action.payload.allData;
        state.status = "idle";
    })
        .addCase(fetchData.rejected, (state) => {
        state.status = "failed";
    });
  }
});

export default addressSlice.reducer;
