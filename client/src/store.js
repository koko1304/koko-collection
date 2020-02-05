import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";

// Combine reducers
import combineReducers from "./reducers";

// Create redux store
const store = createStore(combineReducers, applyMiddleware(reduxThunk));

export default store;
