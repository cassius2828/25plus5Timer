import { combineReducers } from "redux";

const INCREMENT_BREAK = "INCREMENT_BREAK";
const DECREMENT_BREAK = "DECREMENT_BREAK";
const INCREMENT_SESSION = "INCREMENT_SESSION";
const DECREMENT_SESSION = "DECREMENT_SESSION";

let breakL = 5;
const breakLengthReducer = (state = breakL, action) => {
  switch (action.type) {
    case INCREMENT_BREAK:
      return breakL >= 15 ? (breakL = 15) : (breakL = breakL + 1);
    case DECREMENT_BREAK:
      return breakL <= 1 ? (breakL = 1) : (breakL = breakL - 1);
    default:
      return state;
  }
};
let sessionL = 25;
const sessionLengthReducer = (state = sessionL, action) => {
  switch (action.type) {
    case INCREMENT_SESSION:
      return sessionL >= 60 ? (sessionL = 60) : (sessionL = sessionL + 1);
    case DECREMENT_SESSION:
      return sessionL <= 1 ? (sessionL = 1) : (sessionL = sessionL - 1);
    default:
      return state;
  }
};

export const root = combineReducers({
  breakTimer: breakLengthReducer,
  sessionTimer: sessionLengthReducer,
});
