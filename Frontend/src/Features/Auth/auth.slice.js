import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user: null,
        loading: false,
        error: null,
        isVerified:false
    },
    reducers:{
        setLoading:(state,action) => {
            state.loading = action.payload;
        },
        setError:(state,action) => {
            state.error = action.payload;
        },
        setUser:(state,action) => {
            state.user = action.payload;
        },
        setIsVerified:(state,action) => {
            state.isVerified = action.payload;
        }
    }
})

export const {setLoading,setError,setUser,setIsVerified} = authSlice.actions;

export default authSlice.reducer;