/* Constants */
export const SET_TARGET_ROUTE = 'SET_TARGET_ROUTE';
export const MENU = {OPEN: 'OPEN_MENU', CLOSE: 'CLOSE_MENU'}; 
export const DRAWER = {OPEN: 'OPEN_DRAWER', CLOSE: 'CLOSE_DRAWER'}; 


/* Navigation and Menu Actions */
export function openNavMenu(){
    return{
        type: MENU.OPEN
    }
}
export function openNavDrawer(){
    return{
        type: DRAWER.OPEN
    }
}
export function closeNavMenu(){
    return{
        type: MENU.CLOSE
    }
}
export function closeNavDrawer(){
    return{
        type: DRAWER.CLOSE
    }
}
export function setTargetRoute(route){
    return{
        type: SET_TARGET_ROUTE,
        route: route
    }
}