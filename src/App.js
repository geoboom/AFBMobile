import React from 'react';
import {
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation';

import SplashScreen from './Screens/SplashScreen';
import LoginRegister from './Screens/LoginRegister';
import MainTabs from './Screens/MainTabs';
import { GlobalContextProvider } from './GlobalContext';

const AppNavigator = createSwitchNavigator(
  {
    Splash: {
      screen: SplashScreen,
    },
    LoginRegister: {
      screen: LoginRegister,
    },
    MainTabsDriver: MainTabs.Driver,
    MainTabsPassenger: MainTabs.Passenger,
  },
  {
    initialRouteName: 'Splash',
    // initialRouteName: 'LoginRegister',
    // initialRouteName: 'MainTabsDriver',
    // initialRouteName: 'MainTabsPassenger',
  },
);

const AppContainer = createAppContainer(AppNavigator);

const App = () => <GlobalContextProvider><AppContainer /></GlobalContextProvider>;

export default App;
