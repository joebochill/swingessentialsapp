import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, DrawerNavigator } from 'react-navigation';

import MainScreen from '../components/screens/MainScreen';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import CustomDrawer from '../components/CustomDrawer'; //This is our custom drawer component
import Login from '../components/screens/Login';
import Lessons from '../components/screens/Lessons';
import Logout from '../components/screens/Logout';
import YourLessons from '../components/screens/YourLessons';
import Packages from '../components/screens/Packages';
import Redeem from '../components/screens/Redeem';
import Lesson from '../components/screens/Lesson';
import Help from '../components/screens/Help';
import About from '../components/screens/About';
import Settings from '../components/screens/Settings';
import Setting from '../components/screens/Setting';
import OrderDetails from '../components/screens/OrderDetails';

import { addListener } from '../utils/redux';

export const AppNavigator = DrawerNavigator(
    {
        Login: {
            screen: Login,
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
        Order: {screen: OrderDetails},
        Help: {screen: Help},
        About: {screen: About},
        Logout: {screen: Logout}
    }, 
    {
        initialRouteName: 'Login',
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
