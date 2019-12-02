import { ThunkDispatch } from 'redux-thunk';
import * as ACTIONS from './types';
import { loadTips } from './TipActions';
import { loadBlogs } from './BlogActions';
import { loadPackages } from './PackageActions';

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

export function loadInitialData() {
    return (dispatch: ThunkDispatch<any, void, any>) => {
        dispatch({ type: ACTIONS.INITIAL_LOAD });
        dispatch(loadTips());
        dispatch(loadBlogs());
        dispatch(loadPackages());
    }
}