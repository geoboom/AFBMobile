import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity, Dimensions, Alert,
} from 'react-native';
import {
  Tooltip
} from 'react-native-elements';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import QRCode from 'react-native-qrcode-svg';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  trip,
} from '../../../../constants';

class Ticket extends Component {
  state = {};

  cancelTicketPress = () => {
    const { cancelTicket } = this.props;

    Alert.alert(
      'Cancel Ticket Confirmation',
      'Are you sure you wish to cancel your ticket?',
      [
        {
          text: 'Yes', onPress: cancelTicket,
        },
        {
          text: 'No', onPress: () => {},
        },
      ],
    );
  };

  render() {
    const {
      ticket, user, currTrip,
    } = this.props;
    const {
      ticketCode, tripNumber, tripType, queueNumber, tripDateString, bookedOn,
    } = ticket;
    const { username } = user;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          padding: 10,
          paddingBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row', width: '100%', justifyContent: 'center',
          }}
        >
          <View
            style={{ flex: 1 }}
          >
            <Icon
              onPress={this.cancelTicketPress}
              name="md-close"
              size={25}
            />
          </View>
          <Text
            style={{
              flex: 4,
              textAlign: 'center',
              fontSize: 24,
              borderBottomWidth: 0,
              marginBottom: 10,
            }}
          >
            Ticket for{'\n'}
            <Text
              style={{ fontWeight: 'bold', fontSize: 26 }}
            >
              {
                tripType === trip.types.ADDITIONAL
                  ? 'Additional Trips' : `Trip#${tripNumber}`
              }
            </Text>
          </Text>
          <View style={{ flex: 1 }} />
        </View>
        <View
          style={{
            padding: 5,
            borderWidth: currTrip === tripNumber ? 3.0 : 0,
            borderColor: 'orange',
          }}
        >
          <QRCode
            value={ticketCode.toString()}
            size={40 + 200 * (Dimensions.get('window').height / 592)}
          />
        </View>
        <Text
          style={{ textAlign: 'center', marginBottom: 10, fontSize: 12 }}
        >
          <Text
            style={{ fontWeight: 'bold' }}
          >
            Ticket Code:{' '}
          </Text>
          {ticketCode}
          {'   '}
          <Text
            style={{ fontWeight: 'bold' }}
          >
            Queue No.:{' '}
          </Text>
          {queueNumber}
        </Text>
        <View>
          <View
            style={{
              width: '75%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{ flex: 1.4, fontSize: 16 }}
            >
              <Text
                style={{ fontWeight: 'bold', fontSize: 18 }}
              >
                Owner{'\n'}
              </Text>
              {username}
            </Text>
            <Text
              style={{ flex: 1, fontSize: 16 }}
            >
              <Text
                style={{ fontWeight: 'bold', fontSize: 18 }}
              >
                Valid On{'\n'}
              </Text>
              {tripDateString}
            </Text>
          </View>
          <View
            style={{
              width: '75%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{ flex: 1.4, fontSize: 16 }}
            >
              <Text
                style={{ fontWeight: 'bold', fontSize: 18 }}
              >
                Date Booked{'\n'}
              </Text>
              {moment(bookedOn).format('DD/MM/YYYY')}
            </Text>
            <Text
              style={{ flex: 1, fontSize: 16 }}
            >
              <Text
                style={{ fontWeight: 'bold', fontSize: 18 }}
              >
                Time Booked{'\n'}
              </Text>
              {moment(bookedOn).utcOffset('+0800').format('HH:mm:ss')}
            </Text>
          </View>
          <View
            style={{
              width: '75%',
              flexDirection: 'row',
            }}
          >
            <View
              style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}
            >
              <Text
                style={{ fontSize: 16 }}
              >
                <Text
                  style={{ fontWeight: 'bold', fontSize: 18 }}
                >
                  Est. Time{'\n'}
                </Text>
                {trip.estTime[tripNumber] || 'After 0800'}
              </Text>
              {
                trip.estTime[tripNumber]
                && (
                  <View
                    style={{ marginRight: 8, paddingTop: 4 }}
                  >
                    <Tooltip
                      height={80}
                      width={200}
                      withPointer={false}
                      backgroundColor="white"
                      popover={(
                        <Text
                          style={{ fontSize: 16 }}
                        >
                          The ferry will arrive within the first 5 minutes of start time.
                        </Text>
                      )}
                    >
                      <SLIcon
                        name="question"
                        color="black"
                        style={{ padding: 0 }}
                        size={16}
                      />
                    </Tooltip>
                  </View>
                )
              }
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Ticket;
