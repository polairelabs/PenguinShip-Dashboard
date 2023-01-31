import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import BaseApi, { ApiError } from "../../../api/api";
import {
  CreatedShipment,
  Rate,
  Shipment
} from "../../../types/apps/navashipInterfaces";
import { Status } from "../../index";
import { Dispatch } from "redux";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
  rejectWithValue: any;
}

export const fetchShipments = createAsyncThunk(
  "shipments/fetchShipments",
  async (params?: { [key: string]: number | string }) => {
    return await BaseApi.get("/shipments", params);
  }
);

export const createShipment = createAsyncThunk(
  "shipments/createShipment",
  async (
    data: { [key: string]: number | string | undefined },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      return await BaseApi.post("/shipments", data);
    } catch (error) {
      let apiError = error as ApiError;
      return rejectWithValue(apiError.messages?.[0] ?? "Server error");
    }
  }
);

export const buyShipmentRate = createAsyncThunk(
  "shipments/setShipmentRate",
  async (
    data: { [key: string]: number | string | undefined },
    { getState, dispatch, rejectWithValue }: Redux
  ) => {
    try {
      const response = await BaseApi.post("/shipments/buy", data);
      const state = getState();
      const params = {
        offset: state.addresses.offset,
        size: state.addresses.size
      };
      dispatch(fetchShipments(params));
      return response;
    } catch (error) {
      let apiError = error as ApiError;
      return rejectWithValue(apiError.messages?.[0] ?? "Server error");
    }
  }
);

export const deleteShipment = createAsyncThunk(
  "shipments/deleteShipment",
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await BaseApi.delete(`/shipments/${id}`);
    const state = getState();
    const params = {
      offset: state.addresses.offset,
      size: state.addresses.size
    };
    dispatch(fetchShipments(params));
    return response;
  }
);

export const fetchRates = createAsyncThunk(
  "shipments/fetchRates",
  async (id: number | string, { getState, dispatch }: Redux) => {
    return await BaseApi.get(`/shipments/rates/${id}`);
  }
);

export const shipmentsSlice = createSlice({
  name: "shipments",
  initialState: {
    // createdShipment is used to retrieve the rates of the shipment (+ its easypost id)
    createdShipment: {} as CreatedShipment,
    createdShipmentRates: [] as Rate[],
    allShipments: [] as Shipment[],
    total: 0,
    createShipmentStatus: "" as Status,
    buyShipmentRateStatus: "" as Status,
    createShipmentError: "",
    buyShipmentError: "",
    // Offset and size to be used for pagination in all fetchAll calls inside the store
    offset: 1,
    size: 100,
    selectedRates: []
  },
  reducers: {
    clearCreateShipmentStatus: (state) => {
      state.createShipmentStatus = "";
    },
    clearBuyShipmentRateStatus: (state) => {
      state.buyShipmentRateStatus = "";
    },
    clearCreateShipmentError: (state) => {
      state.createShipmentError = "";
    },
    clearBuyShipmentError: (state) => {
      state.buyShipmentError = "";
    },
    setOffset: (state, action) => {
      state.offset = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createShipment.fulfilled, (state, action) => {
        state.createdShipment = action.payload;
        state.createdShipmentRates = action.payload?.rates?.sort(
          (r1: Rate, r2: Rate) => r1?.rate - r2.rate
        );
        state.createShipmentStatus = "SUCCESS";
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.createdShipment.id = "";
        state.createdShipmentRates = [];
        state.createShipmentStatus = "ERROR";
        state.createShipmentError = action.payload as string;
      })
      .addCase(buyShipmentRate.fulfilled, (state, action) => {
        state.buyShipmentRateStatus = "SUCCESS";
      })
      .addCase(buyShipmentRate.rejected, (state, action) => {
        state.buyShipmentRateStatus = "ERROR";
        state.buyShipmentError = action.payload as string;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.allShipments = action.payload.data;
        state.total = action.payload.totalCount;
      })
      .addCase(fetchRates.fulfilled, (state, action) => {
        state.selectedRates = action.payload;
        state.selectedRates = action.payload?.sort(
          (r1: Rate, r2: Rate) => r1?.rate - r2.rate
        );
      });
  }
});

export const {
  clearCreateShipmentStatus,
  clearBuyShipmentRateStatus,
  clearCreateShipmentError,
  clearBuyShipmentError,
  setOffset,
  setSize
} = shipmentsSlice.actions;
export default shipmentsSlice.reducer;
