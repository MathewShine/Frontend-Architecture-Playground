import { configureStore } from '@reduxjs/toolkit';
import healthCheckReducer from './healthCheckSlice';

export const store = configureStore({
  reducer: {
    healthCheck: healthCheckReducer,
  },
});

export default store;