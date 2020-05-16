import React, { Component } from 'react';
import {
  StyleSheet, Text, View, SectionList, TouchableOpacity,
} from 'react-native';
import {
  Button,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

import TripItem from './TripItem';

const styles = StyleSheet.create({
  tripListStyle: {
    width: '100%',
  },
});

class TripItemList extends Component {
  _keyExtractor = item => item._id;

  _renderItem = ({ item }) => {
    const { addAdditionalTrip, additionalLoading } = this.props;

    if (item._id === 'ADD') {
      return (
        <Button
          raised
          containerStyle={{ margin: 10, marginLeft: 30, marginRight: 30 }}
          buttonStyle={{ backgroundColor: 'green' }}
          title="+ ADDITIONAL TRIP"
          onPress={addAdditionalTrip}
          loading={additionalLoading}
        />
      );
    }

    return (
      <TripItem
        trip={item}
      />
    );
  };

  _renderSectionHeader = ({ section: { title } }) => {
    const { additionalPassengers } = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 5,
          width: '100%',
          backgroundColor: '#ff9100',
          elevation: 1,
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            color: 'white',
            fontSize: 15,
          }}
        >
          {title}
        </Text>
        {
          title === 'Additional Trips'
          && (
            <View
              style={{ flexDirection: 'row' }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: 15,
                }}
              >
                {' '}(est. {additionalPassengers}{' '}
              </Text>
              <Icon
                name="people"
                color="white"
                size={20}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: 15,
                }}
              >
                )
              </Text>
            </View>
          )
        }
      </View>
    );
  };

  render() {
    const { driverTripData } = this.props;
    return (
      <SectionList
        extraData={this.props}
        style={styles.tripListStyle}
        sections={driverTripData}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        renderSectionHeader={this._renderSectionHeader}
      />
    );
  }
}

export default TripItemList;
