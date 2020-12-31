import { AppReducer } from '../redux/reducers';
import { saveAuthToken } from '../api/tokenMiddleware';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

export const store = createStore(AppReducer, applyMiddleware(thunk, saveAuthToken));
