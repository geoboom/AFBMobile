import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ToastAndroid, AppState,
} from 'react-native';
import FA5Icon from 'react-native-vector-icons/dist/FontAwesome5';
import Modal from 'react-native-modal';

import Ticket from './components/Ticket';
import { BACKEND_IP, ticket, socketRoutes } from '../../../constants';
import axiosHelper from '../../../helpers/axiosHelper';
import { withGlobalContext } from '../../../GlobalContext';

const {
  TICKET_APPROVE,
  TRIPS_INITIALIZE,
  TRIP_START,
  TRIP_END,
} = socketRoutes;

const enumScreenState = {
  ERROR: 'error',
  LOADING: 'loading',
  WAIT: 'wait',
  BOOK: 'book',
  TICKET: 'ticket',
  BOOKED: 'booked',
};

const styles = StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
});

const RenderScreen = ({
  screenState,
  errorMessage,
  user,
  ticket,
  cancelTicket,
  updateTicket,
  goBookTickets,
  currTripDate,
  currTrip,
}) => {
  switch (screenState) {
    case enumScreenState.ERROR:
      return (
        <View>
          <Text
            style={{
              color: 'red',
              textAlign: 'center',
            }}
          >
            Error: {errorMessage}
          </Text>
        </View>
      );
    case enumScreenState.LOADING:
      return (
        <ActivityIndicator />
      );
    case enumScreenState.BOOK:
      return (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <TouchableOpacity
            style={{
              height: 180,
              width: 180,
              borderRadius: 180,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 10,
            }}
            onPress={goBookTickets}
          >
            <View
              style={{
                height: 180,
                width: 180,
                borderRadius: 180,
                backgroundColor: 'orange',
                justifyContent: 'center',
                padding: 20,
              }}
            >
              <Text
                style={{ fontSize: 23, textAlign: 'center', color: 'white' }}
              >
                BOOK TICKET FOR{'\n'}
                <Text
                  style={{ fontWeight: 'bold' }}
                >
                  {currTripDate}
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    case enumScreenState.TICKET:
      return (
        <Ticket
          currTrip={currTrip}
          user={user}
          ticket={ticket}
          cancelTicket={cancelTicket}
        />
      );
    case enumScreenState.WAIT:
      return (
        <View>
          <Text>
            Bookings not open yet.
          </Text>
        </View>
      );
    case enumScreenState.BOOKED:
      return (
        <View>
          <Text>
            You have already redeemed a ticket for {currTripDate}.
          </Text>
        </View>
      );
    default:
      return <View><Text style={{ fontColor: 'red' }}>Error</Text></View>;
  }
};

const HeaderRight = ({ currTrip }) => (
  <View
    style={{ padding: 10 }}
  >
    {
      currTrip ? (
        <Text
          style={{ color: 'white', textAlign: 'center' }}
        >
          <FA5Icon
            size={20}
            name="shuttle-van"
          />
          {'\n'}
          Trip#{currTrip}
        </Text>
      ) : null
    }
  </View>
);

class TicketScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = { currTrip: null } } = navigation.state;

    return ({
      title: 'ADOC Ferry Booking',
      headerRight: <HeaderRight currTrip={params.currTrip} />,
      headerStyle: {
        backgroundColor: '#3f51b5',
      },
      headerTitleStyle: {
        color: 'white',
      },
    });
  };

  cancelTicket = async () => {
    const { global } = this.props;
    const { updateTicket, user: { accessToken }} = global;

    this.setState({ modal: true });
    try {
      const res = await axiosHelper.request({
        method: 'DELETE',
        url: `${BACKEND_IP}/api/tickets/my-ticket`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      this.setState({
        screenState: enumScreenState.BOOK,
      });
      updateTicket({});
      this.setState({ modal: false });
    } catch (e) {
      console.log(e);
      this.setState({ modal: false });
    }
  };

  goBookTickets = () => {
    const { navigation, global } = this.props;
    const {
      currTripDate,
    } = global;

    navigation.navigate('TicketFerryBooking', {
      updateScreenState: this.updateScreenState,
      currTripDate,
    });
  };

  bootstrapTickets = async () => {
    const { global } = this.props;
    const {
      setAvailableTickets, user: { accessToken },
    } = global;

    try {
      const res = await axiosHelper.request({
        method: 'GET',
        url: `${BACKEND_IP}/api/tickets/available`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const { tickets: availableTickets } = res.data;
      setAvailableTickets(availableTickets);
      return availableTickets.length;
    } catch (e) {
      throw e;
    }
  };

  bootstrapState = async () => {
    const { global, navigation } = this.props;
    const {
      updateTicket, setCurrTripDate, user: { accessToken },
    } = global;

    try {
      const res0 = await axiosHelper.request({
        method: 'GET',
        url: `${BACKEND_IP}/api/trips/active`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const { currTrip } = res0.data;
      this.setState({ currTrip });
      navigation.setParams({ currTrip });

      setCurrTripDate();
      const res1 = await axiosHelper.request({
        method: 'GET',
        url: `${BACKEND_IP}/api/tickets/my-active`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const { ticket: currTicket } = res1.data;
      updateTicket(currTicket);
      const availableTicketsLength = await this.bootstrapTickets();

      if (currTicket) {
        this.setState({
          screenState: currTicket.status === ticket.statuses.VALID
            ? enumScreenState.TICKET : enumScreenState.BOOKED,
        });
      } else if (availableTicketsLength > 0) {
        this.setState({
          screenState: enumScreenState.BOOK,
        });
      } else {
        this.setState({
          screenState: enumScreenState.WAIT,
        });
      }
    } catch (e) {
      this.setState({
        screenState: enumScreenState.ERROR,
        errorMessage: axiosHelper.handleError(e),
      });
    }
  };

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.bootstrapState();
    }
    this.setState({ appState: nextAppState });
  };

  async componentDidMount() {
    const { global, navigation } = this.props;
    const { socket } = global;
    this.didFocusSubscription = navigation.addListener('didFocus', this.bootstrapState);
    AppState.addEventListener('change', this.handleAppStateChange);

    if (socket) {
      socket.on(TRIP_START, ({ currTrip }) => {
        this.bootstrapTickets();
        this.setState({
          currTrip,
        });
        navigation.setParams({
          currTrip,
        });
        ToastAndroid.showWithGravityAndOffset(
          `Trip#${currTrip} in progress`,
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          0,
          150,
        );
      });
      socket.on(TRIP_END, () => {
        this.bootstrapTickets();
        this.setState({
          currTrip: null,
        });
        navigation.setParams({
          currTrip: null,
        });
      });
      socket.on(TRIPS_INITIALIZE, () => {
        this.bootstrapState();
        ToastAndroid.showWithGravityAndOffset(
          'Bookings open!',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          150,
        );
      });
      socket.on(TICKET_APPROVE, () => {
        this.bootstrapState();
        ToastAndroid.showWithGravityAndOffset(
          'Ticket redeemed',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          150,
        );
      });
    }
    this.bootstrapState();
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  updateScreenState = (screenState) => {
    this.setState({
      screenState,
    });
  };

  state = {
    errorMessage: '',
    appState: AppState.currentState,
    screenState: enumScreenState.LOADING,
    modal: false,
    currTrip: null,
  };

  render() {
    const { screenState, errorMessage, currTrip, modal } = this.state;
    const { global } = this.props;
    const {
      ticket, availableTickets, currTripDate, updateTicket, user,
    } = global;

    return (
      <View style={styles.rootContainerStyle}>
        <Modal
          isVisible={modal}
          animationIn="fadeIn"
          animationOut="fadeOut"
        >
          <View
            style={{
              alignSelf: 'center',
              width: '50%',
              padding: 12,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{ fontSize: 16, color: 'grey', marginBottom: 8 }}
            >
              Cancelling ticket
            </Text>
            <ActivityIndicator size={25} />
          </View>
        </Modal>
        <RenderScreen
          cancelTicket={this.cancelTicket}
          goBookTickets={this.goBookTickets}
          screenState={screenState}
          errorMessage={errorMessage}
          user={user}
          ticket={ticket}
          updateTicket={updateTicket}
          availableTickets={availableTickets}
          currTripDate={currTripDate}
          currTrip={currTrip}
        />
      </View>
    );
  }
}

export default withGlobalContext(TicketScreen);
