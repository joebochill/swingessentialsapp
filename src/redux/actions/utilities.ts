const PREFIX = '@@SE/';

export const createAction = (action, api) => ({
    REQUEST: `${PREFIX}/${action}.REQUEST`,
    SUCCESS: `${PREFIX}/${action}.SUCCESS`,
    FAILURE: `${PREFIX}/${action}.FAILURE`,
    API: api
})