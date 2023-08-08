const INCREMENT_BREAK = "INCREMENT_BREAK";
const DECREMENT_BREAK = "DECREMENT_BREAK";
const INCREMENT_SESSION = "INCREMENT_SESSION";
const DECREMENT_SESSION = "DECREMENT_SESSION";

export const incrementBreak = () => {
  return {
    type: INCREMENT_BREAK,
  };
};

export const decrementBreak = () => {
  return {
    type: DECREMENT_BREAK,
  };
};

export const incrementSession = () => {
  return {
    type: INCREMENT_SESSION,
  };
};

export const decrementSession = () => {
  return {
    type: DECREMENT_SESSION,
  };
};