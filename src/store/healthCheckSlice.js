import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isVerified: false, // Has health check passed?
  isChecking: false, // Is check currently running?
  lastCheckTime: null, // Timestamp of last check
  error: null,
};

export const healthCheckSlice = createSlice({
  name: 'healthCheck',
  initialState,
  reducers: {
    startHealthCheck: (state) => {
      state.isChecking = true;
      state.error = null;
    },
    healthCheckSuccess: (state) => {
      state.isVerified = true;
      state.isChecking = false;
      state.lastCheckTime = Date.now();
      state.error = null;
    },
    healthCheckFailure: (state, action) => {
      state.isVerified = false;
      state.isChecking = false;
      state.error = action.payload;
    },
    resetHealthCheck: (state) => {
      state.isVerified = false;
      state.isChecking = false;
      state.lastCheckTime = null;
      state.error = null;
    },
  },
});

export const {
  startHealthCheck,
  healthCheckSuccess,
  healthCheckFailure,
  resetHealthCheck,
} = healthCheckSlice.actions;

export default healthCheckSlice.reducer;