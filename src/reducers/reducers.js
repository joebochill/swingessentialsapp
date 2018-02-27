import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigators/AppNavigator';

import {LOGIN, LOGOUT} from '../actions/LoginActions.js';

import {
  GET_LESSONS, 
  GET_CREDITS, 
  PUT_LESSON_RESPONSE,
  PURCHASE_LESSON,
  REDEEM_CREDIT,
  CHECK_COUPON,
  EXECUTE_PAYMENT
} from '../actions/LessonActions.js';



const initialNavState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Login'));

function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    // case 'Login':
    //   nextState = AppNavigator.router.getStateForAction(
    //     NavigationActions.navigate({ routeName: 'Home' }),
    //     state
    //   );
    //   break;
    // case 'Logout':
    //   nextState = AppNavigator.router.getStateForAction(
    //     NavigationActions.navigate({ routeName: 'Login' }),
    //     state
    //   );
    //   break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}

const initialUserState = {
  username: '',
  firstName: '',
  lastName: '',
  email: ''
};

function userData(state = initialUserState, action){
  switch(action.type){
    case LOGIN.SUCCESS:
      return{...state, 
        username: action.data.personal.username
      };
    case LOGOUT.SUCCESS:
      return {...state,
        username: ''
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
		case LOGIN.SUCCESS:
			return{...state,
        token: action.data.token,
        failCount: 0
			};
		case LOGIN.FAIL:
			return{...state,
        token: null,
        failCount: state.failCount+1
      };
    case LOGOUT.SUCCESS:
      return {...state,
        token: null,
        failCount: 0
      };
		default:
			return state;
	}
}

const initialCreditsState = {
  count: 0,
  unlimited: false,
  unlimitedExpires: 0,
  inProgress: false,
  success: false,
  fail: false
};
const credits = (state = initialCreditsState, action) => {
  switch(action.type){
    case GET_CREDITS.SUCCESS:
      return {...state,
        count: parseInt(action.data.count, 10) || 0,
        unlimited: action.data.unlimited_count,
        unlimitedExpires: parseInt(action.data.unlimited_expires, 10) || 0
      };
    case GET_CREDITS.FAIL:
    case LOGOUT.SUCCESS:
      return {...state,
        count: 0,
        unlimited: 0,
        unlimitedExpires: 0
      };
    default:
      return state;
  }
};


const initialLessonsState = {
  loading: false,
  pending:[],
  closed:[],
  redeemPending: false,
  redeemFinished: false,
  redeemSuccess: false,
  newURL: null,
  coupon: {type: '', value: 0}
}
const lessons = (state = initialLessonsState, action) => {
  switch(action.type){
    case GET_LESSONS.SUCCESS:
      return {...state,
        loading: false,
        pending: action.data.pending,
        closed: action.data.closed
      };
    case GET_LESSONS.FAIL:
      return {...state,
        loading: false
      };
    case LOGOUT.SUCCESS:
      return {...state,
        loading: false,
        pending: [],
        closed: []
      };
    default:
      return state;
  }
}

const AppReducer = combineReducers({
  nav,
  userData,
  login,
  credits,
  lessons
});


export default AppReducer;
