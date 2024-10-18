import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nodes: [],
  name: '',
  type: '',
  time: 0.5,
  weight: 70,
  braslet: false
};

export const pathSlice = createSlice({
  name: 'track', 
  initialState: initialState, 
  reducers: {    
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
export const {setbraslet, setweight, settime, addpoint, deletepoint, setname, settype } = pathSlice.actions;
export default pathSlice.reducer;