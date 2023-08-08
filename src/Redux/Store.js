import { configureStore } from "@reduxjs/toolkit";
import { root } from "./Reducers";

export const store = configureStore({reducer: root})