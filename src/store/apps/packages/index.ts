import { Dispatch } from "redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import BaseApi from "../../../api/api";
import { Status } from "../../index";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchPackages = createAsyncThunk(
  "packages/fetchPackages",
  async (params?: { [key: string]: number | string }) => {
    return await BaseApi.get("/packages", params);
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

export const updatePackage = createAsyncThunk(
  "packages/updatePackage",
  async (
    data: { [key: string]: number | string },
    { getState, dispatch }: Redux
  ) => {
    const response = await BaseApi.put(`/packages/${data.id}`, data);
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
    total: 0,
    fetchDataStatus: "" as Status,
    createStatus: "" as Status,
    updateStatus: "" as Status,
    deleteStatus: "" as Status,
    lastInsertedPackage: {},
    shouldPopulateLastInsertedPackage: false
  },
  reducers: {
    clearFetchDataStatus: (state) => {
      state.fetchDataStatus = "";
    },
    clearCreateStatus: (state) => {
      state.createStatus = "";
    },
    clearUpdateStatus: (state) => {
      state.updateStatus = "";
    },
    clearDeleteStatus: (state) => {
      state.deleteStatus = "";
    },
    setShouldPopulateLastInsertedPackage: (state, action) => {
      // To be set to true when we are in the createShipmentWizard component
      state.shouldPopulateLastInsertedPackage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.fetchDataStatus = "LOADING";
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.total = action.payload.totalCount;
        state.fetchDataStatus = "SUCCESS";
      })
      .addCase(fetchPackages.rejected, (state) => {
        state.fetchDataStatus = "ERROR";
      })
      .addCase(addPackage.fulfilled, (state, action) => {
        if (state.shouldPopulateLastInsertedPackage) {
          state.lastInsertedPackage = action.payload;
        }
        state.createStatus = "SUCCESS";
      })
      .addCase(addPackage.rejected, (state, action) => {
        state.createStatus = "ERROR";
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.updateStatus = "SUCCESS";
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.updateStatus = "ERROR";
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.deleteStatus = "SUCCESS";
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.deleteStatus = "ERROR";
      });
  }
});

export const {
  clearFetchDataStatus,
  clearCreateStatus,
  clearUpdateStatus,
  clearDeleteStatus,
  setShouldPopulateLastInsertedPackage
} = packagesSlice.actions;
export default packagesSlice.reducer;
