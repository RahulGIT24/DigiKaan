import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { UserReducerInitialState } from "../../types/reducer"
import { User } from "../../types/common";

const initialState: UserReducerInitialState = { user: null, loading: true }
export const userReducer = createSlice({
    name: "userReducer", initialState,
    reducers: {
        userExist: (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload
        },
        userNotExist: (state) => {
            state.loading = false;
            state.user = null
        },
        isActive:(state,action: PayloadAction<boolean>)=>{
            state.flag = action.payload
        }
    }
})

export const { userExist, userNotExist,isActive } = userReducer.actions