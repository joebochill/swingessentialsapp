import { 
    createSwitchNavigator, 
    createStackNavigator, 
    createAppContainer 
} from 'react-navigation';

// Import the different pages for the application
import { ROUTES } from '../constants/routes';

// Main Pages
import HomeScreen from '../screens/Home';
import OtherScreen from '../screens/Other';

// Authorization workflow pages
import AuthLoadingScreen from '../screens/AuthLoading';
import SignInScreen from '../screens/SignIn';
// import RegisterScreen, { Verify as VerifyScreen, CreateAccount as CreateAccountScreen } from '../screens/Register';
// import ForgotScreen, { ResetPassword as ResetPasswordScreen} from '../screens/Forgot';

// Application Navigator
const AppStack = createStackNavigator({ 
    [ROUTES.HOME]: HomeScreen, 
    [ROUTES.OTHER]: OtherScreen 
},{initialRouteName: ROUTES.HOME, headerMode: 'none'});

// Authorization Navigator
const AuthStack = createStackNavigator({ 
    [ROUTES.SIGN_IN]: SignInScreen, 
    // [ROUTES.REGISTER]: RegisterScreen, 
    // [ROUTES.VERIFY]: VerifyScreen,
    // [ROUTES.CREATE_ACCOUNT]: CreateAccountScreen,
    // [ROUTES.FORGOT]: ForgotScreen,
    // [ROUTES.RESET_PASSWORD]: ResetPasswordScreen
},{initialRouteName: ROUTES.SIGN_IN, headerMode: 'none'});

export default createAppContainer(createSwitchNavigator(
  {
    [ROUTES.AUTH_LOADING]: AuthLoadingScreen,
    [ROUTES.APP]: AppStack,
    [ROUTES.AUTH]: AuthStack,
  },
  {
    initialRouteName: ROUTES.AUTH_LOADING,
  }
));