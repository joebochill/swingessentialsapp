import test from 'tape';

import { put, call } from 'redux-saga/effects'
import { doLogin } from '../src/redux/sagas';
import { http } from '../src/http';
import * as ACTIONS from '../src/redux/actions';


test('doLogin: invalid login ', (t) => {
  const gen = doLogin({ payload: { username: 'x', password: 'y' } });

  t.deepEqual(
    gen.next().value,
    call(http, {
      action: ACTIONS.LOGIN,
      credentials: {
        username: 'x',
        password: 'y'
      }
    }),
    'should call the login function'
  )

  t.deepEqual(
    gen.next().value,
    put({ type: ACTIONS.LOGIN.FAILURE }),
    'should dispatch FAILURE action'
  )

  t.deepEqual(
    gen.next(),
    { done: true, value: undefined },
    'saga should be DONE'
  )

  t.end()
});