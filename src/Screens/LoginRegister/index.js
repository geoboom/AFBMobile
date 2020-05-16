/**
 * @format
 * @flow
 */

import { createStackNavigator, createAppContainer } from 'react-navigation';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

const AppNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
}, {
  headerMode: 'none',
});

export default createAppContainer(AppNavigator);
