const PREFIX = '@@SE/';

export const createAction = (action: string, api: string) => ({
    REQUEST: `${PREFIX}/${action}.REQUEST`,
    SUCCESS: `${PREFIX}/${action}.SUCCESS`,
    FAILURE: `${PREFIX}/${action}.FAILURE`,
    API: api,
});
