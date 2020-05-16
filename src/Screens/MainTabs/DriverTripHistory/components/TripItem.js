/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import {
  Card,
} from 'react-native-elements';

const styles = StyleSheet.create({
  rootContainerStyle: {
    width: '100%',
    height: 100,
    alignSelf: 'center',
    // paddingRight: 5,
    margin: 0,
    borderBottomWidth: 0.1,
  },
  cardWrapperStyle: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  innerCardColLeftStyle: {
    width: '73%',
    flexDirection: 'column',
  },
  innerCardColMidStyle: {
    width: '15%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerCardColRightStyle: {
    width: '5%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCardRowUpperStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  innerCardRowLowerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});

type Props = {
  trip: Object,
  onPressItem: Function,
};

class TripItem extends Component<Props> {
  _onPress = () => {
    const { onPressItem, trip } = this.props;
    onPressItem(trip);
  };

  render() {
    const { trip } = this.props;
    const { date, tripId, startTime, endTime, duration, passengers, type } = trip;

    return (
      <Card
        containerStyle={styles.cardContainerStyle}
        wrapperStyle={styles.cardWrapperStyle}
      >
        <View
          style={styles.innerCardColLeftStyle}
        >
          <View
            style={styles.innerCardRowUpperStyle}
          >
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <Text
                style={{
                  fontWeight: 'bold',
                }}
              >
                {date} - Trip {tripId}
                {'\n'}
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'normal',
                    color: type === 'Additional' ? '#cc8500' : 'green',
                  }}
                >
                  {type}
                </Text>
              </Text>
            </View>
          </View>
          <View
            style={styles.innerCardRowLowerStyle}
          >
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <Text style={{ fontWeight: 'normal' }}>
                {startTime} - {endTime},
                {' '}
                <Text style={{ fontWeight: 'normal' }}>
                  {duration}
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <View
          style={styles.innerCardColMidStyle}
        >
          <View
            style={{ flex: 1, paddingRight: 5 }}
          >
            <Text
              style={{
                fontSize: 14,
                textAlign: 'right',
              }}
            >
              {passengers}
            </Text>
          </View>
          <Icon
            name="md-people"
            size={30}
            color="#bfbfbf"
          />
        </View>
        {/*<View*/}
          {/*style={styles.innerCardColRightStyle}*/}
        {/*>*/}
          {/*<Icon*/}
            {/*name="ios-arrow-forward"*/}
            {/*size={30}*/}
            {/*color="#bfbfbf"*/}
          {/*/>*/}
        {/*</View>*/}
      </Card>
    );
  }
}

export default TripItem;
{/*<TouchableOpacity onPress={this._onPress}>*/}
{/*</TouchableOpacity>*/}
