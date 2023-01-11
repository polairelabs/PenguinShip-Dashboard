import { Dispatch } from "redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import BaseApi from "../../../api/api";
import { shipmentsSlice } from "../shipments";

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
    deleteStatus: "",
    lastInsertedPackage: {}
  },
  reducers: {
    clearDeleteStatus: (state) => {
      state.deleteStatus = "";
    },
  },
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
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.deleteStatus = "SUCCESS";
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.deleteStatus = "ERROR";
      });
  }
});

export const { clearDeleteStatus } =
  packagesSlice.actions;
export default packagesSlice.reducer;
