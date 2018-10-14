import React from 'react';
import { AsyncStorage, AppRegistry, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import AppReducer from './src/reducers/reducers';
import AppWithNavigationState from './src/navigators/AppNavigator';

import { middleware } from './src/utils/redux';
import thunk from 'redux-thunk';
import SplashScreen from 'react-native-splash-screen';
import { PermissionsAndroid } from 'react-native';

import {ASYNC_PREFIX} from './src/constants/index';
import {setToken} from './src/actions/LoginActions';

async function requestPermissions() {
  try {
    const cameragranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    const audiogranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    const readrollranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    const writerollgranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  } catch (err) {
    // console.warn(err)
  }
};

const store = createStore(
  AppReducer,
  applyMiddleware(middleware, thunk),
);

class SwingEssentialsApp extends React.Component {
  constructor(props){
    super(props);
    AsyncStorage.getItem(ASYNC_PREFIX+'token')
    .then((token)=>{
      if(token){store.dispatch(setToken(token));}
    });
  }

  componentDidMount(){
    SplashScreen.hide();
    requestPermissions();
  }

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
