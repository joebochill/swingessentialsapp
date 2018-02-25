import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigators/AppNavigator';

const initialNavState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Home'));


function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case 'Login':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Main' }),
        state
      );
      break;
    case 'Logout':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Login' }),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}

const initialAuthState = { isLoggedIn: false };

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case 'Login':
      return { ...state, isLoggedIn: true };
    case 'Logout':
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
}

const initialUserState = {username: '',
firstName: '',
lastName: '',
email: ''};

function userData(state = initialUserState, action){
  switch(action.type){
    case 'LOGIN_SUCCESS':
      return{...state, 
        username: action.data.personal.username
      };
    default:
      return state;
  }
}

const initialLoginState = {
  token: null,
  failCount: 0
};
const login = (state=initialLoginState, action) => {
	switch(action.type){
		case 'LOGIN_SUCCESS':
			return{...state,
				token: null,
				failCount: 0
			}
		case 'LOGIN_ERROR':
			return{...state,
				token: null,
				failCount: state.failCount + 1
			}
		default:
			return state;
	}
}


const AppReducer = combineReducers({
  nav,
  auth,
  userData,
  login
});


export default AppReducer;
