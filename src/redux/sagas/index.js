import { put, take, takeEvery, takeLatest, all, call, apply } from 'redux-saga/effects';
import * as ACTIONS from '../actions';
import { http } from '../../http';

function* onLogin() {
    const action = yield takeLatest(ACTIONS.LOGIN.REQUEST, 
        function* doLogin(action){
            try {
                const result = yield call(http, {
                    action: ACTIONS.LOGIN,
                    credentials: {
                        username: action.payload.username, 
                        password: action.payload.password
                    }
                });  
                if(result.status === 200){
                    const data = yield apply(result, result.json);
                    yield put({
                        type: ACTIONS.LOGIN.SUCCESS, 
                        payload: {
                            ...data, 
                            token: result.headers.get('Token')
                        }
                    });
                }
                else{
                    yield put({type: ACTIONS.LOGIN.FAILURE});
                }
                           
            } catch (e) {
                yield put({type: ACTIONS.LOGIN.FAILURE});
                return;
            }
        }
    );
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
    yield all([
        onLogin()
    ])
}