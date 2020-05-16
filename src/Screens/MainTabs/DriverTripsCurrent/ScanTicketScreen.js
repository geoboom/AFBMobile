import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Header, Left, Body, Right, Button, Icon, Title, Item, Label, Input,
} from 'native-base';
import {
  Divider,
  ListItem,
} from 'react-native-elements';
import Modal from 'react-native-modal';
import moment from 'moment';
import FAIcon from 'react-native-vector-icons/dist/FontAwesome';

import {
  BACKEND_IP,
  ticket,
} from '../../../constants';
import {
  withGlobalContext,
} from '../../../GlobalContext';
import axiosHelper from '../../../helpers/axiosHelper';

const styles = StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
});

const sideModalColors = {
  VALID_BG: '#33a532',
  INVALID_BG: '#e53935',
};

const invalidReasons = {
  [ticket.statuses.REDEEMED]: 'Already Scanned',
  [ticket.statuses.EXPIRED]: 'Expired',
  [ticket.statuses.CANCELLED]: 'Cancelled',
};

const RenderTicketInfo = ({ tripNumber: tripTripNumber, ticket }) => {
  const {
    tripNumber = '-',
    tripType = '-',
    queueNumber = '-',
    tripDateString = '-',
    bookedOn = '-',
    username = '-',
    firstName = '-',
    lastName = '-',
  } = ticket;

  const mapping = {
    Owner: username === '-' ? '-' : (
      <Text>
        {firstName} {lastName}{'\n'}
        <Text style={{ fontSize: 12 }}>({username})</Text>
      </Text>
    ),
    'Trip Type': tripType,
    'Trip Date': tripDateString,
    'Date Booked': moment(bookedOn).isValid() ? moment(bookedOn).format('DD/MM/YYYY') : '-',
    'Time Booked': moment(bookedOn).isValid() ? moment(bookedOn).utcOffset('+0800').format('HH:mm:ss') : '-',
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#eeeeee',
      }}
    >
      <View
        style={{
          flexDirection: 'row', width: '100%', backgroundColor: 'white', padding: 15,
        }}
      >
        <View
          style={{ flex: 1, alignItems: 'center' }}
        >
          <Text
            style={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center' }}
          >
            {queueNumber}{'\n'}
            <Text
              style={{ fontSize: 16, color: 'grey', fontWeight: 'normal' }}
            >
              Queue No.
            </Text>
          </Text>
        </View>
        <View
          style={{ flex: 1, alignItems: 'center' }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'normal',
              textAlign: 'center',
              paddingLeft: 7,
              paddingRight: 7,
              borderRadius: 10,
              borderWidth: tripNumber === tripTripNumber ? 1.5 : 0,
              borderColor: 'orange',
            }}
          >
            <Text
              style={{ fontSize: 26, fontWeight: 'bold' }}
            >
              {tripNumber}{'\n'}
            </Text>
            <Text
              style={{ color: 'grey' }}
            >
              Trip No.
            </Text>
          </Text>
          {
            tripNumber === tripTripNumber
            && (
              <FAIcon
                style={{
                  position: 'absolute',
                  left: 135,
                }}
                name="flag-checkered"
                size={25}
                color="orange"
              />
            )
          }
        </View>
      </View>
      <View style={{ width: '100%', paddingLeft: 15, paddingTop: 5 }}>
        <Text
          style={{ fontSize: 18, fontWeight: 'bold' }}
        >
          Ticket Info
        </Text>
      </View>
      {
        Object.keys(mapping).map(
          (key, index) => (
            <View
              key={key}
              style={{
                width: '100%',
                backgroundColor: 'white',
                alignItems: 'flex-end',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  backgroundColor: 'white',
                  padding: 15,
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{ flex: 1, fontSize: 16, color: 'grey' }}
                >
                  {key}
                </Text>
                <Text
                  style={{ flex: 1, fontSize: 16 }}
                >
                  {mapping[key]}
                </Text>
              </View>
              {
                index < Object.keys(mapping).length - 1
                  ? (
                    <Divider
                      style={{ width: Dimensions.get('window').width - 15, height: 1.0 }}
                    />
                  ) : null
              }
            </View>
          ),
        )
      }
    </ScrollView>
  );
};

const SideModalHeader = ({ valid, invalidReason, ticketCode }) => {
  const color = valid ? sideModalColors.VALID_BG : sideModalColors.INVALID_BG;

  return (
    <Header
      style={{
        backgroundColor: color, height: 190,
      }}
      androidStatusBarColor={color}
    >
      <Body
        style={{
          flex: 1, backgroundColor: color, alignItems: 'center',
        }}
      >
        <Icon
          style={{ color: 'white', fontSize: 40 }}
          name={valid ? 'md-checkmark' : 'md-close'}
          type="Ionicons"
          size={30}
        />
        <Title
          style={{
            textAlign: 'center',
            fontSize: 30,
            color: 'white',
          }}
          multiline
          numberOfLines={2}
        >
          {valid ? 'Valid Ticket' : invalidReason}{'\n'}
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              color: 'white',
            }}
          >
            {ticketCode}
          </Text>
        </Title>
      </Body>
    </Header>
  );
};

const SideModal = ({
  tripNumber,
  ticketCode,
  ticket: thisTicket,
  isVisible,
  onBackButtonPress,
  onContinuePress,
  onAcceptPress,
  onRejectPress,
  acceptLoading,
}) => {
  const valid = thisTicket && thisTicket.status === ticket.statuses.VALID;
  const invalidReason = thisTicket ? (invalidReasons[thisTicket.status] || 'Invalid') : 'Invalid';

  return (
    <Modal
      isVisible={isVisible}
      style={{ margin: 0 }}
      onBackButtonPress={onBackButtonPress}
    >
      <SideModalHeader
        ticketCode={ticketCode}
        valid={valid}
        invalidReason={invalidReason}
      />
      <RenderTicketInfo
        ticket={thisTicket}
        tripNumber={tripNumber}
      />
      {
      valid
        ? (
          <View
            style={{ marginTop: 'auto', flexDirection: 'row', height: 65 }}
          >
            <Button
              style={{
                flex: 1,
                height: '100%',
                backgroundColor: sideModalColors.INVALID_BG,
                justifyContent: 'center',
                borderRadius: 0,
                elevation: 0,
              }}
              onPress={onRejectPress}
            >
              <Text style={{ color: 'white', fontSize: 20 }}>
                REJECT
              </Text>
            </Button>
            <Button
              style={{
                flex: 1,
                height: '100%',
                backgroundColor: sideModalColors.VALID_BG,
                justifyContent: 'center',
                borderRadius: 0,
                elevation: 0,
              }}
              onPress={onAcceptPress}
            >
              {
                acceptLoading
                  ? (
                    <ActivityIndicator size={20} color="white" />
                  ) : (
                    <Text style={{ color: 'white', fontSize: 20 }}>
                      ACCEPT
                    </Text>
                  )
              }
            </Button>
          </View>
        ) : (
          <Button
            style={{
              marginTop: 'auto',
              height: 65,
              backgroundColor: sideModalColors.INVALID_BG,
              justifyContent: 'center',
              width: '100%',
              borderRadius: 0,
              elevation: 0,
            }}
            rounded={false}
            onPress={onContinuePress}
          >
            <Text
              style={{
                fontSize: 20,
                color: 'white',
              }}
            >
              CONTINUE
            </Text>
          </Button>
        )
    }
    </Modal>
  );
};

const LoadingModal = ({
  loading,
}) => (
  <Modal
    isVisible={loading}
    animationIn="fadeIn"
    animationOut="fadeOut"
  >
    <View
      style={{
        alignSelf: 'center',
        width: '50%',
        padding: 15,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{ fontSize: 16, color: 'grey', marginBottom: 8 }}
      >
        Verifying ticket
      </Text>
      <ActivityIndicator size={25} />
    </View>
  </Modal>
);

const MainModalHeader = ({ onBackPress }) => (
  <Header>
    <Left
      style={{ flex: 0.30 }}
    >
      <TouchableOpacity
        style={{
          marginLeft: 10,
        }}
        onPress={onBackPress}
      >
        <Icon
          style={{ color: 'white' }}
          name="arrow-back"
        />
      </TouchableOpacity>
    </Left>
    <Body
      style={{ flex: 1 }}
    >
      <Title
        style={{ fontWeight: 'bold' }}
      >
        Scan Ticket Code
      </Title>
    </Body>
    <Right
      style={{ flex: 0.30 }}
    />
  </Header>
);

class ScanTicketScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    tempModalVisible: true,
    sideModalVisible: false,
    mainModalVisible: true,
    lookupLoading: false,
    acceptLoading: false,
    ticketCode: '',
    ticket: {},
  };

  onBackPress = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  closeSideModal = () => {
    this.ticketCodeInput._root.focus();
    this.setState({
      ticketCode: '',
      sideModalVisible: false,
    });
  };

  lookupTicket = async () => {
    const { ticketCode } = this.state;
    const { global } = this.props;
    const { user: { accessToken } } = global;
    this.setState({
      lookupLoading: true,
    });
    try {
      const response = await axiosHelper.request({
        method: 'GET',
        url: `${BACKEND_IP}/api/tickets/lookup?ticketCode=${ticketCode}`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const { ticket } = response.data;
      this.setState({
        ticket: ticket || {},
        lookupLoading: false,
        sideModalVisible: true,
      });
    } catch (e) {
      this.setState({
        lookupLoading: false,
      });
      console.log(axiosHelper.handleError(e));
    }
  };

  approveTicket = async () => {
    const { ticket } = this.state;
    const { navigation, global } = this.props;
    const { updateDriverTripData, user: { accessToken } } = global;
    const tripId = navigation.getParam('tripId', null);
    const { _id: ticketId } = ticket;

    this.setState({
      acceptLoading: true,
    });
    try {
      await axiosHelper.request({
        method: 'POST',
        url: `${BACKEND_IP}/api/trips/approve-ticket`,
        data: {
          ticketId,
          tripId,
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const response = await axiosHelper.request({
        method: 'GET',
        url: `${BACKEND_IP}/api/trips/today`,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });

      const { trips } = response.data;
      updateDriverTripData(trips);
      this.setState({
        ticketCode: '',
        sideModalVisible: false,
        acceptLoading: false,
      });
    } catch (e) {
      console.log(axiosHelper.handleError(e));
      this.setState({
        ticketCode: '',
        acceptLoading: false,
      });
    }
  };

  componentDidMount() {
    setTimeout(() => {
      this.ticketCodeInput._root.focus();
      this.setState({
        tempModalVisible: false,
      });
    }, 1);
  }

  render() {
    const {
      tempModalVisible,
      mainModalVisible,
      sideModalVisible,
      lookupLoading,
      acceptLoading,
      ticket,
      ticketCode,
    } = this.state;
    const { navigation, global } = this.props;
    const tripId = navigation.getParam('tripId', null);
    const tripType = navigation.getParam('tripType', null);
    const { driverTripData } = global;
    const trip = driverTripData
      .find(({ type }) => type === tripType)
      .data
      .find(({ _id }) => _id === tripId);
    const { passengers, capacity, tripNumber } = trip;

    return (
      <View>
        <Modal
          animationIn="slideInRight"
          animationOut="slideOutRight"
          isVisible={mainModalVisible}
          style={{ margin: 0 }}
          onBackButtonPress={this.onBackPress}
        >
          <MainModalHeader
            onBackPress={this.onBackPress}
          />
          <View
            style={styles.rootContainerStyle}
          >
            <Item
              style={{
                width: '50%',
                marginTop: 15,
                marginBottom: 15,
              }}
              floatingLabel
            >
              <Label
                style={{ textAlign: 'center' }}
              >
                {
                  passengers.length === capacity
                    ? 'Ferry Capacity Reached' : 'Ticket Code'
                }
              </Label>
              <Input
                style={{ textAlign: 'center' }}
                disabled={passengers.length === capacity}
                getRef={(ref) => { this.ticketCodeInput = ref; }}
                keyboardType="numeric"
                maxLength={6}
                value={ticketCode}
                onChangeText={(ticketCode) => {
                  if (ticketCode && !/^\d+$/.test(ticketCode)) return;
                  this.setState({ ticketCode }, () => {
                    if (ticketCode.length === 6) this.lookupTicket();
                  });
                }}
              />
            </Item>
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
                  passengers.map(({ _id, username, firstName, lastName }, index) => (
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
          </View>
        </Modal>
        <Modal
          hasBackdrop={false}
          isVisible={tempModalVisible}
        >
          <View />
        </Modal>
        <LoadingModal
          loading={lookupLoading}
        />
        <SideModal
          tripNumber={tripNumber}
          ticketCode={ticketCode}
          ticket={ticket}
          isVisible={sideModalVisible}
          acceptLoading={acceptLoading}
          onBackButtonPress={this.closeSideModal}
          onContinuePress={this.closeSideModal}
          onAcceptPress={this.approveTicket}
          onRejectPress={this.closeSideModal}
        />
      </View>
    );
  }
}

export default withGlobalContext(ScanTicketScreen);
