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
import { GET_SETTINGS } from '../actions/UserDataActions';



const initialNavState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Auth'));

function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
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
  inProgress: true,
  success: false,
  fail: false
};
const credits = (state = initialCreditsState, action) => {
  switch(action.type){
    case GET_CREDITS.REQUEST:
      return {...state,
        inProgress: true
      };
    case GET_CREDITS.SUCCESS:
      return {...state,
        inProgress: false,
        count: parseInt(action.data.count, 10) || 0,
        unlimited: action.data.unlimited_count,
        unlimitedExpires: parseInt(action.data.unlimited_expires, 10) || 0
      };
    case GET_CREDITS.FAIL:
    case LOGOUT.SUCCESS:
      return {...state,
        inProgress: false,
        count: 0,
        unlimited: 0,
        unlimitedExpires: 0
      };
    default:
      return state;
  }
};


const initialLessonsState = {
  loading: true,
  pending:[],
  closed:[],
  redeemPending: false,
  redeemFinished: false,
  redeemSuccess: false,
  newURL: null,
  selected: null,
  coupon: {type: '', value: 0}
}
const lessons = (state = initialLessonsState, action) => {
  switch(action.type){
    case GET_LESSONS.REQUEST:
      return {...state,
        loading: true
      };
    case GET_LESSONS.SUCCESS:
      return {...state,
        loading: false,
        pending: action.data.pending,
        closed: action.data.closed
      };
    case GET_LESSONS.FAIL:
      return {...state,
        loading: false,
        selected: null
      };
    case LOGOUT.SUCCESS:
      return {...state,
        loading: false,
        pending: [],
        closed: [],
        selected: null
      };
    case 'SELECT_LESSON':
      return {...state,
        selected: action.data.id
      };
    default:
      return state;
  }
}

const initialSettingsState = {
  duration: 3,
  delay: 0,
  overlay: true,
  handedness: 'Right',
  selected: null
}
const settings = (state = initialSettingsState, action) => {
  switch(action.type){
    case GET_SETTINGS.SUCCESS:
      return {...state,
        delay: action.data.camera.delay,
        duration: action.data.camera.duration,
        overlay: !!action.data.camera.overlay,
        handedness: action.data.handed.charAt(0).toUpperCase() + action.data.handed.toLowerCase().slice(1)
      };
    case 'SELECT_SETTING':
      return {...state,
        selected: action.data.setting
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
  lessons,
  settings
});


export default AppReducer;
