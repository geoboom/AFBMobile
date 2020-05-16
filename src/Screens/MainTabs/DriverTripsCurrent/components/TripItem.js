import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import { withNavigation } from 'react-navigation';

import { trip } from '../../../../constants';

const { estTime, types } = trip;

const styles = StyleSheet.create({
  rootContainerStyle: {
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    height: 75,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(200,200,200,0.5)',
    elevation: 1,
  },
  cardContainerActiveStyle: {
    width: '95%',
    marginTop: 10,
    height: 50,
    alignSelf: 'center',
    backgroundColor: '#ffc14d',
    borderColor: '#ffa500',
  },
  cardWrapperStyle: {
    flexDirection: 'row',
  },
});

const statusColors = {
  [trip.statuses.NOT_STARTED]: 'violet',
  [trip.statuses.IN_PROGRESS]: 'orange',
  [trip.statuses.COMPLETED]: '#8d6e63',
  [trip.statuses.CANCELLED]: 'red',
};

class TripItem extends Component {
  _onPress = () => {
    const { navigation, trip } = this.props;
    navigation.navigate('TripDetails', {
      trip,
    });
  };

  render() {
    const { trip } = this.props;
    const {
      type, tripNumber, status, vehicleId, capacity, passengers, expectedPassengers,
    } = trip;

    return (
      <TouchableOpacity
        style={styles.rootContainerStyle}
        onPress={this._onPress}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{ lineHeight: 20 }}
          >
            <Text
              style={{ fontWeight: 'bold' }}
            >
              Trip#
            </Text>
            {tripNumber}{'\n'}
            <Text
              style={{ fontWeight: 'bold' }}
            >
              Status:{' '}
            </Text>
            <Text style={{ color: statusColors[status] }}>
              {status}{'\n'}
            </Text>
            <Text
              style={{ fontWeight: 'bold' }}
            >
              Vehicle ID:{' '}
            </Text>
            {vehicleId}{'\n'}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{ lineHeight: 20 }}
          >
            <Text
              style={{ fontWeight: 'bold' }}
            >
              Passengers:{' '}
            </Text>
            {passengers.length}/{capacity}{'\n'}
            {
              type === types.SCHEDULED
                ? (
                  <Text
                    style={{ fontWeight: 'bold' }}
                  >
                    Exp. Passengers:{' '}
                    <Text
                      style={{ fontWeight: 'normal' }}
                    >
                      {expectedPassengers.length}{'\n'}
                    </Text>
                  </Text>
                ) : null
            }
            <Text
              style={{ fontWeight: 'bold' }}
            >
              Est. Time:{' '}
            </Text>
            {estTime[tripNumber] || 'After 0800'}{'\n'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(TripItem);
