import { combineReducers } from 'redux';
import { LOGIN } from '../actions';
// import { atob } from '../utils/base64';



const initialLoginState = {
    token: null,
    admin: false,
    modalWarning: false,
    failCount: 0
};
const login = (state = initialLoginState, action) => {
    switch (action.type) {
        case LOGIN.SUCCESS:
            return {
                ...state,
                modalWarning: false,
                failCount: 0,
                token: action.payload.token,
                //admin: (JSON.parse(atob(action.data.token.split('.')[1]))['role'].toLowerCase() === 'administrator')
            };
        case LOGIN.FAILURE:
            return {
                ...state,
                token: null,
                admin: false,
                failCount: state.failCount + 1
            };
        default:
            return state;
    }
}

/* Combine all of the reducers into one */
const AppReducer = combineReducers({
    login
});


export default AppReducer;
