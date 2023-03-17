import { configureStore } from "@reduxjs/toolkit";

import packages from "src/store/apps/packages";
import addresses from "src/store/apps/addresses";
import shipments from "src/store/apps/shipments";
import invoice from "src/store/apps/invoice";
import auth from "src/store/auth";

export const store = configureStore({
  reducer: {
    packages,
    addresses,
    shipments,
    invoice,
    auth
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type Status = "SUCCESS" | "LOADING" | "ERROR" | "";
