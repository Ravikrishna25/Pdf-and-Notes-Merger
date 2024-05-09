import {combineReducers, configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import authReducer  from "./slices/authSlice";


const reducer = combineReducers({
  
    authState : authReducer,
  
})

const store = configureStore({
    reducer,
    middleware:[thunk]   //thunk to play aynchronous
})

// store.dispatch({ type: "auth/initialize", payload: { isAuthenticated: false } });
export default store;