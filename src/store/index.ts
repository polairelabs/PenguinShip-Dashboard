// ** Toolkit imports
import { configureStore } from "@reduxjs/toolkit";

// ** Reducers
import packages from "src/store/apps/packages";

export const store = configureStore({
  reducer: {
    packages
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
