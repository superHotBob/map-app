import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nodes: [],
  name: '',
  type: 'running',
  time: 30000,
  weight: 80,
  sound: true 
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
     setsound: (state, action) => {      
      state.sound = !state.sound;
     },
     setweight: (state, action) => {      
      state.weight = action.payload;
     },
    settype: (state, action) => {      
      state.type = action.payload;
     },
    deletepoint: (state) => {         
      return {
        ...state,
        nodes: [],
      };      
    },
    setbraslet: (state ) => {
      state.braslet = !state.braslet
    }
  },
});
export const {setbraslet, setsound, setweight, settime, addpoint, deletepoint, setname, settype } = pathSlice.actions;
export default pathSlice.reducer;