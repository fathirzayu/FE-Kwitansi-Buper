import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  value: {},
};

const userSlice = createSlice({
    name: "user",
    initialState: initialValue,
    reducers: {
        setValue: (state,action) => {
            state.value = action.payload
        }
    }
})
export const { setValue } = userSlice.actions
export default userSlice.reducer
