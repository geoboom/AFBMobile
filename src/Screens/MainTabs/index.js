import React, { Component } from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import FIcon from 'react-native-vector-icons/dist/FontAwesome';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import IIcon from 'react-native-vector-icons/dist/Ionicons';
import DriverTripHistory from './DriverTripHistory';
import DriverTripsCurrent from './DriverTripsCurrent';
import PassengerTripHistory from './PassengerTripHistory';
import PassengerTicketFerry from './PassengerTicketFerry';
import MyAccountScreen from './MyAccountScreen';

const AppNavigatorDriver = createBottomTabNavigator({
  DriverTripsCurrent: {
    screen: DriverTripsCurrent,
    navigationOptions: {
      tabBarLabel: 'Trips to Make',
      tabBarIcon: ({ tintColor }) => (
        <IIcon
          color={tintColor}
          name="md-car"
          size={25}
          style={{ marginBottom: -5 }}
        />
      ),
    },
  },
  DriverTripHistory: {
    screen: DriverTripHistory,
    navigationOptions: {
      tabBarLabel: 'Trip History',
      tabBarIcon: ({ tintColor }) => (
        <IIcon
          color={tintColor}
          name="md-clipboard"
          size={22}
          style={{ marginBottom: 0 }}
        />
      ),
    },
  },
  MyAccount: {
    screen: MyAccountScreen,
    navigationOptions: {
      tabBarLabel: 'My Account',
      tabBarIcon: ({ tintColor }) => (
        <IIcon
          color={tintColor}
          name="md-person"
          size={24}
          style={{ marginBottom: -1 }}
        />
      ),
    },
  },
}, {
  initialRouteName: 'DriverTripsCurrent',
  tabBarOptions: {
    activeTintColor: 'blue',
  },
});

const AppNavigatorPassenger = createBottomTabNavigator({
  TicketFerry: {
    screen: PassengerTicketFerry,
    navigationOptions: {
      tabBarLabel: 'My Ticket',
      tabBarIcon: ({ tintColor }) => (
        <FIcon
          color={tintColor}
          name="ticket"
          size={23}
          style={{ marginBottom: -5 }}
        />
      ),
    },
  },
  PassengerTripHistory: {
    screen: PassengerTripHistory,
    navigationOptions: {
      tabBarLabel: 'Past Tickets',
      tabBarIcon: ({ tintColor }) => (
        <Icon
          color={tintColor}
          name="clipboard-list"
          size={22}
          style={{ marginBottom: 0 }}
        />
      ),
    },
  },
  MyAccount: {
    screen: MyAccountScreen,
    navigationOptions: {
      tabBarLabel: 'My Account',
      tabBarIcon: ({ tintColor }) => (
        <IIcon
          color={tintColor}
          name="md-person"
          size={27}
          style={{ marginBottom: -1 }}
        />
      ),
    },
  },
}, {
  initialRouteName: 'TicketFerry',
  tabBarOptions: {
    activeTintColor: 'blue',
  },
});

const MainTabs = {
  Driver: createAppContainer(AppNavigatorDriver),
  Passenger: createAppContainer(AppNavigatorPassenger),
};

export default MainTabs;
