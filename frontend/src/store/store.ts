import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './slices/companySlice';
import reviewReducer from './slices/reviewSlice';

export const store = configureStore({
  reducer: {
    company: companyReducer,
    review: reviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
