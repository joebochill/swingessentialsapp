import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';
import {scale} from '../styles/dimension';

import CustomDrawer from '../components/CustomDrawer'; //This is our custom drawer component

import Login from '../components/screens/Login';
import Forgot from '../components/screens/Forgot';
import Register from '../components/screens/Register';

import Lessons from '../components/screens/Lessons';
import Lesson from '../components/screens/Lesson';

import Tips from '../components/screens/Tips';
import Tip from '../components/screens/Tip';

import Blogs from '../components/screens/Blogs';
import Blog from '../components/screens/Blog';

import Redeem from '../components/screens/Redeem';
import Order from '../components/screens/Order';
import Record from '../components/screens/Record';

import Help from '../components/screens/Help';
import About from '../components/screens/About';

import Settings from '../components/screens/Settings';
import Setting from '../components/screens/Setting';


import { addListener } from '../utils/redux';

// hideHeader = ({navigationOptions}) => ({header: null});

const AuthNavigator = createStackNavigator({
        Login: Login,
        Forgot: Forgot,
        Register: Register
    },
    {initialRouteName: 'Login', headerMode: 'none'}
);
AuthNavigator.navigationOptions = ({ navigation }) => {
    drawerLockMode = 'locked-closed';  
    return {
      drawerLockMode
    };
  };

const RedeemNav = createStackNavigator(
    {
        Redeem: Redeem,
        Record: {screen: Record, navigationOptions: ({ navigation }) => (
            {drawerLockMode: 'locked-closed', drawerLabel: () => null})
        },
        Settings: {screen: Settings, navigationOptions: ({ navigation }) => (
            {drawerLockMode: 'locked-closed', drawerLabel: () => null})
        },
        Setting: {screen: Setting, navigationOptions: ({ navigation }) => (
            {drawerLockMode: 'locked-closed', drawerLabel: () => null})
        },
        Auth: AuthNavigator
    },
    {initialRouteName: 'Redeem', headerMode: 'none'}
);
RedeemNav.navigationOptions = ({ navigation }) => {
    let drawerLockMode = 'unlocked';
    if (navigation.state.index > 0) {
      drawerLockMode = 'locked-closed';
    }
    return {
      drawerLockMode,
    };
  };

const AppNavigator = createDrawerNavigator(
    {
        Main: {
            screen: createStackNavigator(
                {
                    Lessons: Lessons,
                    Lesson: Lesson,
                    Auth: AuthNavigator
                },
                {initialRouteName: 'Lessons', headerMode: 'none'}
            )
        },
        TipsTop: {
            screen: createStackNavigator(
                {
                    Tips: Tips,
                    Tip: Tip,
                    Auth: AuthNavigator
                },
                {initialRouteName: 'Tips', headerMode: 'none'}
            )
        },
        BlogsTop: {
            screen: createStackNavigator(
                {
                    Blogs: Blogs,
                    Blog: Blog,
                    Auth: AuthNavigator
                },
                {initialRouteName: 'Blogs', headerMode: 'none'}
            )
        },
        OrderTop: {
            screen: createStackNavigator(
                {
                    Order: Order,
                    Auth: AuthNavigator
                },
                {initialRouteName: 'Order', headerMode: 'none'}
            )
        },
        RedeemTop: RedeemNav,
        HelpTop: {
            screen: createStackNavigator(
                {
                    Help: Help,
                    Auth: AuthNavigator
                },
                {initialRouteName: 'Help', headerMode: 'none'}
            )
        },
        AboutTop: {
            screen: createStackNavigator(
                {
                    About: About,
                    Auth: AuthNavigator
                },
                {initialRouteName: 'About', headerMode: 'none'}
            )
        }
    }, 
    {
        initialRouteName: 'Main',
        drawerWidth: scale(280),
        contentComponent: CustomDrawer,
        headerMode: 'none'
    }
);
// class AppWithNavigationState extends React.Component {
//     static propTypes = {
//         dispatch: PropTypes.func.isRequired,
//         nav: PropTypes.object.isRequired
//     };

//     render() {
//         const { dispatch, nav } = this.props;
//         return (
//             <AppNavigator
//                 navigation={addNavigationHelpers({
//                 dispatch,
//                 state: nav,
//                 addListener
//                 })}
//             />
//         );
//     }
// }

const mapStateToProps = state => ({
    nav: state.nav
});

export default connect(mapStateToProps)(createAppContainer(AppNavigator));
