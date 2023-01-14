import { Dispatch } from "redux";
import { createAsyncThunk } from "@reduxjs/toolkit";
import BaseApi from "../../api/api";
import { RegisterParams } from "../../context/types";

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
      return await BaseApi.post("/register", data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMemberships = createAsyncThunk(
  "auth/fetchMemberships",
  async (p) => {
    return await BaseApi.get("/memberships");
  }
);