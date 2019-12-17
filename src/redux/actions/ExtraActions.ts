import { ThunkDispatch } from 'redux-thunk';
import * as ACTIONS from './types';
import { loadTips } from './TipActions';
import { loadBlogs } from './BlogActions';
import { loadPackages } from './PackageActions';
import { loadFAQ } from './FAQActions';
import AsyncStorage from '@react-native-community/async-storage';
import { ASYNC_PREFIX } from '../../constants';
import { setToken } from './LoginActions';

// TODO: Remove the Albatross Package from everything
// TODO: Implement Splashscreen
// TODO: Add the correct app icons
// TODO: Load initial data from AsyncStorage
// TODO: Implement pull to refresh (home, lessons, tips, blogs, packages)
// TODO: Implement deep linking (lessons, register, other?)
// TODO: Implement APP PERMISSIONS
// TODO: Implement requesting app permissions on Android
// TODO: Remove unused fonts
// TODO: Implement App banners on web
// TODO: Implement Tutorials

export function loadInitialData(): Function {
    return async (dispatch: ThunkDispatch<any, void, any>) => {
        const token = await AsyncStorage.getItem(ASYNC_PREFIX + 'token');
        if(token) dispatch(setToken(token));
        // loadTutorials(store.dispatch); //TODO

        dispatch({ type: ACTIONS.INITIAL_LOAD });
        dispatch(loadTips());
        dispatch(loadBlogs());
        dispatch(loadPackages());
        dispatch(loadFAQ());
    };
}
