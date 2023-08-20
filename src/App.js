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
  // ref for countdown
  const Ref = useRef(null);

  // store state
  const breakState = useSelector((state) => state.breakTimer);
  const sessionState = useSelector((state) => state.sessionTimer);
  // setting up timers

  //////////////////////////////////////////////////////////////////////
  // session timer state + useEffect
  const [switchTimers, setSwitchTimers] = useState(false);
  const [timer, setTimer] = useState(
    switchTimers ? breakState + ":00" : sessionState + ":00"
  );
  const [tally, setTally] = useState(0);
  // const [breakTimer, setBreakTimer] = useState(breakState + ":00");

  const [warning, setWarning] = useState(false);

  // sound effect when timer ends
  const play = () => {
    new Audio(sound).play();
  };

  // everytime sessionState is changed via arrows, the hook will run again to update the timer
  useEffect(() => {
    setTimer(sessionState + ":00");
  }, [sessionState]);

  // to start the break timer asap
  // * removed boolean to have session timer start immediately after break ends
  // ?this causes the timer to start immediately on load which I do not want
  // * i fixed it by adding a tally state so it doesn't run on first render
  useEffect(() => {
    if (tally > 0) {
      clearInterval(Ref.current);
      beginTimer(getDeadTime());

    }
  }, [switchTimers]);

  // ? TIMER LOGIC STARTS
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
    if (minutes < 1 && seconds === 0 && !switchTimers) {
      play();
      setSwitchTimers(!switchTimers);
      setTimer(breakState + ":00");
      setTally(1);
    } else if (minutes < 1 && seconds === 0 && switchTimers) {
       play();
       setSwitchTimers(!switchTimers);
       setTimer(sessionState + ":00");
       setTally(1);
    }
      if (minutes < 1) {
        setWarning(true);
      } else {
        setWarning(false);
      }
  };

  const resetTimer = () => {
    if (Ref.current) clearInterval(Ref.current);
    setTimer(sessionState.toString() + ":00");
    setSwitchTimers(false);
  };

  // ! we are starting the timer off the deadtime which takes the current time plus the
  // ! amount of minutes from session state to create out timer
  // * in order to contiue where we left off we need to add the CURRENT time left of the timer
  const beginTimer = (e) => {
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  // * fixed resume issue by setting the dealine to the current timer values
  // 1) split timer into 2 section
  //  2) parse those sections
  // 3) added those values to the deadline time
  const getDeadTime = () => {
    let deadline = new Date();
    // var to parse and split data to continue timer
    let parseTime = timer.split(":");

    let parsedMinutes = parseInt(parseTime[0]);
    let parsedSeconds = parseInt(parseTime[1]);
    deadline.setMinutes(deadline.getMinutes() + parsedMinutes);
    deadline.setSeconds(deadline.getSeconds() + parsedSeconds);
    return deadline;
  };

  const pauseTimer = () => {
    clearInterval(Ref.current);
  };

  const onBeginTimer = () => {
    clearInterval(Ref.current);
    beginTimer(getDeadTime());
  };

  //////////////////////////////////////////////////////////////////////

  return (
    <div className="main-container">
      <Text breakState={breakState} sessionState={sessionState} />
      <Card warning={warning} timer={timer} switchTimers={switchTimers} />
      <Buttons
        reset={resetTimer}
        startTimer={onBeginTimer}
        pauseTimer={pauseTimer}
      />
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
const Card = ({ timer, warning, switchTimers }) => {
  return (
    <div className="card-container">
      {switchTimers ? (
        <>
          <h2>Break</h2>
          {warning ? (
            <h1 style={{ color: "red" }}>{timer}</h1>
          ) : (
            <h1>{timer}</h1>
          )}
        </>
      ) : (
        <>
          {" "}
          <h2>Session</h2>
          {warning ? (
            <h1 style={{ color: "red" }}>{timer}</h1>
          ) : (
            <h1>{timer}</h1>
          )}
        </>
      )}
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
        size="lg"
        className="icon"
        icon={faPlay}
      />
      <FontAwesomeIcon
        onClick={pauseTimer}
        style={{ cursor: "pointer" }}
        size="lg"
        className="icon"
        icon={faPause}
      />
      <FontAwesomeIcon
        onClick={reset}
        style={{ cursor: "pointer" }}
        size="lg"
        className="icon"
        icon={faArrowRotateRight}
      />
    </div>
  );
};

export default App;
