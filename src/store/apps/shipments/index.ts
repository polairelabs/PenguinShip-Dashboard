import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import BaseApi, { ApiError } from "../../../api/api";
import {
  CreatedShipment,
  Rate,
  Shipment,
  BoughtShipment
} from "../../../types/apps/NavashipTypes";
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
    data: { [key: string]: number | string | undefined | boolean },
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
    data: { [key: string]: number | string | boolean | undefined },
    { getState, dispatch, rejectWithValue }: Redux
  ) => {
    try {
      const response = await BaseApi.post("/shipments/buy", data);
      const state = getState();
      const params = {
        offset: state.shipments.offset,
        size: state.shipments.size,
        order: "desc"
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
      offset: state.shipments.offset,
      size: state.shipments.size,
      order: "desc"
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
    boughtShipment: {} as BoughtShipment,
    createdShipmentRates: [] as Rate[],
    allShipments: [] as Shipment[],
    total: 0,
    createShipmentStatus: "" as Status,
    fetchRatesStatus: "" as Status,
    buyShipmentRateStatus: "" as Status,
    deleteStatus: "" as Status,
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
    clearDeleteStatus: (state) => {
      state.deleteStatus = "";
    },
    clearFetchRatesStatus: (state) => {
      state.fetchRatesStatus = "";
    },
    setOffset: (state, action) => {
      state.offset = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
    clearRates: (state) => {
      state.selectedRates = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createShipment.fulfilled, (state, action) => {
        state.createdShipment = action.payload;
        state.createdShipmentRates = action.payload?.rates;
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
        state.boughtShipment = action.payload;
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
        state.selectedRates = action.payload?.rates;
        state.fetchRatesStatus = "SUCCESS";
      })
      .addCase(fetchRates.pending, (state, action) => {
        state.fetchRatesStatus = "LOADING";
      })
      .addCase(fetchRates.rejected, (state, action) => {
        state.fetchRatesStatus = "ERROR";
      })
      .addCase(deleteShipment.fulfilled, (state, action) => {
        state.deleteStatus = "SUCCESS";
      })
      .addCase(deleteShipment.rejected, (state, action) => {
        state.deleteStatus = "ERROR";
      });
  }
});

export const {
  clearCreateShipmentStatus,
  clearBuyShipmentRateStatus,
  clearCreateShipmentError,
  clearBuyShipmentError,
  clearDeleteStatus,
  setOffset,
  setSize,
  clearRates,
  clearFetchRatesStatus
} = shipmentsSlice.actions;
export default shipmentsSlice.reducer;
