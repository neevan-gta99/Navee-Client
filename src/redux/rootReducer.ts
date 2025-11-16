// rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import sellerAuthReducer from './features/seller/sellerAuthSlice';
import adminAuthReducer from './features/admin/adminAuthSlice';

const rootReducer = combineReducers({
  sellerAuth: sellerAuthReducer,
  adminAuth: adminAuthReducer
});

export default rootReducer;
