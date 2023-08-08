import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import tachyons from "tachyons";
import {
  incrementBreak,
  decrementBreak,
  incrementSession,
  decrementSession,
} from "./Redux/Actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faPlay,
  faPause,
  faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import sound from "./Sounds/mixkit-basketball-buzzer-1647.wav";

////////////////////////////////////////////////////////////////

//! APP COMPONENT
export const App = () => {
  const Ref = useRef(null);
  // store state
  const breakState = useSelector((state) => state.breakTimer);
  const sessionState = useSelector((state) => state.sessionTimer);
  // setting up timers

  //////////////////////////////////////////////////////////////////////
  // session timer state + useEffect
  const [timer, setTimer] = useState(sessionState + ":00");
  const [breakTimer, setBreakTimer] = useState(breakState + ":00");
  const [pause, setPause] = useState(false);
  const [warning, setWarning] = useState(false);

  // sound effect when timer ends
  const play = () => {
    new Audio(sound).play();
  };

  // everytime sessionState is changed via arrows, the hook will run again to update the timer
  useEffect(() => {
    setTimer(sessionState + ":00");
  }, [sessionState]);

  // get time function
  const getRemainingTime = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total,
      seconds,
      minutes,
    };
  };

  // adds 0 in front of single digit numbers (strings)
  // and adds state to change text color to red when under a minute left in timer
  const startTimer = (e) => {
    let { total, seconds, minutes } = getRemainingTime(e);
    if (total >= 0) {
      setTimer(
        (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
    if (minutes < 1 && seconds === 0) {
      play();
    }
    if (minutes < 1) {
      setWarning(true);
    } else {
      setWarning(false);
    }
  };

  const resetTimer = (e) => {
    setTimer(sessionState.toString() + ":00");

    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + sessionState);
    return deadline;
  };

  const pauseTimer = () => {
    clearInterval(Ref.current);
  };

  const startCountDown = (e) => {
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const onClickReset = () => {
    resetTimer(getDeadTime());
  };

  //////////////////////////////////////////////////////////////////////

  return (
    <div className="App">
      <div className="main-container">
        <Text breakState={breakState} sessionState={sessionState} />
        <Card warning={warning} timer={timer} />
        <Buttons
          reset={resetTimer}
          startTimer={onClickReset}
          pauseTimer={pauseTimer}
        />
      </div>
    </div>
  );
};

//! TEXT COMPONENT
const Text = ({ breakState, sessionState }) => {
  const dispatch = useDispatch();

  return (
    <div className="text-container">
      <h1 className="tc">25 + 5 Clock</h1>
      <div className="length-container">
        <div className="length-text1">
          <h2>Break Length</h2>
          <div className="text-buttons">
            <FontAwesomeIcon
              onClick={() => dispatch(decrementBreak())}
              size="lg"
              icon={faArrowDown}
            />
            <h2>{breakState}</h2>
            <FontAwesomeIcon
              onClick={() => dispatch(incrementBreak())}
              size="lg"
              icon={faArrowUp}
            />
          </div>
        </div>
        <div className="length-text2">
          <h2> Session Length</h2>
          <div className="text-buttons">
            <FontAwesomeIcon
              onClick={() => dispatch(decrementSession())}
              size="lg"
              icon={faArrowDown}
            />
            <h2>{sessionState}</h2>
            <FontAwesomeIcon
              onClick={() => dispatch(incrementSession())}
              size="lg"
              icon={faArrowUp}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

//! CARD COMPONENT
const Card = ({ timer, warning }) => {
  return (
    <div onClick={() => console.log(warning)} className="card-container">
      <h2>Session</h2>
      {warning ? <h1 style={{ color: "red" }}>{timer}</h1> : <h1>{timer}</h1>}
    </div>
  );
};

//! BUTTONS COMPONENT
const Buttons = ({ startTimer, reset, pauseTimer }) => {
  return (
    <div className="button-container">
      <FontAwesomeIcon
        onClick={startTimer}
        style={{ cursor: "pointer" }}
        size="2x"
        icon={faPlay}
      />
      <FontAwesomeIcon
        onClick={pauseTimer}
        style={{ cursor: "pointer" }}
        size="2x"
        icon={faPause}
      />
      <FontAwesomeIcon
        onClick={reset}
        style={{ cursor: "pointer" }}
        size="2x"
        icon={faArrowRotateRight}
      />
    </div>
  );
};

export default App;
