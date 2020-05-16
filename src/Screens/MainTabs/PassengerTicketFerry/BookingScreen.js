import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ActivityIndicator, ToastAndroid,
} from 'react-native';
import {
  Card, Button, Divider, CheckBox,
} from 'react-native-elements';
import Modal from 'react-native-modal';

import axiosHelper from '../../../helpers/axiosHelper';
import BookingTicketList from './components/BookingTicketList';
import { BACKEND_IP } from '../../../constants';
import { withGlobalContext } from '../../../GlobalContext';

const enumScreenState = {
  ERROR: 'error',
  LOADING: 'loading',
  WAIT: 'wait',
  BOOK: 'book',
  TICKET: 'ticket',
};

const styles = StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    width: '100%',
  },
});

class BookingScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = { currTripDate: '-' } } = navigation.state;

    return ({
      title: `Available Tickets (${params.currTripDate})`,
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#3f51b5',
      },
      headerTitleStyle: {
        color: 'white',
        marginLeft: -3,
      },
    });
  };

  selectTicket = (selected) => {
    this.setState(prevState => ({
      selected: prevState.selected === selected ? null : selected,
    }));
  };

  bookTicketPress = async () => {
    const { selected } = this.state;
    const { navigation, global } = this.props;
    const { params: { updateScreenState } } = navigation.state;
    const { updateTicket, user: { accessToken } } = global;

    this.setState({
      bookTicketLoading: true,
    });
    try {
      const res = await axiosHelper.request({
        method: 'POST',
        url: `${BACKEND_IP}/api/tickets/book`,
        data: {
          tripNumber: selected,
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const { ticket } = res.data;
      updateTicket(ticket);
      updateScreenState(enumScreenState.TICKET);
      this.setState({
        bookTicketLoading: false,
      });
      ToastAndroid.showWithGravityAndOffset(
        'Ticket successfully booked',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        150,
      );
      navigation.goBack();
    } catch (e) {
      this.setState({
        bookTicketError: axiosHelper.handleError(e),
        bookTicketLoading: false,
      });
    }
  };

  refreshTickets = async () => {
    const { selected } = this.state;
    const { global } = this.props;
    const { setAvailableTickets, user: { accessToken } } = global;

    this.setState({
      refreshTicketsLoading: true,
    });
    try {
      const res = await axiosHelper.request({
        method: 'GET',
        url: `${BACKEND_IP}/api/tickets/available`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const { tickets } = res.data;
      setAvailableTickets(tickets);
      const selectedTicket = tickets.find(({ tripNumber }) => tripNumber === selected);
      this.setState({
        selected: (selectedTicket && selectedTicket.canBook) ? selected : null,
        refreshTicketsLoading: false,
      });
    } catch (e) {
      console.log(axiosHelper.handleError(e));
    }
  };

  state = {
    selected: null,
    refreshTicketsError: false,
    refreshTicketsLoading: false,
    bookTicketLoading: false,
    bookTicketError: false,
  };

  render() {
    const { selected, refreshTicketsLoading, bookTicketLoading } = this.state;
    const { global } = this.props;
    const { availableTickets } = global;

    return (
      <View
        style={styles.rootContainerStyle}
      >
        <Modal
          isVisible={refreshTicketsLoading}
          animationIn="fadeIn"
          animationOut="fadeOut"
        >
          <View
            style={{
              alignSelf: 'center',
              width: '70%',
              padding: 12,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{ fontSize: 16, color: 'grey', marginBottom: 8 }}
            >
              Retrieving ticket availability
            </Text>
            <ActivityIndicator size={25} />
          </View>
        </Modal>
        <View
          style={{
            flex: 1,
            width: '100%',
          }}
        >
          <BookingTicketList
            refreshTickets={this.refreshTickets}
            availableTickets={availableTickets}
            selectTicket={this.selectTicket}
            selected={selected}
          />
        </View>
        <View
          style={{
            width: '100%',
            padding: 10,
            backgroundColor: 'white',
            elevation: 10,
          }}
        >
          <Button
            buttonStyle={{
              width: '100%', backgroundColor: 'green',
            }}
            title="BOOK TICKET"
            onPress={this.bookTicketPress}
            raised
            disabled={!selected}
            loading={bookTicketLoading}
          />
        </View>
      </View>
    );
  }
}

export default withGlobalContext(BookingScreen);
