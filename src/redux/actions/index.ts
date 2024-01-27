import { createAction } from "@reduxjs/toolkit";

export const logoutSuccess = createAction('LOGOUT.SUCCESS');
export const logoutFailure = createAction('LOGOUT.FAILURE');
export const tokenTimeout = createAction('TOKEN_TIMEOUT');
