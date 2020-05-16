/**
 * @format
 * @flow
 */
import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { fromRight } from 'react-navigation-transitions';

import TripsCurrentScreen from './TripsCurrentScreen';
import TripDetailsScreen from './TripDetailsScreen';
import ScanTicketScreen from './ScanTicketScreen';

const AppNavigator = createStackNavigator({
  TripsCurrent: {
    screen: TripsCurrentScreen,
  },
  TripDetails: {
    screen: TripDetailsScreen,
  },
  ScanTicket: {
    screen: ScanTicketScreen,
  },
}, {
  transitionConfig: () => fromRight(),
});

export default createAppContainer(AppNavigator);
