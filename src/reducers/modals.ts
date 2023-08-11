import { createSlice } from "@reduxjs/toolkit";

// type TOption = {
//   label: string;
//   value: boolean;
// };

export const slice = createSlice({
  name: "modals",
  initialState: {
    modal:{
       editModal:false,
       deleteModal:false,
       addModal:false 
    }
  },
  reducers: {
    handleChangeModal:(state, action)=>{
        const {name, value}= action.payload;
        state.modal[name]=value;
    }
  },
});

export const { handleChangeModal } = slice.actions;

export default slice.reducer;
