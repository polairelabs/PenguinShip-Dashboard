import { Dispatch } from "redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BaseApi from "../../../api/api";
import { Status } from "../../index";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAddresses = createAsyncThunk(
  "addresses/fetchData",
  async (params?: { [key: string]: number | string }) => {
    return await BaseApi.get("/addresses", params);
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

export const updateAddress = createAsyncThunk(
  "addresses/updateAddress",
  async (
    data: { [key: string]: number | string },
    { getState, dispatch }: Redux
  ) => {
    const response = await BaseApi.put(`/addresses/${data.id}`, data);
    dispatch(fetchAddresses());
    return response;
  }
);

export const deleteAddress = createAsyncThunk(
  "addresses/deleteAddress",
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await BaseApi.delete(`/addresses/${id}`);
    dispatch(fetchAddresses());
    return response;
  }
);

export const addressesSlice = createSlice({
  name: "addresses",
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    fetchDataStatus: "" as Status,
    createStatus: "" as Status,
    updateStatus: "" as Status,
    deleteStatus: "" as Status,
    lastInsertedAddress: {},
    shouldPopulateLastInsertedAddress: false,
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
    setShouldPopulateLastInsertedAddress: (state, action) => {
      // To be set to true when we are in the createShipmentWizard component
      state.shouldPopulateLastInsertedAddress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.fetchDataStatus = "LOADING";
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.fetchDataStatus = "SUCCESS";
      })
      .addCase(fetchAddresses.rejected, (state) => {
        state.fetchDataStatus = "ERROR";
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        if (state.shouldPopulateLastInsertedAddress) {
          state.lastInsertedAddress = action.payload;
        }
        state.createStatus = "SUCCESS";
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.createStatus = "ERROR";
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.updateStatus = "SUCCESS";
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.updateStatus = "ERROR";
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.deleteStatus = "SUCCESS";
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.deleteStatus = "ERROR";
      });
  }
});

export const {
  clearFetchDataStatus,
  clearCreateStatus,
  clearUpdateStatus,
  clearDeleteStatus,
  setShouldPopulateLastInsertedAddress,
} = addressesSlice.actions;
export default addressesSlice.reducer;
