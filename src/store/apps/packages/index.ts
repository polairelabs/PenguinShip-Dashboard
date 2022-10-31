// ** Redux Imports
import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";

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

// ** Fetch Packages
export const fetchPackages = createAsyncThunk(
  "appPackages/fetchData",
  async (p) => {
    const response = await BaseApi.get("/packages");
    return response.data;
  }
);

// ** Add Packages
export const addPackage = createAsyncThunk(
  "appPackages/addPackage",
  async (
    data: { [key: string]: number | string },
    { getState, dispatch }: Redux
  ) => {
    const response = await BaseApi.post("/packages", data);
    dispatch(fetchPackages());
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
    dispatch(fetchPackages());

    return response.data;
  }
);

export const appPackagesSlice = createSlice({
  name: "appPackages",
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
      .addCase(fetchPackages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.data = action.payload;
        // state.total = action.payload.total
        // state.params = action.payload.params
        // state.allData = action.payload.allData
        state.status = "idle";
      })
      .addCase(fetchPackages.rejected, (state) => {
        state.status = "failed";
      });
  }
});

export default appPackagesSlice.reducer;
