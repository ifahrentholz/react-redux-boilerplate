import { createStore, combineReducers, applyMiddleware } from "redux";
import axios from "axios";
import thunk from "redux-thunk";
import logger from 'redux-logger';
import promise from "redux-promise-middleware";


const actions = {
  CHANGE_USER_NAME: "CHANGE_USER_NAME",
  CHANGE_USER_AGE: "CHANGE_USER_AGE",
  FETCH_USER: "FETCH_USER",
  FETCH_USER_PENDING: "FETCH_USER_PENDING",
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
      state = state.concat(action.payload.data);
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
    case actions.FETCH_USER_PENDING:
      state = { ...state, loading: true, error: false }
      break;
    case actions.FETCH_USER_FULFILLED:
    case actions.FETCH_USER_REJECTED:
      state = { ...state, loading: false, error: false }
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
  applyMiddleware(promise(), thunk, logger)
)


store.dispatch({
  type: actions.FETCH_USER,
  payload: axios.get("http://rest.learncode.academy/api/wstern/users")
});