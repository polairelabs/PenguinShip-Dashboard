// ** Redux Imports
import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import BaseApi from "../../../api/api";

interface DataParams {
  weight: number;
  lengthObj: number;
  width: number;
  height: number;
}

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

// ** Fetch Packages
export const fetchData = createAsyncThunk(
  "appPackages/fetchData",
  async (p) => {
    const response = await axios.get("http://localhost:8080/apps/packages/");

    return response.data;
  }
);

// ** Add User
export const addPackages = createAsyncThunk(
  "appPackages/addPackage",
  async (
    data: { [key: string]: number | string },
    { getState, dispatch }: Redux
  ) => {
    const response = await BaseApi.post("/shipments", data);
    dispatch(fetchData());

    return response;
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
    dispatch(fetchData());

    return response.data;
  }
);

export const appPackagesSlice = createSlice({
  name: "appPackages",
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.packages;
      state.total = action.payload.total;
      state.params = action.payload.params;
      state.allData = action.payload.allData;
    });
  }
});

export default appPackagesSlice.reducer;
