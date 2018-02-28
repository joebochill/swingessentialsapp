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
import OrderDetails from '../components/screens/OrderDetails';

import { addListener } from '../utils/redux';

// export const AppNavigator2 = StackNavigator(
    //   {
    //     Main: { 
    //       screen: MainScreen,
    //       // path: 'Main',
    //       navigationOptions: {
    //         title: 'SquaTracK',
    //         headerStyle:{
    //           backgroundColor: '#333333'
    //         },
    //         headerTitleStyle:{
    //           //color: 'rgba(255,51,51,1)',
    //           color: 'rgba(255,255,255,0.7)',
    //           fontSize: 22
    //         },
    //         headerLeft: <MaterialIcons name="menu" 
    //                         size={28} 
    //                         style={{ color: 'rgba(255,255,255,0.7)', paddingLeft: 15 }} 
    //                         onPress={ () => alert('menu')}/>,
    //         headerRight: <MaterialIcons name="settings" 
    //                         size={28} 
    //                         style={{ color: 'rgba(255,255,255,0.7)', paddingRight: 15 }} 
    //                         onPress={ () => alert('settings')}/>
    //       }
    //     }
    //   }
    // );

export const AppNavigator = DrawerNavigator(
  {
      Login: {
            screen: Login,
            navigationOptions: true ? {
                drawerLockMode: 'locked-closed',
                drawerLabel: () => null //prevents this element from showing in the drawer if we are logged in
            } : {}
      },
      // Each page that has several pages that you can step through is rendered as a StackNavigator
      // Stack Navigator gives you a header component for free, we inject an icon there to open the drawer
      Main: {
          screen: StackNavigator({
              Lessons: {
                  screen: Lessons,
                  navigationOptions:({ navigation }) => ({
                    //   title: 'Your Lessons',
                      header: () => null
                    //   headerLeft: <MaterialIcons name="move-to-inbox" size={24} style={{ color: '#e91e63' }} onPress={ () => navigation.navigate('DrawerOpen')}/>
                  })
              },
            //   Redeem: {
            //       screen: Redeem,
            //       navigationOptions: ({ navigation }) => ({
            //           title: 'New Lesson',
            //           headerLeft: <MaterialIcons name="move-to-inbox" size={24} style={{ color: '#e91e63' }} onPress={ () => navigation.navigate('DrawerOpen')}/>
            //       })
            //   },
              Lesson: {
                  screen: Lesson,
                  navigationOptions: ({ navigation }) => ({
                    header: () => null
                        //title: '11-07-2017',
                      //headerLeft: <MaterialIcons name="arrow-back" size={24} style={{ color: '#e91e63' }} onPress={ () => navigation.pop()}/>
                  })
              },
              Settings: {
                  screen: Settings,
                  navigationOptions: ({ navigation }) => ({
                    header: () => null
                        //title: '11-07-2017',
                      //headerLeft: <MaterialIcons name="arrow-back" size={24} style={{ color: '#e91e63' }} onPress={ () => navigation.pop()}/>
                  })
              }
          },{
              initialRouteName: 'Lessons',
              contentOptions:{activeTintColor: '#e91e63'}
          }),
          navigationOptions:{
              drawerLabel: 'Your Lessons',
              drawerIcon: <MaterialIcons name="move-to-inbox" size={24} style={{ color: '#e91e63' }}/>
          }  
      },
      Order: {
          screen: StackNavigator({
              Packages: {
                  screen: Packages,
                  navigationOptions:({ navigation }) => ({
                      title: 'Order Lessons',
                      headerLeft: <MaterialIcons name="move-to-inbox" size={24} style={{ color: '#e91e63' }} onPress={ () => navigation.navigate('DrawerOpen')}/>
                  })
              },
              OrderDetails: {
                  screen: OrderDetails,
                  navigationOptions: ({ navigation }) => ({
                      title: 'Order Details',
                      headerLeft: <MaterialIcons name="move-to-inbox" size={24} style={{ color: '#e91e63' }} onPress={ () => navigation.navigate('DrawerOpen')}/>
                  })
              }
          }),
          navigationOptions:{
              drawerLabel: 'Order Lessons',
              drawerIcon: <MaterialIcons name="move-to-inbox" size={24} style={{ color: '#e91e63' }}/>
          }  
      },
      // Solo screens don't get a header by default. We can add them in the Component definition (as I did here), or use the headerMode prop on the top-level Stack Navigator
      Help: {
          screen: Help,
          navigationOptions: {
              drawerLabel: 'Help',
              drawerIcon: <MaterialIcons name="move-to-inbox" size={24} style={{ color: '#e91e63' }}/>
          }
      },
      About: {
          screen: About,
          navigationOptions: {
              drawerLabel: 'About',
              drawerIcon: <MaterialIcons name="move-to-inbox" size={24} style={{ color: '#e91e63' }}/>
          }
      },
      Logout: {
          screen: Logout,
          navigationOptions: {
              drawerLabel: 'Sign Out',
              drawerIcon: <MaterialIcons name="move-to-inbox" size={24} style={{ color: '#e91e63' }}/>
          }
      }
  }, 
  {
      initialRouteName: 'Login',
      contentOptions:{activeTintColor: '#e91e63'},
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
