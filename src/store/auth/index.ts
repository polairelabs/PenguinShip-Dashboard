import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BaseApi from "../../api/api";
import { Membership } from "../../types/apps/NavashipTypes";
import { Status } from "../index";

export const createAccount = createAsyncThunk(
  "auth/createAccount",
  async (
    data: { [key: string]: number | string | undefined },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      return await BaseApi.post("/register", data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMemberships = createAsyncThunk(
  "auth/fetchMemberships",
  async () => {
    return await BaseApi.get("/subscriptions/memberships");
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    memberships: [] as Membership[],
    accountCreationStatus: "" as Status
  },
  reducers: {
    clearAccountCreationStatus: (state) => {
      state.accountCreationStatus = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.rejected, (state, action) => {
        state.accountCreationStatus = "ERROR";
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.accountCreationStatus = "SUCCESS";
      })
      .addCase(fetchMemberships.fulfilled, (state, action) => {
        state.memberships = action.payload;
      });
  }
});

export const { clearAccountCreationStatus } = authSlice.actions;
export default authSlice.reducer;
