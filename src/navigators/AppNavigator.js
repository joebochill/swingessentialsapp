import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, DrawerNavigator } from 'react-navigation';

import CustomDrawer from '../components/CustomDrawer'; //This is our custom drawer component

import Login from '../components/screens/Login';
import Forgot from '../components/screens/Forgot';
import Register from '../components/screens/Register';

import Lessons from '../components/screens/Lessons';
import Lesson from '../components/screens/Lesson';

import Redeem from '../components/screens/Redeem';
import Order from '../components/screens/Order';

import Help from '../components/screens/Help';
import About from '../components/screens/About';

import Settings from '../components/screens/Settings';
import Setting from '../components/screens/Setting';


import { addListener } from '../utils/redux';

export const AppNavigator = DrawerNavigator(
    {
        Auth: {
            screen: StackNavigator(
                {
                    Login: {screen: Login, navigationOptions: ({ navigation }) => ({header: () => null})},
                    Forgot: {screen: Forgot, navigationOptions: ({ navigation }) => ({header: () => null})},
                    Register: {screen: Register, navigationOptions: ({ navigation }) => ({header: () => null})}
                },
                {initialRouteName: 'Login'}
            ),
            //screen: Login,
            navigationOptions: {
                drawerLockMode: 'locked-closed',
                drawerLabel: () => null
            }
        },
        Main: {
            screen: StackNavigator(
                {
                    Lessons: {screen: Lessons, navigationOptions: ({ navigation }) => ({header: () => null})},
                    Lesson: {screen: Lesson, navigationOptions: ({ navigation }) => ({header: () => null})},
                    Settings: {screen: Settings, navigationOptions: ({ navigation }) => ({header: () => null})},
                    Setting: {screen: Setting, navigationOptions: ({ navigation }) => ({header: () => null})}
                },
                {initialRouteName: 'Lessons'}
            )
        },
        Order: {screen: Order},
        Redeem: {screen: Redeem},
        Help: {screen: Help},
        About: {screen: About}
    }, 
    {
        initialRouteName: 'Main',
        contentComponent: CustomDrawer
    }
);

class AppWithNavigationState extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        nav: PropTypes.object.isRequired
    };

    render() {
        const { dispatch, nav } = this.props;
        return (
            <AppNavigator
                navigation={addNavigationHelpers({
                dispatch,
                state: nav,
                addListener
                })}
            />
        );
    }
}

const mapStateToProps = state => ({
  nav: state.nav
});

export default connect(mapStateToProps)(AppWithNavigationState);
