import { createStore, combineReducers, applyMiddleware } from "redux";
import axios from "axios";
import thunk from "redux-thunk";
import logger from 'redux-logger';


const actions = {
  CHANGE_USER_NAME: "CHANGE_USER_NAME",
  CHANGE_USER_AGE: "CHANGE_USER_AGE",
  FETCH_START: "FETCH_START",
  FETCH_USER_REJECTED: "FETCH_USER_REJECTED",
  FETCH_USER_FULFILLED: "FETCH_USER_FULFILLED",
};

const intialUserState = [
  {
    "name": "Ingo",
    "age": "32",
    "id": "887181949ee8c10100eb8c5b"
  }
];

const userReducer = (state = intialUserState, action) => {
  switch (action.type) {
    case actions.FETCH_USER_FULFILLED:
      state = state.concat(action.payload);
      break;
    case actions.FETCH_USER_REJECTED:
      state = { ...state, error: action.payload }
      break;
    case actions.CHANGE_USER_NAME:
      state = { ...state, name: action.payload }
      break;
    case actions.CHANGE_USER_AGE:
      state = { ...state, age: action.payload }
      break;
  }
  return state;
}

const initialLoadingState = {
  "error": false,
  "loading": false
}
const loadingReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.FETCH_START:
      state = { ...state, loading: true, error: false }
      break;
    case actions.FETCH_USER_FULFILLED:
      state = { ...state, loading: false, error: false }
      break;
    case actions.FETCH_USER_REJECTED:
      state = { ...state, loading: false, error: true }
      break;
  }
  return state;
}

const reducers = combineReducers({
  user: userReducer,
  loading: loadingReducer
});

let store = createStore(
  reducers,
  applyMiddleware(thunk, logger)
)


store.dispatch((dispatch) => {
  dispatch({ type: actions.FETCH_START });
  axios.get("http://rest.learncode.academy/api/wstern/users")
    .then((response) => {
      dispatch({ type: actions.FETCH_USER_FULFILLED, payload: response.data })
    })
    .catch((err) => {
      dispatch({ type: actions.FETCH_USER_REJECTED, payload: err })
    });
});