import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigators/AppNavigator';
import {TOKEN_TIMEOUT} from '../actions/actions';
import {LOGIN, LOGOUT, CHECK_TOKEN, REFRESH_TOKEN} from '../actions/LoginActions';

import {
  GET_LESSONS, 
  GET_CREDITS, 
  PURCHASE_LESSON,
  REDEEM_CREDIT,
  CHECK_COUPON,
  EXECUTE_PAYMENT
} from '../actions/LessonActions.js';
import { GET_SETTINGS } from '../actions/UserDataActions';
import { CREATE_ACCOUNT, CHECK_USER, CHECK_EMAIL } from '../actions/RegistrationActions';
import { GET_PACKAGES } from '../actions/PackageActions';

import {atob} from '../utils/base64';


const initialNavState = null;//AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Auth'));

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
  username: ''//,
  //firstName: '',
  //lastName: '',
  //email: ''
};

function userData(state = initialUserState, action){
  switch(action.type){
    case LOGIN.SUCCESS:
      return{...state, 
        username: action.data.personal.username
      };
    case LOGOUT.SUCCESS:
    case TOKEN_TIMEOUT:
      return {...state,
        username: ''
      };
    default:
      return state;
  }
}

const initialLoginState = {
  token: null,
  admin: false,
  modalWarning: false,
  failCount: 0,
  loggedOut: false
};
const login = (state=initialLoginState, action) => {
	switch(action.type){
    case LOGIN.SUCCESS:
    case CREATE_ACCOUNT.SUCCESS:
    case CHECK_TOKEN.SUCCESS:
    case REFRESH_TOKEN.SUCCESS:
      return{...state,
        modalWarning: false,
        loggedOut: false,
        failCount: 0,
        token: action.data.token,
        admin: (JSON.parse(atob(action.data.token.split('.')[1]))['role'].toLowerCase()==='administrator')
			};
		case LOGIN.FAIL:
			return{...state,
        token: null,
        admin: false,
        failCount: state.failCount+1
      };
    case LOGOUT.SUCCESS:
    case TOKEN_TIMEOUT:
      return {...state,
        modalWarning: false,
        loggedOut: true,
        failCount: 0,
        token: null,
        admin: false,
        loginFails: 0
      };
    case 'SHOW_LOGOUT_WARNING':
      return {...state,
        modalWarning: true
      };
    case 'HIDE_LOGOUT_WARNING':
      return {...state,
        modalWarning: false
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
    case TOKEN_TIMEOUT:
      return {...state,
        inProgress: false,
        count: 0,
        unlimited: 0,
        unlimitedExpires: 0
      };
    case EXECUTE_PAYMENT.REQUEST:
			return{...state,
				inProgress: true,
				success: false,
				fail: false
      }
    case EXECUTE_PAYMENT.SUCCESS:
			return{...state,
				inProgress: false,
				success: true,
				fail: false
			}
		case EXECUTE_PAYMENT.FAIL:
			return{...state,
				inProgress: false,
				success: false,
				fail: true
      }
    case 'Navigation/NAVIGATE':
      return {...state,
        success: false,
        fail:false
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
  redeemSuccess: false,
  newURL: null,
  selected: null,
  coupon: {type: '', value: 0, error: ''}
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
    case TOKEN_TIMEOUT:
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
    case CHECK_COUPON.SUCCESS:
			return{...state,
				coupon:{
					code: action.data.code,
					type: action.data.type,
					value: parseFloat(action.data.value),
					error: ''
        }
      }; 
    case CHECK_COUPON.FAIL:
			return{...state,
				coupon:{
					type: '',
					value: 0,
					error: (action.error === 400801) ? "Coupon Code is Expired" : "Invalid Coupon Code"
				}
      }
    case REDEEM_CREDIT.REQUEST:
      return {...state,
        redeemPending: true,
        redeemSuccess: false
      };
    case REDEEM_CREDIT.SUCCESS:
      return {...state,
        redeemPending: false,
        redeemSuccess: true
      };
    case REDEEM_CREDIT.FAIL:
      return {...state,
        redeemPending: false,
        redeemSuccess: false
      };
    case 'Navigation/NAVIGATE':
      return {...state,
        redeemPending: false,
        redeemSuccess: false,
        coupon:{
          type: '',
          value: 0,
          error: ''
        }
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

const initialRegistrationState = {
  pendingRegistration: false,
  userAvailable: true,
  lastUserChecked: '',
  emailAvailable: true,
  lastEmailChecked: '',
  registrationFailure: false
}
const registration = (state = initialRegistrationState, action) => {
  switch(action.type){
    case CREATE_ACCOUNT.SUCCESS:
      return {...state,
        pendingRegistration: false,
        registrationFailure: false
      };
    case CREATE_ACCOUNT.FAIL:
      return {...state,
        registrationFailure: true
      };
    case CHECK_USER.SUCCESS:
			return{...state,
				userAvailable: action.data.available,
				lastUserChecked: action.data.lastChecked
			}
		case CHECK_EMAIL.SUCCESS:
			return{...state,
				emailAvailable: action.data.available,
				lastEmailChecked: action.data.lastChecked
			}
    default:
      return state;
  }
}

const initialPackageState = {
  list: []
}
const packages = (state = initialPackageState, action) => {
  switch(action.type){
		case GET_PACKAGES.SUCCESS:
			return{...state,
				list: action.data
			}
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
  settings,
  registration,
  packages
});


export default AppReducer;
