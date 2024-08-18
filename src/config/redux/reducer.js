import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
    name: 'musicapplication',
    initialState: {
        profiledetails: null,
        userlogin: true,
        currentTab: null,
    },
    reducers: {

        setCurrentTab: (state, action) => {
            state.currentTab = action.payload;
        },

        userIsLogin: (state, action) => {
            state.userlogin = action.payload
        },

        setProfile: (state, action) => {
            state.profiledetails = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { userIsLogin, setProfile, setCurrentTab } = counterSlice.actions

export default counterSlice.reducer