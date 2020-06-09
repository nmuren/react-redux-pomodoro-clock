import React from "react";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";

const BREAK = "Break";
const SESSION = "Session";
const DEFAULT_BREAK_TIME = 5; //5
const DEFAULT_SESSION_TIME = 25; //25
const DEFAULT_TIMER = DEFAULT_SESSION_TIME * 60;
const INTERVAL = 1000;

const SET_BREAK = "SET_BREAK";
const SET_SESSION = "SET_SESSION";
const CLEAR = "CLEAR";
const RESET = "RESET";
const START = "START";
const STOP = "STOP";
const DECREMENT_TIMER = "DECREMENT_TIMER";
const BREAK_ENDED = "BREAK_ENDED";
const SESSION_ENDED = "SESSION_ENDED";

const DECREMENT = "DECREMENT";
const INCREMENT = "INCREMENT";
const RUNNING = "RUNNING";
const PAUSED = "PAUSED";

const DEFAULT_STATE = {
  breakLenght: DEFAULT_BREAK_TIME,
  sessionLength: DEFAULT_SESSION_TIME,
  timerType: SESSION,
  timer: DEFAULT_TIMER,
  activity: PAUSED
};

// Redux:
const pomodoroReducer = (state = DEFAULT_STATE, action) => {
  let newState = { ...state };
  switch (action.type) {
    case SET_BREAK:
      newState.breakLenght = action.breakLenght;
      break;
    case SET_SESSION:
      newState.sessionLength = action.sessionLength;
      newState.timer = action.sessionLength * 60;
      break;
    case CLEAR:
      newState.timer = newState.sessionLength * 60;
      newState.timerType = SESSION;
      newState.activity = PAUSED;
      break;
    case RESET:
      newState = DEFAULT_STATE;
      break;
    case STOP:
      newState.activity = PAUSED;
      break;
    case START:
      newState.activity = RUNNING;
      break;
    case DECREMENT_TIMER:
      newState.timer = newState.timer - 1;
      break;
    /*case TIMER_ENDED:
      newState.timer = action.time * 60;
      newState.timerType = action.timerType;
      break;*/
    case SESSION_ENDED:
      newState.timer = newState.breakLenght * 60;
      newState.timerType = BREAK;
      break;
    case BREAK_ENDED:
      newState.timer = newState.sessionLength * 60;
      newState.timerType = SESSION;
      break;
    default:
      return state;
  }
  return newState;
};

const store = createStore(pomodoroReducer);

const setBreakLength = vector => {
  let action = {
    type: SET_BREAK
  };
  switch (vector) {
    case INCREMENT:
      action.breakLenght = store.getState().breakLenght + 1;
      break;
    case DECREMENT:
      action.breakLenght = store.getState().breakLenght - 1;
      break;
    default:
      break;
  }
  return action;
};
const setSessionLength = vector => {
  let action = {
    type: SET_SESSION
  };
  switch (vector) {
    case INCREMENT:
      action.sessionLength = store.getState().sessionLength + 1;
      break;
    case DECREMENT:
      action.sessionLength = store.getState().sessionLength - 1;
      break;
    default:
      break;
  }
  return action;
};
const clearTimer = () => {
  return {
    type: CLEAR
  };
};
const resetTimer = () => {
  return {
    type: RESET
  };
};
const startTimer = () => {
  return {
    type: START
  };
};
const stopTimer = () => {
  return {
    type: STOP
  };
};
const decrementTimer = () => {
  //justLog("decrementTimer");
  return {
    type: DECREMENT_TIMER
  };
};
const sessionEnded = () => {
  return {
    type: SESSION_ENDED
  };
};
const breakEnded = () => {
  //justLog("timerEnded");
  return {
    type: BREAK_ENDED
  };
};
const justLog = where => {
  console.info("invoked at:", where);
};

let audioElement = document.getElementById("beep");

const countdown = () => {
  if (store.getState().activity === RUNNING) {
    if (store.getState().timer > 0) {
      store.dispatch(decrementTimer());
      setTimeout(() => countdown(), INTERVAL);
    } else {
      justLog("trink!!!");
      if (audioElement !== null) audioElement.play();
      //setTimeout(function() {
      if (store.getState().timerType === SESSION) {
        store.dispatch(sessionEnded());
      } else if (store.getState().timerType === BREAK) {
        store.dispatch(breakEnded());
      }
      countdown();
    }
  }
};

// React:
class App extends React.Component {
  breakAction(vector) {
    if (vector === DECREMENT && store.getState().breakLenght > 1) {
      store.dispatch(setBreakLength(DECREMENT));
    } else if (vector === INCREMENT && store.getState().breakLenght < 60) {
      store.dispatch(setBreakLength(INCREMENT));
    }
  }
  sessionAction(vector) {
    if (vector === DECREMENT && store.getState().sessionLength > 1) {
      store.dispatch(setSessionLength(DECREMENT));
    } else if (vector === INCREMENT && store.getState().sessionLength < 60) {
      store.dispatch(setSessionLength(INCREMENT));
    }
  }
  clearAction() {
    store.dispatch(clearTimer());
  }
  resetAction() {
    store.dispatch(resetTimer());
    if (audioElement !== null) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  }
  playbackAction(status) {
    switch (status) {
      case RUNNING:
        store.dispatch(stopTimer());
        break;
      case PAUSED:
        store.dispatch(startTimer());
        setTimeout(() => countdown(), 200);
        break;
      default:
        break;
    }
  }
  timerViewer(seconds) {
    const separator = ":";
    const minute = Math.floor(seconds / 60).toString();
    const second = (seconds % 60).toString();
    return (
      this.doubleDigitFormatter(minute) +
      separator +
      this.doubleDigitFormatter(second)
    );
  }
  doubleDigitFormatter(timeValue) {
    if (timeValue.length === 1) return "0" + timeValue;
    else return timeValue;
  }

  render() {
    const state = store.getState();
    return (
      <div>
        <div className="shadow-sm card ">
          {/*<h4 className="text-center card-header"></h4>*/}
          <div className="mt-2 mb-3 mx-3 text-center">
            <label id="break-label">
              Break Length{" - "}
              <span id="break-length">{state.breakLenght}</span>
            </label>
            <div className="row">
              <div className="col-6">
                <button
                  id="break-decrement"
                  className="btn btn-success btn-block"
                  onClick={this.breakAction.bind(this, DECREMENT)}
                >
                  Break Dec
                </button>
              </div>
              <div className="col-6">
                <button
                  id="break-increment"
                  className="btn btn-success btn-block"
                  onClick={this.breakAction.bind(this, INCREMENT)}
                >
                  Break Inc
                </button>
              </div>
            </div>
            <label id="session-label">
              Session Length{" - "}
              <span id="session-length">{state.sessionLength}</span>
            </label>
            <div className="row">
              <div className="col-6">
                <button
                  id="session-decrement"
                  className="btn btn-success btn-block"
                  onClick={this.sessionAction.bind(this, DECREMENT)}
                >
                  Session Dec
                </button>
              </div>
              <div className="col-6">
                <button
                  id="session-increment"
                  className="btn btn-success btn-block"
                  onClick={this.sessionAction.bind(this, INCREMENT)}
                >
                  Session Inc
                </button>
              </div>
            </div>
            <label id="timer-label">
              <br />
              {state.timerType}
              <br />
              <span id="time-left" className="display-4">
                {this.timerViewer(state.timer)}
              </span>{" "}
              <br />
              <br />
            </label>
            <div className="row">
              <div className="col-4">
                <button
                  id="soft-reset"
                  className="btn btn-warning btn-block"
                  onClick={this.clearAction.bind(this)}
                >
                  Clear
                </button>
              </div>
              <div className="col-4">
                <button
                  id="start_stop"
                  className="btn btn-secondary btn-block"
                  onClick={this.playbackAction.bind(this, state.activity)}
                >
                  Start/Stop
                </button>
              </div>
              <div className="col-4">
                <button
                  id="reset"
                  className="btn btn-danger btn-block"
                  onClick={this.resetAction.bind(this)}
                >
                  Reset
                </button>
              </div>
            </div>
            <audio
              id="beep"
              src="https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3"
              preload="auto"
            />
          </div>
        </div>
      </div>
    );
  }
}

// React-Redux:
const mapStateToProps = state => {
  return state;
};
const Container = connect(mapStateToProps)(App);
export default class AppWrapper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Container />
      </Provider>
    );
  }
}
