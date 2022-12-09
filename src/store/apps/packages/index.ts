import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import BaseApi from "../../../api/api";
import { Package } from "../../../types/apps/navashipInterfaces";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchPackages = createAsyncThunk(
  "appPackages/fetchData",
  async (p) => {
    return await BaseApi.get("/packages");
  }
);

export const addPackage = createAsyncThunk(
  "appPackages/addPackage",
  async (
    data: { [key: string]: number | string },
    { getState, dispatch }: Redux
  ) => {
    const response = await BaseApi.post("/packages", data);
    dispatch(fetchPackages());
    return response;
  }
);

export const deletePackage = createAsyncThunk(
  "appPackages/deletePackage",
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await BaseApi.delete(`/packages/${id}`);
    dispatch(fetchPackages());
    return response;
  }
);

export const appPackagesSlice = createSlice({
  name: "appPackages",
  initialState: {
    data: [] as Package[],
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
        state.status = "success";
      })
      .addCase(fetchPackages.rejected, (state) => {
        state.status = "failed";
      });
  }
});

export default appPackagesSlice.reducer;
