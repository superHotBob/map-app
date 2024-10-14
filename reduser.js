import { createSlice } from '@reduxjs/toolkit';

// This is the initial state of the slice
const initialState = {
  nodes: [],
  name: '',
  type: '',
  time: 1,
  weight: 70,
  braslet: false
};

export const pathSlice = createSlice({
  name: 'track', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    addpoint: (state, action) => {      
      state.nodes = [...state.nodes, action.payload]      
    },
    setname: (state, action) => {      
     state.name = action.payload;
    },
    settime: (state, action) => {      
      state.time = action.payload;
     },
     setweight: (state, action) => {      
      state.weight = action.payload;
     },
    settype: (state, action) => {      
      state.type = action.payload;
     },
    deletepoint: (state, action) => {      
      state.nodes = [];
      state.name = '';
    },
    setbraslet: (state, action) => {
      state.braslet = !state.braslet
    }
  },
});

// Action creators are generated for each case reducer function
export const {setbraslet, setweight, settime, addpoint, deletepoint, setname, settype } = pathSlice.actions;

// We export the reducer function so that it can be added to the store
export default pathSlice.reducer;