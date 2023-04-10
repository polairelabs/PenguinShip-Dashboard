import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BaseApi, { ApiError } from "../../api/api";
import {
  DashboardStatistics,
  Membership
} from "../../types/apps/NavashipTypes";
import { Status } from "../index";
import { Dispatch } from "redux";

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
      return await BaseApi.post("/auth/register", data);
    } catch (error) {
      let apiError = error as ApiError;
      return rejectWithValue(apiError.messages?.[0] ?? "Server error");
    }
  }
);

export const confirmEmail = createAsyncThunk(
  "auth/confirmEmail",
  async (
    emailVerificationJwt: string,
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      return await BaseApi.get(`/auth/verify-email/${emailVerificationJwt}`);
    } catch (error) {
      let apiError = error as ApiError;
      return rejectWithValue(apiError.messages?.[0] ?? "Server error");
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  "auth/fetchDashboardStats",
  async () => {
    return await BaseApi.get("/dashboard/stats");
  }
);

export const fetchMemberships = createAsyncThunk(
  "auth/fetchMemberships",
  async () => {
    return await BaseApi.get("/subscriptions");
  }
);

export const fetchMembershipsAdmin = createAsyncThunk(
  "auth/admin/fetchMemberships",
  async () => {
    return await BaseApi.get("/admin/subscriptions");
  }
);

export const fetchStripePriceIds = createAsyncThunk(
  "auth/admin/fetchStripePriceIds",
  async () => {
    return await BaseApi.get("/admin/subscriptions/prices");
  }
);

export const updateMembership = createAsyncThunk(
  "auth/admin/updateMembership",
  async (
    data: { [key: string]: number | string | boolean },
    { getState, dispatch }: Redux
  ) => {
    const response = await BaseApi.put(`/admin/subscriptions/${data.id}`, data);
    dispatch(fetchMembershipsAdmin());
    return response;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    memberships: [] as Membership[],
    stripePriceIds: [] as string[],
    fetchMembershipsStatus: "" as Status,
    accountCreationStatus: "" as Status,
    updateMembershipStatus: "" as Status,
    confirmEmailStatus: "" as Status,
    dashboardStatistics: {} as DashboardStatistics
  },
  reducers: {
    clearAccountCreationStatus: (state) => {
      state.accountCreationStatus = "";
    },
    clearUpdateMembershipStatus: (state) => {
      state.updateMembershipStatus = "";
    },
    clearConfirmEmailStatus: (state) => {
      state.confirmEmailStatus = "";
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
      .addCase(confirmEmail.rejected, (state, action) => {
        state.confirmEmailStatus = "ERROR";
      })
      .addCase(confirmEmail.fulfilled, (state, action) => {
        state.confirmEmailStatus = "SUCCESS";
      })
      .addCase(fetchMemberships.pending, (state, action) => {
        state.fetchMembershipsStatus = "LOADING";
      })
      .addCase(fetchMemberships.fulfilled, (state, action) => {
        state.fetchMembershipsStatus = "SUCCESS";
        state.memberships = action.payload;
      })
      .addCase(fetchMemberships.rejected, (state, action) => {
        state.fetchMembershipsStatus = "ERROR";
      })
      .addCase(fetchMembershipsAdmin.pending, (state, action) => {
        state.fetchMembershipsStatus = "LOADING";
      })
      .addCase(fetchMembershipsAdmin.fulfilled, (state, action) => {
        state.fetchMembershipsStatus = "SUCCESS";
        state.memberships = action.payload;
      })
      .addCase(fetchMembershipsAdmin.rejected, (state, action) => {
        state.fetchMembershipsStatus = "ERROR";
      })
      .addCase(fetchStripePriceIds.fulfilled, (state, action) => {
        state.stripePriceIds = action.payload;
      })
      .addCase(updateMembership.fulfilled, (state, action) => {
        state.updateMembershipStatus = "SUCCESS";
      })
      .addCase(updateMembership.rejected, (state, action) => {
        state.updateMembershipStatus = "ERROR";
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardStatistics = action.payload;
      });
  }
});

export const { clearAccountCreationStatus, clearUpdateMembershipStatus, clearConfirmEmailStatus } =
  authSlice.actions;
export default authSlice.reducer;
