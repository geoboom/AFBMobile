import React, { Component } from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';

import UserForm from './components/UserForm';

const styles = StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainerStyle: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  titleStyle: {
    fontWeight: 'bold',
    color: '#1a237e',
    fontSize: 35,
  },
});

class RegisterScreen extends Component {
  render() {
    const { navigation } = this.props;

    return (
      <View
        style={styles.rootContainerStyle}
      >
        <View style={styles.titleContainerStyle}>
          <Text style={styles.titleStyle}>
            Sign Up
          </Text>
        </View>
        <UserForm
          formType="Sign Up"
          navigation={navigation}
        />
      </View>
    );
  }
}

export default RegisterScreen;
