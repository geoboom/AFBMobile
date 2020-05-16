import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Keyboard, KeyboardAvoidingView, Image, Dimensions,
} from 'react-native';

import { FONT_SCALE_FACTOR } from '../../constants';
import UserForm from './components/UserForm';

const styles = StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
  },
  titleContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  titleStyle: {
    // fontWeight: 'bold',
    color: '#1a237e',
    fontSize: 35 * FONT_SCALE_FACTOR,
  },
  titleStyleKb: {
    // fontWeight: 'bold',
    color: '#1a237e',
    fontSize: 20 * FONT_SCALE_FACTOR,
  },
});

const FormTitle = ({ kbUp }) => (
  <View
    style={{ ...styles.titleContainerStyle, paddingTop: kbUp ? 0 : 50 }}
  >
    {
      kbUp
        ? (
          <Text
            style={styles.titleStyleKb}
            adjustsFontSizeToFit
            allowFontScaling
            numberOfLines={1}
          >
            ADOC Ferry Booking
          </Text>
        )
        : (
          <Text
            style={styles.titleStyle}
            adjustsFontSizeToFit
            allowFontScaling
          >
            ADOC
            {'\n   '}
            <Text>
              Ferry
            </Text>
            {'\n     '}
            <Text>
              Booking
            </Text>
          </Text>
        )
    }
  </View>
);

class LoginScreen extends Component {
  state = {
    kbUp: false,
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => { this.setState({ kbUp: true }); },
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => { this.setState({ kbUp: false }); },
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  render() {
    const { kbUp } = this.state;
    const { navigation } = this.props;

    return (
      <KeyboardAvoidingView
        style={styles.rootContainerStyle}
        behavior="padding"
        keyboardVerticalOffset={-170}
      >
        <View
          style={{
            flex: 1,
            flexDirection: kbUp ? 'row' : 'column',
            paddingTop: kbUp ? 0 : 150,
            width: '100%',
            alignItems: kbUp ? 'flex-end' : 'center',
            justifyContent: kbUp ? 'center' : 'flex-end',
          }}
        >
          <Image
            source={require('../../app_logo.png')}
            resizeMode="cover"
            style={{
              borderColor: '#1a237e',
              borderWidth: 2,
              borderRadius: 100,
              width: Dimensions.get('window').width / (kbUp ? 4 : 2),
              height: Dimensions.get('window').width / (kbUp ? 4 : 2),
              paddingRight: kbUp ? 10 : 0,
              marginBottom: kbUp ? 0 : 20,
            }}
          />
          <Text
            style={{
              textAlign: 'center',
              color: '#1a237e',
              fontSize: kbUp ? 30 : 35,
              paddingLeft: kbUp ? 10 : 0,
            }}
          >
            ADOC Ferry{'\n'}Booking
          </Text>
        </View>
        <UserForm
          formType="Sign In"
          navigation={navigation}
        />
      </KeyboardAvoidingView>
    );
  }
}

export default LoginScreen;
