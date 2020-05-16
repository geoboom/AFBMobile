import React, { Component } from 'react';
import {
  StyleSheet, Text, View, FlatList, ActivityIndicator,
} from 'react-native';
import moment from 'moment';

import { BACKEND_IP, ticket } from '../../../constants';
import axiosHelper from '../../../helpers/axiosHelper';
import { withGlobalContext } from '../../../GlobalContext';

const styles = StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  tripListStyle: {
    width: '100%',
  },
  tripListContainerStyle: {
    paddingBottom: 15,
  },
});

const statusColors = {
  [ticket.statuses.REDEEMED]: 'green',
  [ticket.statuses.CANCELLED]: 'grey',
  [ticket.statuses.EXPIRED]: 'violet',
};

class TripHistoryScreen extends Component {
  static navigationOptions = {
    title: 'Ticket History',
    headerStyle: {
      backgroundColor: '#3f51b5',
    },
    headerTitleStyle: {
      color: 'white',
    },
  };

  state = {
    loading: true,
    error: '',
  };

  updateTicketHistory = async () => {
    const { global } = this.props;
    const { updatePassengerTicketHistory, user: { accessToken } } = global;

    try {
      const response = await axiosHelper.request({
        method: 'GET',
        url: `${BACKEND_IP}/api/tickets/my-history`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const { tickets } = response.data;
      updatePassengerTicketHistory(tickets);
      this.setState({
        loading: false,
        error: '',
      });
    } catch (e) {
      this.setState({
        loading: false,
        error: axiosHelper.handleError(e),
      });
    }
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.didFocusSubscription = navigation.addListener('didFocus', this.updateTicketHistory);
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  _renderItem = ({ item: ticket, index: i }) => {
    const {
      status,
      location,
      ticketCode,
      tripNumber,
      tripNumberBoarded,
      tripType,
      queueNumber,
      tripDateString,
      bookedOn,
    } = ticket;

    const mapping = {
      Location: location,
      'Trip Type': tripType,
      'Ticket Code': ticketCode,
      'Queue No.': queueNumber,
      'Trip No.': tripNumber || '-',
      'Trip Boarded': tripNumberBoarded || '-',
      'Trip Date': tripDateString,
      'Date Booked': moment(bookedOn).format('DD/MM/YYYY'),
      'Time Booked': moment(bookedOn).utcOffset('+0800').format('HH:mm:ss'),
    };

    const { global } = this.props;
    const { passengerTicketHistory } = global;

    return (
      <View
        style={{
          borderColor: 'rgba(200,200,200,0.5)',
          borderBottomWidth: i === passengerTicketHistory.length - 1 ? 0 : 1,
          width: '100%',
          backgroundColor: 'white',
          padding: 10,
          paddingTop: 5,
          marginBottom: 0.2,
        }}
      >
        <View
          style={{ paddingBottom: 5 }}
        >
          <Text
            style={{
              fontSize: 18,
              color: statusColors[status],
            }}
          >
            {status}
          </Text>
        </View>
        {
          Object.keys(mapping).map((k, index) => {
            if (index % 2 !== 0) return null;
            const result = [];
            for (let i = index; i < index + 2 && i < Object.keys(mapping).length; i += 1) {
              const key = Object.keys(mapping)[i];
              result.push({
                key,
                value: mapping[key],
              });
            }
            return (
              <View
                key={k}
                style={{ flexDirection: 'row' }}
              >
                {result.map(({ key, value }) => (
                  <View
                    key={key}
                    style={{ flex: 1 }}
                  >
                    <Text
                      style={{ fontSize: 14 }}
                    >
                      <Text
                        style={{ fontWeight: 'bold' }}
                      >
                        {key}{': '}
                      </Text>
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
            );
          })
        }
      </View>
    );
  };

  _keyExtractor = ({ _id }) => _id;

  render() {
    const { loading } = this.state;
    const { global } = this.props;
    const { passengerTicketHistory } = global;

    return (
      <View style={styles.rootContainerStyle}>
        {
          loading
            ? (
              <ActivityIndicator
                size={20}
              />
            ) : (
              passengerTicketHistory
                .filter(({ status }) => status !== ticket.statuses.VALID).length > 0
                ? (
                  <FlatList
                    style={{ width: '100%' }}
                    renderItem={this._renderItem}
                    data={passengerTicketHistory}
                    keyExtractor={this._keyExtractor}
                  />
                ) : (
                  <Text>
                    No past tickets
                  </Text>
                )
            )
        }
      </View>
    );
  }
}

export default withGlobalContext(TripHistoryScreen);
