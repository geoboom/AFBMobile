import React, { Component } from 'react';
import { StatusBar, YellowBox, AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation';
import io from 'socket.io-client';

import { BACKEND_IP, trip } from './constants';
import axiosHelper from './helpers/axiosHelper';

const GlobalContext = React.createContext({});

const addAdditionalTrip = {
  _id: 'ADD',
};

const extractTrip = (trips, type) => {
  const data = trips
    .filter(({ type: thisType }) => thisType === type)
    .sort(({ tripNumber: tn1 }, { tripNumber: tn2 }) => tn1 - tn2);

  return ({
    type,
    title: `${type} Trips`,
    data: type === trip.types.ADDITIONAL ? [...data, addAdditionalTrip] : data,
  });
};

console.ignoredYellowBox = ['Remote Debugger'];
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
]);

class GlobalContextProvider extends Component {
  updateAdditionalPassengers = async () => {
    const { user: { accessToken } } = this.state;

    try {
      const response = await axiosHelper.request({
        method: 'GET',
        url: `${BACKEND_IP}/api/trips/additional-passengers`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const { additionalPassengers } = response.data;
      this.setState({
        additionalPassengers,
      });
    } catch (e) {
      console.log(e);
    }
  };

  updateAccessToken = (accessToken) => {
    this.setState(prevState => ({
      user: {
        ...prevState.user,
        accessToken,
      },
    }));
  };

  updateUser = async (user) => {
    this.setState({ user });
    try {
      const { accessToken } = user;
      await AsyncStorage.setItem('accessToken', accessToken);
    } catch (e) {
      console.log(e);
    }
  };

  updateTicket = (ticket) => {
    this.setState({ ticket });
  };

  setAvailableTickets = (availableTickets) => {
    const scheduledData = [];
    const additionalData = [];
    if (availableTickets.length === 0) {
      this.setState({
        availableTickets,
      });
    } else {
      availableTickets.forEach((ticket) => {
        const { tripNumber } = ticket;
        if (tripNumber === trip.types.ADDITIONAL) additionalData.push(ticket);
        else scheduledData.push(ticket);
      });
      this.setState({
        availableTickets: [
          {
            type: trip.types.SCHEDULED,
            title: `${trip.types.SCHEDULED} Trips`,
            data: scheduledData,
          },
          {
            type: trip.types.ADDITIONAL,
            title: `${trip.types.ADDITIONAL} Trips`,
            data: additionalData,
          },
        ],
      });
    }
  };

  updateDriverTripData = (trips) => {
    const driverTripData = [
      extractTrip(trips, trip.types.SCHEDULED),
      extractTrip(trips, trip.types.ADDITIONAL),
    ];

    driverTripData
      .sort(({ type: type1 }, { type: type2 }) => trip.typeWeight[type1] - trip.typeWeight[type2]);

    this.setState({
      driverTripData,
    });
    this.updateAdditionalPassengers();
  };

  setCurrTripDate = async () => {
    const { user: { accessToken } } = this.state;
    const response = await axiosHelper.request({
      method: 'GET',
      url: `${BACKEND_IP}/api/trips/current-date`,
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    });
    const { currTripDate } = response.data;
    this.setState({
      currTripDate,
    });
    return currTripDate;
  };

  updatePassengerTicketHistory = (tickets) => {
    this.setState({
      passengerTicketHistory: tickets
        .sort(({ bookedOn: a }, { bookedOn: b }) => new Date(b) - new Date(a)),
    });
  };

  updateDriverTripHistory = (trips) => {
    this.setState({
      driverTripHistory: trips
        .sort(({ tripEnd: a }, { tripEnd: b }) => new Date(b) - new Date(a)),
    });
  };

  initSocket = () => {
    const { user: { accessToken } } = this.state;
    const socket = io(`${BACKEND_IP}?accessToken=${accessToken}`);
    this.setState({
      socket,
    });
  };

  closeSocket = () => {
    const { socket } = this.state;
    if (socket) socket.close();
    this.setState({
      socket: null,
    });
  };

  bootstrapAsync = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) return null;
      const response = await axiosHelper.request({
        method: 'POST',
        url: `${BACKEND_IP}/api/auth/verify-token`,
        data: {
          accessToken,
        },
      });
      const { user } = response.data;
      await this.updateUser(user);
      this.initSocket();
      return user;
    } catch (e) {
      return null;
    }
  };

  signoutUser = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
    } catch (e) {
      console.log(e);
    }
  };

  state = {
    user: {
      firstName: '',
      lastName: '',
      accessToken: '',
      userId: '',
      username: '',
      group: '',
      lastSuccessfulLogin: '',
      signupTimestamp: '',
    },
    socket: null,
    errorMessage: '',
    currTripDate: '-',
    driverTripData: [],
    additionalPassengers: 0,
    ticket: {},
    driverTripHistory: [],
    passengerTicketHistory: [],
    availableTickets: [],
    initSocket: this.initSocket,
    closeSocket: this.closeSocket,
    updateDriverTripHistory: this.updateDriverTripHistory,
    updatePassengerTicketHistory: this.updatePassengerTicketHistory,
    setAvailableTickets: this.setAvailableTickets,
    setCurrTripDate: this.setCurrTripDate,
    updateAccessToken: this.updateAccessToken,
    updateTicket: this.updateTicket,
    updateUser: this.updateUser,
    updateDriverTripData: this.updateDriverTripData,
    bootstrapAsync: this.bootstrapAsync,
    signoutUser: this.signoutUser,
  };

  componentDidMount() {
    StatusBar.setBackgroundColor('#303f9f');
    // if accessToken valid
  }

  render() {
    const { children } = this.props;
    return (
      <GlobalContext.Provider
        value={this.state}
      >
        {children}
      </GlobalContext.Provider>
    );
  }
}

function withGlobalContext(ChildComponent) {
  const Enhance = props => (
    <GlobalContext.Consumer>
      {
        context => <ChildComponent {...props} global={context} />
      }
    </GlobalContext.Consumer>
  );

  Enhance.navigationOptions = ChildComponent.navigationOptions;
  return Enhance;
}

export {
  GlobalContext,
  GlobalContextProvider,
  withGlobalContext,
};
