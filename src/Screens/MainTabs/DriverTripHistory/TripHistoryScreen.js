import moment from 'moment';
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, FlatList, ActivityIndicator,
} from 'react-native';

import { withGlobalContext } from '../../../GlobalContext';
import axiosHelper from '../../../helpers/axiosHelper';
import { BACKEND_IP } from '../../../constants';

const styles = StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
});

class TripHistoryScreen extends Component {
  static navigationOptions = {
    title: 'Trip History',
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

  _keyExtractor = item => item._id;

  _renderItem = ({ item: trip, index: i }) => {
    const {
      location,
      tripNumber,
      tripStart,
      tripEnd,
      tripDate,
      type,
      vehicleId,
      capacity,
      passengers,
    } = trip;
    const { global } = this.props;
    const { driverTripHistory } = global;

    const mapping = {
      Location: location,
      'Trip Number': tripNumber,
      Start: moment(tripStart).utcOffset('+0800').format('HH:mm:ss'),
      'Trip Date': moment(tripDate).format('DD/MM/YYYY'),
      End: moment(tripEnd).utcOffset('+0800').format('HH:mm:ss'),
      'Trip Type': type,
      'Vehicle ID': vehicleId,
      Passengers: `${passengers.length}/${capacity}`,
    };

    return (
      <View
        style={{
          borderColor: 'rgba(200,200,200,0.5)',
          borderBottomWidth: i === driverTripHistory.length - 1 ? 0 : 1,
          width: '100%',
          backgroundColor: 'white',
          padding: 10,
          paddingTop: 5,
          marginBottom: 0.2,
        }}
      >
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

  updateTripHistory = async () => {
    const { global } = this.props;
    const { updateDriverTripHistory, user: { accessToken } } = global;

    try {
      const response = await axiosHelper.request({
        method: 'GET',
        url: `${BACKEND_IP}/api/trips/my-history`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const { trips } = response.data;
      updateDriverTripHistory(trips);
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
    this.didFocusSubscription = navigation.addListener('didFocus', this.updateTripHistory);
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  render() {
    const { loading } = this.state;
    const { global } = this.props;
    const { driverTripHistory } = global;

    return (
      <View style={styles.rootContainerStyle}>
        {
          loading
            ? (
              <ActivityIndicator
                size={20}
              />
            ) : (
              driverTripHistory.length > 0
                ? (
                  <FlatList
                    style={{ width: '100%' }}
                    renderItem={this._renderItem}
                    data={driverTripHistory}
                    keyExtractor={this._keyExtractor}
                  />
                ) : (
                  <Text>
                    No past trips
                  </Text>
                )
            )
        }
      </View>
    );
  }
}

export default withGlobalContext(TripHistoryScreen);

{ /* <FlatList */ }
{ /* style={styles.tripListStyle} */ }
{ /* contentContainerStyle={styles.tripListContainerStyle} */ }
{ /* data={data} */ }
{ /* extraData={data} */ }
{ /* keyExtractor={this._keyExtractor} */ }
{ /* renderItem={this._renderItem} */ }
{ /* /> */ }
