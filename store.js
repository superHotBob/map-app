import { configureStore } from '@reduxjs/toolkit';
import pathsSlice from './reduser';

export const store = configureStore({
  reducer: {
    track: pathsSlice
  },
});