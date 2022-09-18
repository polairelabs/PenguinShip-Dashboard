// ** Redux Imports
import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";

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

// ** Fetch Packages
export const fetchData = createAsyncThunk(
    "appPackages/fetchData",
    async (p) => {
        const response = await axios.get(
            "http://localhost:8080/apps/packages/?clientId=" + JSON.parse(window.localStorage.getItem("userData")  || '{}').id
        );
        return response.data;
    }
);

// ** Add Packages
export const addPackages = createAsyncThunk(
    "appPackages/addPackage",
    async (
        data: { [key: string]: number | string },
        { getState, dispatch }: Redux
    ) => {
        const response = await axios.post(
            "http://localhost:8080/apps/packages/?clientId=" + JSON.parse(window.localStorage.getItem("userData")  || '{}').id,
            data
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
        allData: [],
        status: "idle"
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.data = action.payload;
                // state.total = action.payload.total
                // state.params = action.payload.params
                // state.allData = action.payload.allData
                state.status = "idle";
            })
            .addCase(fetchData.rejected, (state) => {
                state.status = "failed";
            });
    }
});

export default appPackagesSlice.reducer;