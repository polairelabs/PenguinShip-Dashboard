// ** Toolkit imports
import { configureStore } from "@reduxjs/toolkit";

// ** Reducers
import packages from "src/store/apps/packages";
import addresses from "src/store/apps/addresses";
import shipments from "src/store/apps/shipments";

export const store = configureStore({
  reducer: {
    packages,
    addresses,
    shipments
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
