import React, {Fragment} from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import { saveAuthToken } from './src/http';
import MainNavigation from './src/navigation/MainNavigator';
import AppReducer from './src/redux/reducers/authReducer';

import rootSaga from './src/redux/sagas';

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  AppReducer,
  applyMiddleware(sagaMiddleware, saveAuthToken),
);
sagaMiddleware.run(rootSaga)

const App = () => {
  return (
    <Provider store={store}>
      <MainNavigation/>
    </Provider>
  );
};

export default App;
