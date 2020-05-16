import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Switch, Dimensions, ScrollView,
} from 'react-native';
import {
  Button, ListItem,
} from 'react-native-elements';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/dist/Ionicons';

import { BACKEND_IP, trip, ticket } from '../../../constants';
import axiosHelper from '../../../helpers/axiosHelper';
import { withGlobalContext } from '../../../GlobalContext';

const { statuses: { REDEEMED } } = ticket;
const { statuses, estTime, types } = trip;

const nextStatus = {
  [statuses.NOT_STARTED]: statuses.IN_PROGRESS,
  [statuses.IN_PROGRESS]: statuses.COMPLETED,
};

const styles = StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  rootModalStyle: {
    height: Dimensions.get('window').height * (5 / 6),
    width: '95%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

const ModalContent = ({
  trip,
  modalTab,
  setModalTab,
}) => {
  const {
    status,
    expectedPassengers,
    tripNumber,
  } = trip;

  switch (status) {
    case statuses.COMPLETED:
    case statuses.NOT_STARTED:
      return (
        <View
          style={styles.rootModalStyle}
        >
          <Text
            style={{
              width: '100%',
              fontSize: 25,
              fontWeight: 'bold',
              marginBottom: 10,
              paddingBottom: 5,
              borderBottomWidth: 0.5,
            }}
          >
            Expected Passengers
          </Text>
          {
            expectedPassengers.length > 0
              ? (
                expectedPassengers.map(({
                  user:
                  {
                    _id, username, firstName, lastName,
                  },
                  ticketStatus,
                  tripNumber: tN,
                }, index) => (
                  <Text
                    key={_id}
                    style={{
                      fontSize: 16,
                      textDecorationLine: ticketStatus === REDEEMED ? 'line-through' : 'none',
                    }}
                  >
                    {index + 1}. {`${firstName} ${lastName}`} ({username})
                  </Text>
                ))
              ) : (
                <Text
                  style={{ fontSize: 16 }}
                >
                  None
                </Text>
              )
          }
        </View>
      );
    case statuses.IN_PROGRESS:
      return (
        <View
          style={styles.rootModalStyle}
        >
          <View
            style={{
              flexDirection: 'row',
              borderColor: 'grey',
              borderRadius: 10,
              borderWidth: 1,
              alignSelf: 'center',
              width: '80%',
            }}
          >
            <TouchableOpacity
              onPress={() => setModalTab(0)}
              disabled={modalTab === 0}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: modalTab === 0 ? '#0d47a1' : 'white',
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: modalTab === 0 ? 'white' : 'grey',
                }}
              >
                Trip Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalTab(1)}
              disabled={modalTab === 1}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: modalTab === 1 ? '#0d47a1' : 'white',
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: modalTab === 1 ? 'white' : 'grey',
                }}
              >
                Expected{'\n'}
                Passengers
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              borderBottomWidth: 0.5,
              marginTop: 15,
              marginBottom: 10,
            }}
          />
          {
            modalTab === 0
              ? (
                <View
                  style={{
                    width: '100%',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 25,
                      borderBottomWidth: 0.5,
                      paddingBottom: 5,
                      marginBottom: 5,
                    }}
                  >
                    Trip Details
                  </Text>
                  <RenderTripDetails
                    trip={trip}
                  />
                </View>
              ) : (
                <View
                  style={{
                    width: '100%',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 25,
                      borderBottomWidth: 0.5,
                      paddingBottom: 5,
                      marginBottom: 5,
                    }}
                  >
                    Expected Passengers
                  </Text>
                  {
                    expectedPassengers.length > 0
                      ? (
                        expectedPassengers.map(({
                          user:
                          {
                            _id, username, firstName, lastName,
                          },
                          ticketStatus,
                          tripNumber: tN,
                        }, index) => (
                          <Text
                            key={_id}
                            style={{
                              fontSize: 16,
                              textDecorationLine: ticketStatus === REDEEMED ? 'line-through' : 'none',
                            }}
                          >
                            {index + 1}. {`${firstName} ${lastName}`} ({username})
                          </Text>
                        ))
                      ) : (
                        <Text
                          style={{ fontSize: 16 }}
                        >
                          None
                        </Text>
                      )
                  }
                </View>
              )
          }
        </View>
      );
    default:
      return null;
  }
};

const RenderTripDetails = ({
  trip,
  viewPassengers,
}) => {
  const {
    tripNumber, tripDateString, type, capacity, expectedPassengers, passengers, status,
  } = trip;

  return (
    <View>
      <Text
        style={{ fontSize: 18 }}
      >
        <Text style={{ fontWeight: 'bold' }}>
          Trip Number{': '}
        </Text>
        {tripNumber}
      </Text>
      <Text
        style={{ fontSize: 18 }}
      >
        <Text style={{ fontWeight: 'bold' }}>
          Trip Date{': '}
        </Text>
        {tripDateString}
      </Text>
      {
        tripNumber > 0
          ? (
            <Text
              style={{ fontSize: 18 }}
            >
              <Text style={{ fontWeight: 'bold' }}>
                Est. Time{': '}
              </Text>
              {estTime[tripNumber] || 'After 0800'}
            </Text>
          ) : null
      }
      <Text
        style={{ fontSize: 18 }}
      >
        <Text style={{ fontWeight: 'bold' }}>
          Type{': '}
        </Text>
        {type}
      </Text>
      <Text
        style={{ fontSize: 18 }}
      >
        <Text style={{ fontWeight: 'bold' }}>
          Capacity{': '}
        </Text>
        {capacity}
      </Text>
      {
        type === types.SCHEDULED
          ? (
            <View
              style={{ flexDirection: 'row' }}
            >
              <Text
                style={{ fontSize: 18 }}
              >
                <Text style={{ fontWeight: 'bold' }}>
                  Expected Passengers:{' '}
                </Text>
                {expectedPassengers.length}{' '}
              </Text>
              {
                (
                  status === statuses.NOT_STARTED || status === statuses.COMPLETED
                ) && type === types.SCHEDULED
                  ? (
                    <TouchableOpacity
                      onPress={() => { viewPassengers(true); }}
                    >
                      <Text
                        style={{ fontSize: 18, color: 'blue' }}
                      >
                        (view)
                      </Text>
                    </TouchableOpacity>
                  ) : null
              }
            </View>
          ) : null
      }
    </View>
  );
};

const RenderScreen = ({
  trip,
  buttonsUnlocked,
  buttonLoading,
  buttonOnPress,
  addPassengerOnPress,
  viewPassengers,
  goScanTicket,
}) => {
  const {
    tripNumber, tripDateString, type, capacity, expectedPassengers, passengers, status,
  } = trip;

  switch (status) {
    case statuses.NOT_STARTED:
      return (
        <View
          style={styles.rootContainerStyle}
        >
          <View
            style={{
              width: '80%',
              paddingTop: 10,
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 25,
                borderBottomWidth: 0.5,
                paddingBottom: 5,
                marginBottom: 5,
              }}
            >
              Trip Details
            </Text>
            <RenderTripDetails
              trip={trip}
              viewPassengers={viewPassengers}
            />
          </View>
          <Button
            containerStyle={{ width: '100%', marginTop: 'auto' }}
            loading={buttonLoading}
            buttonStyle={{
              backgroundColor: 'green', width: '100%', borderRadius: 0, height: 50,
            }}
            titleStyle={{ fontSize: 20 }}
            title="BEGIN TRIP"
            disabled={!buttonsUnlocked}
            onPress={() => { buttonOnPress(statuses.NOT_STARTED); }}
          />
        </View>
      );
    case statuses.IN_PROGRESS:
      return (
        <View
          style={styles.rootContainerStyle}
        >
          <View
            style={{
              flex: 1,
              width: '100%',
            }}
          >
            <View
              style={{
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
                Passengers ({passengers.length}/{capacity})
              </Text>
            </View>
            <ScrollView
              style={{
                backgroundColor: '#f2f2f2',
              }}
            >
              {
                passengers.map(({
                  _id, username, firstName, lastName,
                }, index) => (
                  <ListItem
                    containerStyle={{
                      borderColor: 'rgba(200,200,200,0.5)',
                      borderBottomWidth: index === passengers.length - 1 ? 0 : 0.5,
                      backgroundColor: 'white',
                      height: 65,
                      marginBottom: 0.5,
                    }}
                    key={_id}
                    title={`${firstName || '-'} ${lastName || '-'}`}
                    subtitle={username}
                    subtitleStyle={{ color: 'grey', fontSize: 12 }}
                    leftAvatar={{
                      rounded: true,
                      icon: {
                        name: 'person',
                        size: 30,
                      },
                    }}
                  />
                ))
              }
            </ScrollView>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 'auto',
            }}
          >
            <Button
              containerStyle={{ width: '50%' }}
              buttonStyle={{
                backgroundColor: 'orange', width: '100%', borderRadius: 0, height: 50,
              }}
              titleStyle={{ fontSize: 20 }}
              loading={buttonLoading}
              title="END TRIP"
              disabled={!buttonsUnlocked}
              onPress={() => { buttonOnPress(statuses.IN_PROGRESS); }}
            />
            <Button
              containerStyle={{ width: '50%' }}
              buttonStyle={{
                backgroundColor: 'green', width: '100%', borderRadius: 0, height: 50,
              }}
              titleStyle={{ fontSize: 20 }}
              title="SCAN TICKET"
              disabled={!buttonsUnlocked}
              onPress={goScanTicket}
            />
          </View>
        </View>
      );
    case statuses.COMPLETED:
      return (
        <View
          style={{
            ...styles.rootContainerStyle,
            alignItems: 'flex-start',
          }}
        >
          <View
            style={{
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
              Trip Details
            </Text>
          </View>
          <View
            style={{
              alignSelf: 'flex-start',
              padding: 10,
              marginBottom: 10,
            }}
          >
            <RenderTripDetails
              trip={trip}
              viewPassengers={viewPassengers}
            />
          </View>
          <View
            style={{
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
              Passengers ({passengers.length}/{capacity})
            </Text>
          </View>
          <ScrollView
            style={{
              backgroundColor: '#f2f2f2',
              width: '100%',
            }}
          >
            {
              passengers.map(({
                _id, username, firstName, lastName,
              }, index) => (
                <ListItem
                  containerStyle={{
                    borderColor: 'rgba(200,200,200,0.5)',
                    marginBottom: 0.5,
                    borderBottomWidth: index === passengers.length - 1 ? 0 : 0.5,
                    backgroundColor: 'white',
                    height: 65,
                  }}
                  key={_id}
                  title={`${firstName || '-'} ${lastName || '-'}`}
                  subtitle={username}
                  subtitleStyle={{ color: 'grey', fontSize: 12 }}
                  leftAvatar={{
                    rounded: true,
                    icon: {
                      name: 'person',
                      size: 30,
                    },
                  }}
                />
              ))
            }
          </ScrollView>
        </View>
      );
    case statuses.CANCELLED:
    default:
  }
};

const HeaderRight = ({
  switchLocked, buttonsUnlocked, toggleButtonLock, showInfo, status,
}) => (
  <View
    style={{
      alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 10,
    }}
  >
    {
      status === statuses.IN_PROGRESS
        ? (
          <TouchableOpacity
            style={{ marginRight: 10, flexDirection: 'row' }}
            onPress={showInfo}
          >
            <Text
              style={{ color: 'white', fontSize: 16 }}
            >
              Trip Info
            </Text>
            <Icon
              name="md-information-circle-outline"
              size={24}
              style={{ padding: 0, paddingLeft: 5 }}
              color="white"
            />
          </TouchableOpacity>
        ) : null
      }
    {
      status === statuses.COMPLETED || status === statuses.CANCELLED
        ? null
        : (
          <Switch
            disabled={switchLocked}
            onValueChange={toggleButtonLock}
            value={buttonsUnlocked}
            trackColor={{ true: '#cc8400' }}
            thumbColor={
              switchLocked ? 'light-grey' : (buttonsUnlocked ? '#ffa500' : 'white')
            }
          />
        )
    }
  </View>
);

const statusColors = {
  [trip.statuses.NOT_STARTED]: 'violet',
  [trip.statuses.IN_PROGRESS]: 'orange',
  [trip.statuses.COMPLETED]: '#a1887f',
  [trip.statuses.CANCELLED]: 'red',
};

const HeaderTitle = ({ tripNumber, status }) => (
  <View
    style={{ flexDirection: 'row', alignItems: 'center' }}
  >
    <Text
      style={{
        fontSize: 20, fontWeight: 'bold', color: 'white',
      }}
    >
      Trip {tripNumber}
    </Text>
    <View
      style={{
        borderRadius: 10,
        margin: 4,
        height: 10,
        width: 10,
        backgroundColor: statusColors[status],
      }}
    />
  </View>
);

class TripDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const trip = navigation.getParam('trip', {});
    const switchLocked = navigation.getParam('switchLocked', true);
    const buttonsUnlocked = navigation.getParam('buttonsUnlocked', false);
    const toggleButtonLock = navigation.getParam('toggleButtonLock', () => {});
    const showInfo = navigation.getParam('viewPassengers', () => {});
    const { tripNumber, status } = trip;

    return {
      headerTitle: <HeaderTitle tripNumber={tripNumber} status={status} />,
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#3f51b5',
      },
      headerRight: <HeaderRight
        status={status}
        switchLocked={switchLocked}
        buttonsUnlocked={buttonsUnlocked}
        toggleButtonLock={toggleButtonLock}
        showInfo={() => showInfo(true)}
      />,
    };
  };

  state = {
    buttonLoading: false,
    buttonsUnlocked: false,
    showModal: false,
    modalTab: 0,
  };

  toggleButtonLock = (value) => {
    const { navigation } = this.props;

    this.setState({
      buttonsUnlocked: value,
    });
    navigation.setParams({ buttonsUnlocked: value });
  };

  buttonOnPress = async (status) => {
    const { global, navigation } = this.props;
    const { updateDriverTripData, user: { accessToken } } = global;
    const { trip = {} } = navigation.state.params;

    this.setState({
      buttonLoading: true,
    });
    try {
      const res1 = await axiosHelper.request({
        method: 'PUT',
        url: `${BACKEND_IP}/api/trips/status`,
        data: {
          _id: trip._id,
          status: nextStatus[status],
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const { trip: updatedTrip } = res1.data;
      const res2 = await axiosHelper.request({
        method: 'GET',
        url: `${BACKEND_IP}/api/trips/today`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      navigation.setParams({
        trip: updatedTrip,
      });
      const { trips } = res2.data;
      updateDriverTripData(trips);
      this.setState({
        buttonLoading: false,
      });
    } catch (e) {
      console.log(e);
      this.setState({
        buttonLoading: false,
      });
    }
  };

  viewPassengers = (value) => {
    this.setState({
      showModal: value,
    });
  };

  setModalTab = (value) => {
    this.setState({
      modalTab: value,
    });
  };

  goScanTicket = () => {
    const { navigation } = this.props;
    const { trip = {} } = navigation.state.params;
    navigation.navigate('ScanTicket', { tripId: trip._id, tripType: trip.type });
  };

  componentDidMount() {
    const { buttonsUnlocked } = this.state;
    const { navigation, global } = this.props;
    const { driverTripData } = global;
    const currTrip = navigation.getParam('trip', {});
    const { _id: tripId } = currTrip;
    let switchLocked = false;
    driverTripData.forEach(({ data }) => {
      data.forEach(({ _id, status }) => {
        if (_id !== tripId && status === trip.statuses.IN_PROGRESS) {
          switchLocked = true;
        }
      });
    });

    navigation.setParams({
      switchLocked,
      buttonsUnlocked,
      toggleButtonLock: this.toggleButtonLock,
      viewPassengers: this.viewPassengers,
    });
  }

  render() {
    const {
      buttonsUnlocked, buttonLoading, showModal, modalTab,
    } = this.state;
    const { navigation, global } = this.props;
    const { trip = {} } = navigation.state.params;
    const { driverTripData } = global;
    const globalTrip = driverTripData
      .find(({ type }) => type === trip.type)
      .data
      .find(({ _id }) => _id === trip._id);

    return (
      <View
        style={{ flex: 1 }}
      >
        <Modal
          isVisible={showModal}
          onBackdropPress={() => {
            this.viewPassengers(false);
            this.setModalTab(0);
          }}
          onBackButtonPress={() => {
            this.viewPassengers(false);
            this.setModalTab(0);
          }}
        >
          <ModalContent
            modalTab={modalTab}
            setModalTab={this.setModalTab}
            trip={globalTrip}
          />
        </Modal>
        <RenderScreen
          trip={globalTrip}
          buttonsUnlocked={buttonsUnlocked}
          buttonLoading={buttonLoading}
          buttonOnPress={this.buttonOnPress}
          viewPassengers={this.viewPassengers}
          goScanTicket={this.goScanTicket}
        />
      </View>
    );
  }
}

export default withGlobalContext(TripDetailsScreen);
