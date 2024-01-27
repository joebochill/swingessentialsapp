const PREFIX = '@@SE/';

type ActionType = {
    REQUEST: string;
    SUCCESS: string;
    FAILURE: string;
    API: string;
};
export const createAction = (action: string, api: string): ActionType => ({
    REQUEST: `${PREFIX}/${action}.REQUEST`,
    SUCCESS: `${PREFIX}/${action}.SUCCESS`,
    FAILURE: `${PREFIX}/${action}.FAILURE`,
    API: api,
});
