import React from 'react';
import { AppRegistry, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import AppReducer from './src/reducers/reducers';
import AppWithNavigationState from './src/navigators/AppNavigator';

import { middleware } from './src/utils/redux';
import thunk from 'redux-thunk';


const store = createStore(
  AppReducer,
  applyMiddleware(middleware, thunk),
);

class SwingEssentialsApp extends React.Component {
  render() {
    StatusBar.setBarStyle('light-content', true);
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('swingessentialsapp', () => SwingEssentialsApp);

export default SwingEssentialsApp ;
