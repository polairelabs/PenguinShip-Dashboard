// ** Redux Imports
import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import authConfig from "../../../configs/auth";

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

// ** Fetch Addresses
export const fetchData = createAsyncThunk(
  "appPackages/fetchData",
  async (p) => {
    const response = await axios.get("http://localhost:8080/api/v1/addresses/");

    return response.data;
  }
);

// ** Add Address
export const addAddress = createAsyncThunk(
  "appAddress/addAddress",
  async (

    data: { [key: string]: number | string },
    { getState, dispatch }: Redux
  ) => {
    const storedToken = window.localStorage.getItem(
        authConfig.storageTokenKeyName
    )!;
    const response = await axios.post(
      "http://localhost:8080/api/v1/addresses/",
      data,
        {
          headers: {Authorization: `Bearer ${storedToken}`}
        }
    );
    dispatch(fetchData());

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
