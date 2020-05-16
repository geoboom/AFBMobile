/**
 * @format
 * @flow
 */

import { createStackNavigator, createAppContainer } from 'react-navigation';
import TripHistoryScreen from './TripHistoryScreen';

const AppNavigator = createStackNavigator({
  TripHistory: {
    screen: TripHistoryScreen,
  },
});

export default createAppContainer(AppNavigator);
