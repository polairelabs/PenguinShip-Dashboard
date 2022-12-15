import { Dispatch } from "redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import BaseApi from "../../../api/api";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchPackages = createAsyncThunk(
  "packages/fetchPackages",
  async (p) => {
    return await BaseApi.get("/packages");
  }
);

export const addPackage = createAsyncThunk(
  "packages/addPackage",
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
  "packages/deletePackage",
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await BaseApi.delete(`/packages/${id}`);
    dispatch(fetchPackages());
    return response;
  }
);

export const packagesSlice = createSlice({
  name: "packages",
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    status: "IDLE",
    lastInsertedPackage: {}
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.status = "LOADING";
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "SUCCESS";
      })
      .addCase(fetchPackages.rejected, (state) => {
        state.status = "FAILED";
      })
      .addCase(addPackage.fulfilled, (state, action) => {
        state.lastInsertedPackage = action.payload;
      });
  }
});

export default packagesSlice.reducer;
