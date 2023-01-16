import { Dispatch } from "redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BaseApi from "../../api/api";
import { Membership} from "../../types/apps/navashipInterfaces";
import { Status } from "../index";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const createAccount = createAsyncThunk(
  "auth/createAccount",
  async (
    data: { [key: string]: number | string | undefined },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      return await BaseApi.post("/create-checkout-session", data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMemberships = createAsyncThunk(
  "auth/fetchMemberships",
  async () => {
    return await BaseApi.get("/memberships");
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

  }
});

export const { clearAccountCreationStatus } =
  authSlice.actions;
export default authSlice.reducer;