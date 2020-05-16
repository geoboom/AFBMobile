import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ActivityIndicator, Picker, TouchableOpacity, AppState,
} from 'react-native';
import {
  Button, Card,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/dist/EvilIcons';

import TripItemList from './components/TripItemList';
import { withGlobalContext } from '../../../GlobalContext';
import axiosHelper from '../../../helpers/axiosHelper';
import { BACKEND_IP, socketRoutes } from '../../../constants';

const enumScreenState = {
  ERROR: 'error',
  LOADING: 'loading',
  INITIALIZE: 'initialize',
  TRIPS: 'trips',
};

const styles = StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  cardContainerStyle: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingTop: 0,
    elevation: 1,
  },
  cardWrapperStyle: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 0.3,
    width: '100%',
    textAlign: 'center',
    padding: 10,
  },
  cardContentStyle: {
    flexGrow: 1,
    width: '100%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerOuterContainerStyle: {
    width: '100%',
    paddingBottom: 10,
  },
  pickerContainerStyle: {
    width: '100%',
    borderWidth: 0.5,
  },
  pickerStyle: {
    width: '100%',
    height: 50,
  },
  buttonStyle: {
    backgroundColor: 'orange',
  },
  buttonContainerStyle: {
    width: '100%',
    marginTop: 15,
  },
});

const RenderScreen = ({
  currTripDate,
  additionalLoading,
  addAdditionalTrip,
  buttonLoading,
  screenState,
  vehicleId,
  capacity,
  vehicleList,
  onVehicleIDChange,
  driverTripData,
  initializeTrips,
  errorMessage,
  additionalPassengers,
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
    case enumScreenState.INITIALIZE:
      return (
        <Card
          wrapperStyle={styles.cardWrapperStyle}
          containerStyle={styles.cardContainerStyle}
        >
          <Text
            style={styles.cardHeaderStyle}
          >
            Initialize Trips for {currTripDate}
          </Text>
          <View
            style={styles.cardContentStyle}
          >
            <View
              style={{
                flexGrow: 1,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <View
                style={styles.pickerOuterContainerStyle}
              >
                <Text>
                  Select Vehicle
                </Text>
                <View
                  style={styles.pickerContainerStyle}
                >
                  <Picker
                    style={styles.pickerStyle}
                    selectedValue={vehicleId}
                    onValueChange={onVehicleIDChange}
                    mode="dropdown"
                  >
                    {
                      vehicleList.map(
                        ({ vehicleId }) => <Picker.Item key={vehicleId} label={vehicleId} value={vehicleId} />,
                      )
                    }
                  </Picker>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  Information for Vehicle {vehicleId}
                </Text>
                <Text>
                  Capacity: {capacity}
                </Text>
              </View>
            </View>
            <Button
              loading={buttonLoading}
              buttonStyle={styles.buttonStyle}
              containerStyle={styles.buttonContainerStyle}
              title="Initialize Trips"
              onPress={initializeTrips}
              raised
            />
          </View>
        </Card>
      );
    case enumScreenState.TRIPS:
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            width: '100%',
          }}
        >
          <TripItemList
            additionalPassengers={additionalPassengers}
            driverTripData={driverTripData}
            addAdditionalTrip={addAdditionalTrip}
            additionalLoading={additionalLoading}
          />
        </View>
      );
    default:
      return <View><Text style={{ fontColor: 'red' }}>Error</Text></View>;
  }
};

class TripsCurrentScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = { currTripDate: '-', accessToken: '' } } = navigation.state;

    return ({
      title: `Trips for ${params.currTripDate}`,
      headerStyle: {
        backgroundColor: '#3f51b5',
      },
      headerTitleStyle: {
        color: 'white',
      },
      headerRight:
        <View
          style={{
            width: 60, height: 40, alignItems: 'center', justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            onPress={
              () => axiosHelper.request({
                method: 'DELETE',
                url: `${BACKEND_IP}/api/trips?_id=*`,
                headers: {
                  Authorization: `bearer ${params.accessToken}`,
                },
              })
            }
          >
            <Icon
              color="white"
              name="refresh"
              size={35}
            />
          </TouchableOpacity>
        </View>,
    });
  };

  state = {
    screenState: enumScreenState.LOADING,
    errorMessage: '',
    vehicle: {
      vehicleId: null,
      capacity: null,
    },
    vehicleList: [],
    buttonLoading: false,
    additionalLoading: false,
    currTrip: null,
    appState: AppState.currentState,
  };

  componentWillUpdate(prevProps) {
    const { global: { currTripDate, user: { accessToken } } } = prevProps;
    const { navigation } = this.props;
    const { params = {} } = navigation.state;
    if (params && (currTripDate !== params.currTripDate || accessToken !== params.accessToken)) {
      navigation.setParams({
        currTripDate,
        accessToken,
      });
    }
  }

  bootstrapState = async () => {
    const { global } = this.props;
    const { updateDriverTripData, setCurrTripDate, user: { accessToken } } = global;

    try {
      const res0 = await axiosHelper.request({
        method: 'GET',
        url: `${BACKEND_IP}/api/vehicles`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const { vehicleList } = res0.data;
      this.setState({ vehicleList, vehicle: vehicleList[0] });

      setCurrTripDate();
      const response = await axiosHelper.request({
        method: 'GET',
        url: `${BACKEND_IP}/api/trips/today`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });

      const { trips } = response.data;

      if (trips.length > 0) {
        updateDriverTripData(trips);
        this.setState({
          screenState: enumScreenState.TRIPS,
        });
      } else {
        this.setState({
          screenState: enumScreenState.INITIALIZE,
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
    const { global } = this.props;
    const { socket } = global;

    socket.on(socketRoutes.TICKET_BOOKED, this.bootstrapState);
    this.bootstrapState();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  onVehicleIDChange = (vehicleId) => {
    this.setState(prevState => ({
      vehicle: {
        vehicleId,
        capacity: prevState.vehicleList
          .find(({ vehicleId: cdtId }) => cdtId === vehicleId).capacity,
      },
    }));
  };

  addAdditionalTrip = async () => {
    const { additionalLoading } = this.state;
    const { global } = this.props;
    const { updateDriverTripData, user: { accessToken } } = global;

    if (additionalLoading) return;
    this.setState({
      additionalLoading: true,
    });
    try {
      const response = await axiosHelper.request({
        method: 'POST',
        url: `${BACKEND_IP}/api/trips/additional`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const { trips } = response.data;
      updateDriverTripData(trips);
      this.setState({
        additionalLoading: false,
      });
    } catch (e) {
      this.setState({
        additionalLoading: false,
      });
    }
  };

  initializeTrips = async () => {
    const { global } = this.props;
    const { updateDriverTripData, user: { accessToken } } = global;

    this.setState({
      buttonLoading: true,
    });
    try {
      const { vehicle: { vehicleId } } = this.state;
      const response = await axiosHelper.request({
        method: 'POST',
        url: `${BACKEND_IP}/api/trips/initialize`,
        data: {
          vehicleId,
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const { trips } = response.data;
      updateDriverTripData(trips);
      this.setState({
        screenState: enumScreenState.TRIPS,
        errorMessage: '',
        buttonLoading: false,
      });
    } catch (e) {
      this.setState({
        screenState: enumScreenState.ERROR,
        errorMessage: axiosHelper.handleError(e),
        buttonLoading: false,
      });
    }
  };

  render() {
    const {
      screenState, vehicle, errorMessage, buttonLoading, additionalLoading, vehicleList,
    } = this.state;
    const { global } = this.props;
    const { driverTripData, currTripDate, additionalPassengers } = global;

    return (
      <View style={styles.rootContainerStyle}>
        <RenderScreen
          additionalPassengers={additionalPassengers}
          currTripDate={currTripDate}
          additionalLoading={additionalLoading}
          addAdditionalTrip={this.addAdditionalTrip}
          buttonLoading={buttonLoading}
          errorMessage={errorMessage}
          driverTripData={driverTripData}
          screenState={screenState}
          vehicleId={vehicle.vehicleId}
          capacity={vehicle.capacity}
          vehicleList={vehicleList}
          onVehicleIDChange={this.onVehicleIDChange}
          initializeTrips={this.initializeTrips}
        />
      </View>
    );
  }
}

export default withGlobalContext(TripsCurrentScreen);
