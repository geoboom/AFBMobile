/**
 * @format
 * @flow
 */
import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { fromRight } from 'react-navigation-transitions';

import TicketScreen from './TicketScreen';
import BookingScreen from './BookingScreen';

const AppNavigator = createStackNavigator({
  TicketFerryMain: {
    screen: TicketScreen,
  },
  TicketFerryBooking: {
    screen: BookingScreen,
  },
}, {
  transitionConfig: () => fromRight(),
});

export default createAppContainer(AppNavigator);
