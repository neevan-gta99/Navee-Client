// rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import sellerAuthReducer from './features/seller/sellerAuthSlice';

const rootReducer = combineReducers({
  sellerAuth: sellerAuthReducer,
});

export default rootReducer;
