import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Dimensions, ActivityIndicator, TouchableOpacity, SectionList,
} from 'react-native';
import {
  Button, Tooltip,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';

import {
  trip,
} from '../../../../constants';

const TicketItem = ({
  style = {},
  ticket,
  selected,
  onSelect,
}) => {
  const {
    tripNumber, capacity, passengerCount, estTime, canBook,
  } = ticket;
  const type = tripNumber === trip.types.ADDITIONAL ? trip.types.ADDITIONAL : trip.types.SCHEDULED;

  return (
    <TouchableOpacity
      style={{
        ...style,
        backgroundColor: 'white',
        elevation: canBook ? 2 : 0,
        borderRadius: 5,
        padding: selected ? 9 : 10,
        borderWidth: selected ? 1 : 0,
        borderColor: 'blue',
      }}
      onPress={onSelect}
      disabled={!canBook}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          paddingBottom: 3,
          borderBottomWidth: 0.5,
        }}
      >
        <MIcon
          style={{ marginLeft: -1 }}
          name={selected ? 'check-box-outline' : 'checkbox-blank-outline'}
          size={19}
        />
        <Text
          style={{ fontWeight: 'bold', fontSize: 15 }}
        >
          Trip#
          {type === trip.types.ADDITIONAL ? ' > 4' : tripNumber}
        </Text>
      </View>
      {
        type === trip.types.ADDITIONAL ? (
          <View
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Icon
                name="md-people"
                size={20}
              />
              <Text>
                -
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Icon
                name="md-time"
                size={18}
              />
              <Text>
                After 0800
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Icon
                name="md-people"
                size={20}
              />
              <Text>
                {passengerCount}/{capacity}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Icon
                name="md-time"
                size={18}
              />
              <Text>
                {estTime}
              </Text>
            </View>
          </View>
        )
      }
      {
        canBook
          ? null
          : (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                borderRadius: 5,
                backgroundColor: 'rgba(200,200,200,0.5)',
              }}
            />
          )
      }
    </TouchableOpacity>
  );
};

const numColumns = 2;

class BookingTicketList extends Component {
  _keyExtractor = ({ tripNumber }) => tripNumber;

  _renderItem = ({ section, index }) => {
    const { selectTicket, selected } = this.props;
    const { tripNumber } = section.data[index];
    if (tripNumber === trip.types.ADDITIONAL) {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            paddingTop: index ? 0 : 10,
          }}
        >
          <TicketItem
            style={{
              width: (Dimensions.get('window').width - 20 - (numColumns - 1) * 10) / numColumns,
            }}
            key={tripNumber}
            ticket={section.data[index]}
            selected={selected === tripNumber}
            onSelect={() => { selectTicket(tripNumber); }}
          />
        </View>
      );
    }

    if (index % numColumns !== 0) return null;

    const items = [];
    for (let i = index; i < index + numColumns; i += 1) {
      if (i >= section.data.length) break;

      const { tripNumber } = section.data[i];
      items.push(
        <TicketItem
          style={{
            marginLeft: i > index ? 10 : 0,
            width: (Dimensions.get('window').width - 20 - (numColumns - 1) * 10) / numColumns,
          }}
          key={tripNumber}
          ticket={section.data[i]}
          selected={selected === tripNumber}
          onSelect={() => { selectTicket(tripNumber); }}
        />,
      );
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 10,
          paddingTop: index ? 0 : 10,
        }}
      >
        {items}
      </View>
    );
  };

  _renderSectionHeader = ({ section: { title, type } }) => {
    const { refreshTickets } = this.props;

    return (
      <View
        style={{
          padding: 5,
          width: '100%',
          backgroundColor: '#ff9100',
          elevation: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
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
            type === trip.types.ADDITIONAL
              ? (
                <View
                  style={{ marginLeft: 5, paddingTop: 2 }}
                >
                  <Tooltip
                    height={120}
                    width={200}
                    withPointer={false}
                    backgroundColor="white"
                    popover={(
                      <Text
                        style={{ fontSize: 16 }}
                      >
                        You will be placed on the{' '}
                        <Text
                          style={{ fontWeight: 'bold' }}
                        >
                          Additional Trips{' '}
                        </Text>
                        queue where boarding is based on seat availability and ticket queue number.
                      </Text>
                    )}
                  >
                    <SLIcon
                      name="question"
                      color="white"
                      style={{ padding: 0 }}
                      size={19}
                    />
                  </Tooltip>
                </View>
              ) : (
                <TouchableOpacity
                  style={{ marginLeft: 5, paddingTop: 2 }}
                  onPress={refreshTickets}
                >
                  <Icon
                    name="md-refresh"
                    color="white"
                    size={20}
                  />
                </TouchableOpacity>
              )
          }
        </View>
      </View>
    )};

  render() {
    const { availableTickets } = this.props;

    return (
      <SectionList
        style={{ flex: 1, width: '100%' }}
        sections={availableTickets}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        renderSectionHeader={this._renderSectionHeader}
      />
    );
  }
}

export default BookingTicketList;
