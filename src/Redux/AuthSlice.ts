import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import UserModel from "../Models/UserModel";

// Track & manage state changes made by different users:

// Reducer for user registration:
function register(currentState: UserModel, action: PayloadAction<UserModel>): UserModel {

    // Extract user data from the action payload:
    const registeredUser = action.payload;

    // Update the current user state to the new user state:
    const newState = registeredUser;
    return newState;
}

// Reducer for user login:
function login(currentState: UserModel, action: PayloadAction<UserModel>): UserModel {

    const loggedInUser = action.payload;
    const newState = loggedInUser;
    return newState;
}

// Reducer for user logout:
function logout(currentState: UserModel, action: PayloadAction): UserModel {
    return null;
}


// Create a slice of the Redux store for authentication:
const authSlice = createSlice({

    name: "auth",
    initialState: null,
    reducers: { register, login, logout }
});


// Expose a single object containing functions for creating Action objects:
export const authActionCreators = authSlice.actions;

// Expose a single object containing all reducers:
export const authReducersContainer = authSlice.reducer;
