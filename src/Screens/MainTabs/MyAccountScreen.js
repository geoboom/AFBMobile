import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView,
} from 'react-native';
import {
  Button, ListItem,
} from 'react-native-elements';
import moment from 'moment';

import { GlobalContext } from '../../GlobalContext';

const styles = StyleSheet.create({
  rootContainerStyle: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  logoutButtonContainerStyle: {
    marginTop: 20,
    borderRadius: 15,
    width: '35%',
  },
  logoutButtonStyle: {
    height: 35,
    borderRadius: 15,
    backgroundColor: '#a6a6a6',
  },
});

const Settings = ({ signOutPress }) => {
  return (
    <View
      style={{ width: '100%' }}
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
          Actions
        </Text>
      </View>
      <TouchableOpacity
        style={{ backgroundColor: 'white' }}
      >
        <ListItem
          containerStyle={{
            backgroundColor: 'white',
            height: 60,
            width: '100%',
          }}
          title="Change Password"
          titleStyle={{
            fontSize: 18, fontWeight: 'bold',
          }}
          leftIcon={{
            name: 'key-variant',
            type: 'material-community',
            size: 20,
            color: 'grey',
          }}
        />
        <View
          style={{
            borderColor: 'rgba(200,200,200,0.4)',
            borderBottomWidth: 1,
            marginLeft: 50,
            width: '100%',
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={signOutPress}
      >
        <ListItem
          containerStyle={{
            backgroundColor: 'white',
            height: 60,
            width: '100%',
          }}
          title="Sign Out"
          titleStyle={{
            fontSize: 18, fontWeight: 'bold',
          }}
          leftIcon={{
            name: 'logout-variant',
            type: 'material-community',
            size: 20,
            color: 'grey',
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const AccDetails = ({ user }) => {
  const { lastSuccessfulLogin, signupTimestamp, group } = user;
  const lastSuccessfulLoginFormatted = moment(lastSuccessfulLogin).utcOffset('+0800').format('DD/MM/YYYY, HH:mm:ss');
  const signupTimestampFormatted = moment(signupTimestamp).utcOffset('+0800').format('DD/MM/YYYY, HH:mm:ss');

  return (
    <View
      style={{ width: '100%' }}
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
          Account Details
        </Text>
      </View>
      <TouchableOpacity
        style={{ backgroundColor: 'white' }}
      >
        <ListItem
          containerStyle={{
            backgroundColor: 'white',
            height: 60,
            width: '100%',
          }}
          title="+65 1234 5678"
          titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
          subtitle={'Tap to change phone number'}
          subtitleStyle={{ color: 'grey', fontSize: 12 }}
        />
        <View
          style={{
            borderColor: 'rgba(200,200,200,0.4)',
            borderBottomWidth: 1,
            marginLeft: 15,
            width: '100%',
          }}
        />
      </TouchableOpacity>
      <View
        style={{ backgroundColor: 'white' }}
      >
        <ListItem
          containerStyle={{
            backgroundColor: 'white',
            height: 60,
            width: '100%',
          }}
          title={group}
          titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
          subtitle={'Group'}
          subtitleStyle={{ color: 'grey', fontSize: 12 }}
        />
        <View
          style={{
            borderColor: 'rgba(200,200,200,0.4)',
            borderBottomWidth: 1,
            marginLeft: 15,
            width: '100%',
          }}
        />
      </View>
      <View
        style={{ backgroundColor: 'white' }}
      >
        <ListItem
          containerStyle={{
            backgroundColor: 'white',
            height: 60,
            width: '100%',
          }}
          title={lastSuccessfulLoginFormatted}
          titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
          subtitle={'Last Login'}
          subtitleStyle={{ color: 'grey', fontSize: 12 }}
        />
        <View
          style={{
            borderColor: 'rgba(200,200,200,0.4)',
            borderBottomWidth: 1,
            marginLeft: 15,
            width: '100%',
          }}
        />
      </View>
      <ListItem
        containerStyle={{
          backgroundColor: 'white',
          height: 60,
          width: '100%',
        }}
        title={signupTimestampFormatted}
        titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
        subtitle={'Account Created'}
        subtitleStyle={{ color: 'grey', fontSize: 12 }}
      />
    </View>
  );
};

const TopComponent = ({ user }) => {
  const { firstName, lastName, username } = user;
  return (
    <ListItem
      containerStyle={{
        backgroundColor: '#3f51b5',
        height: 120,
        width: '100%',
        elevation: 2,
      }}
      title={`${firstName || '-'} ${lastName || '-'}`}
      titleStyle={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}
      subtitle={username}
      subtitleStyle={{ color: 'white', fontSize: 20 }}
      leftAvatar={{
        size: 65,
        rounded: true,
        icon: {
          name: 'person',
          size: 50,
        },
      }}
    />
  );
};

class MyAccountScreen extends Component {
  static contextType = GlobalContext;

  signOutPress = async () => {
    const { navigation } = this.props;
    const { signoutUser, closeSocket } = this.context;
    await signoutUser();
    closeSocket();
    navigation.navigate('LoginRegister');
  };

  render() {
    const { user } = this.context;

    return (
      <ScrollView
        contentContainerStyle={styles.rootContainerStyle}
      >
        <TopComponent
          user={user}
        />
        <AccDetails
          user={user}
        />
        <View
          style={{ marginBottom: 20 }}
        />
        <Settings
          signOutPress={this.signOutPress}
        />
        <Text
          style={{
            fontSize: 10,
            textAlign: 'center',
            color: 'grey',
            padding: 10,
            paddingTop: 20,
            marginTop: 'auto',
          }}
        >
          ADOC Ferry Booking Mobile App{'\n'}by Georgie Lee
        </Text>
      </ScrollView>
    );
  }
}

export default MyAccountScreen;
