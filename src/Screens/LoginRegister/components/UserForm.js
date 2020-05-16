import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TextInput, ToastAndroid, TouchableOpacity, ScrollView,
} from 'react-native';
import {
  Button,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import IIcon from 'react-native-vector-icons/dist/Ionicons';
import jwtDecode from 'jwt-decode';
import Modal from 'react-native-modal';

import { GlobalContext } from '../../../GlobalContext';
import { BACKEND_IP } from '../../../constants';
import axiosHelper from '../../../helpers/axiosHelper';

const styles = StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 30,
    width: '65%',
  },
  inputContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 30,
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderRadius: 20,
  },
  buttonContainerStyle: {
    marginBottom: 10,
    borderRadius: 15,
    width: '100%',
  },
  buttonStyle: {
    height: 40,
    borderRadius: 15,
    backgroundColor: '#0d47a1',
  },
  textInputStyle: {
    height: 40,
    width: '90%',
  },
});

const FIELD_TESTS_LOGIN = [
  RegExp('^[a-zA-Z0-9_-]{1,15}$'),
  RegExp('^[a-zA-Z0-9_-]{1,64}$'),
];
const FIELD_TESTS_SIGNUP = [
  RegExp('^[a-zA-Z0-9_-]{1,15}$'),
  RegExp('^[a-zA-Z0-9_-]{1,15}$'),
  RegExp('.'),
  RegExp('^[a-zA-Z0-9_-]{6,15}$'),
  RegExp('^[a-zA-Z0-9_-]{8,64}$'),
];
const FIELD_ERRS_LOGIN = [
  'Username must be between 6 and 15 characters',
  'Password must be at least 8 characters long',
];
const FIELD_ERRS_SIGNUP = [
  'First Name field cannot be empty',
  'Last Name field cannot be empty',
  'Invalid Phone Number',
  'Username must be between 6 and 15 characters',
  'Password must be at least 8 characters long',
];

const ErrorMessage = ({ errorMessage }) => (
  <View
    style={{
      alignItems: 'center',
    }}
  >
    {
      !!errorMessage && (
        <Text style={{ color: '#ff3d00', textAlign: 'center' }}>
          {errorMessage}
        </Text>
      )
    }
  </View>
);

const SignUpArea = ({ show, onPress }) => (
  <View>
    {
      show && (
        <Text
          style={{
            marginBottom: 20,
          }}
        >
          Don't have an account?
          {' '}
          <Text
            onPress={onPress}
            style={{
              color: '#4169E1',
            }}
          >
            Sign up here
          </Text>
        </Text>
      )
    }
  </View>
);

class UserForm extends Component {
  static contextType = GlobalContext;

  state = {
    login: {
      // username: 'shinjieva09',
      // username: 'johnsmith87',
      // username: 'rickjames99',
      // username: 'redjohnowo',
      // username: 'emilygrey',
      // username: 'starplatinum',
      // username: 'excelsior',
      // username: 'itwasmedio',
      // username: 'geoboom',
      // username: 'mynamechef',
      // username: 'lgeorgie',
      // password: '123123123',
      // password: '123123',
      username: '',
      password: '',
    },
    signup: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      username: '',
      password: '',
    },
    loading: false,
    errorMessage: '',
    selectAccountModal: false,
    fieldErrors: [],
  };

  loginSubmit = async () => {
    const { navigation } = this.props;
    const { login: { username, password } } = this.state;
    const { updateUser, initSocket } = this.context;
    const fields = [username, password];
    const fieldErrors = [];
    fields.forEach((field, i) => {
      if (!FIELD_TESTS_LOGIN[i].test(field)) {
        fieldErrors[i] = FIELD_ERRS_LOGIN[i];
      }
    });
    this.setState({ fieldErrors });
    if (fieldErrors.length === 0) {
      this.setState({ loading: true });
      try {
        const response = await axiosHelper.request({
          method: 'POST',
          url: `${BACKEND_IP}/api/auth/signin`,
          data: { username, password },
        });
        this.setState({ loading: false });
        const { accessToken } = response.data;
        const decoded = jwtDecode(accessToken);
        updateUser(
          {
            accessToken,
            ...decoded,
          },
        );
        initSocket();
        navigation.navigate(`MainTabs${decoded.group}`);
      } catch (e) {
        this.setState({
          loading: false,
          errorMessage: axiosHelper.handleError(e),
        });
      }
    }
  };

  signupSubmit = async () => {
    const { navigation } = this.props;
    const {
      signup: {
        firstName, lastName, phoneNumber, username, password,
      },
    } = this.state;
    const fields = [firstName, lastName, phoneNumber, username, password];
    const fieldErrors = [];
    fields.forEach((field, i) => {
      if (!FIELD_TESTS_SIGNUP[i].test(field)) {
        fieldErrors[i] = FIELD_ERRS_SIGNUP[i];
      }
    });
    this.setState({
      fieldErrors,
    });

    if (fieldErrors.length === 0) {
      this.setState({
        loading: true,
      });
      try {
        const response = await axiosHelper.request({
          method: 'POST',
          url: `${BACKEND_IP}/api/auth/signup`,
          data: {
            firstName,
            lastName,
            username,
            password,
          },
        });
        this.setState({
          loading: false,
        });
        navigation.navigate('Login');
        ToastAndroid.showWithGravityAndOffset(
          `Successfully signed up with username ${username}!`,
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          0,
          150,
        );
      } catch (e) {
        this.setState({
          loading: false,
          errorMessage: axiosHelper.handleError(e),
        });
      }
    }
  };

  render() {
    const { formType, navigation } = this.props;
    const { login, signup, loading, fieldErrors, errorMessage, selectAccountModal } = this.state;
    const loginFields = [
      {
        label: 'Username',
        value: login.username,
        field: 'username',
      },
      {
        label: 'Password',
        value: login.password,
        field: 'password',
        secure: true,
      },
    ];
    const signupFields = [
      {
        label: 'First Name',
        value: signup.firstName,
        field: 'firstName',
      },
      {
        label: 'Last Name',
        value: signup.lastName,
        field: 'lastName',
      },
      {
        label: 'Mobile Number',
        value: signup.phoneNumber,
        field: 'phoneNumber',
      },
      {
        label: 'Username',
        value: signup.username,
        field: 'username',
      },
      {
        label: 'Password',
        value: signup.password,
        field: 'password',
        secure: true,
      },
    ];

    return (
      <View
        style={styles.rootContainerStyle}
      >
        <Modal
          isVisible={selectAccountModal}
          onBackdropPress={() => {
            this.setState({ selectAccountModal: false });
          }}
          onBackButtonPress={() => {
            this.setState({ selectAccountModal: false });
          }}
        >
          <View
            style={{ height: 400 }}
          >
            <ScrollView
              style={{
                alignSelf: 'center',
                backgroundColor: 'white',
                paddingLeft: 20,
                paddingRight: 20,
                width: '75%',
              }}
              contentContainerStyle={{
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              <Text
                style={{ fontWeight: 'bold' }}
              >
                Driver
              </Text>
              {
                [
                  {
                    username: 'driver1',
                    password: '123123123',
                  },
                  {
                    username: 'driver2',
                    password: '123123123',
                  },
                  {
                    username: 'driver3',
                    password: '123123123',
                  },
                ].map(({ username, password }, index) => (
                  <Button
                    containerStyle={{ marginTop: (index === 0) * 10, marginBottom: 10 }}
                    key={username}
                    title={username}
                    onPress={() => {
                      this.setState({ login: { username, password } });
                      this.setState({ selectAccountModal: false });
                    }}
                  />
                ))
              }
              <Text
                style={{ fontWeight: 'bold' }}
              >
                Passenger
              </Text>{
                [
                  {
                    username: 'passenger1',
                    password: '123123123',
                  },
                  {
                    username: 'passenger2',
                    password: '123123123',
                  },
                  {
                    username: 'passenger3',
                    password: '123123123',
                  },
                  {
                    username: 'passenger4',
                    password: '123123123',
                  },
                  {
                    username: 'passenger5',
                    password: '123123123',
                  },
                  {
                    username: 'passenger6',
                    password: '123123123',
                  },
                ].map(({ username, password }, index) => (
                  <Button
                    containerStyle={{ marginTop: (index === 0) * 10, marginBottom: 10 }}
                    key={username}
                    title={username}
                    onPress={() => {
                      this.setState({ login: { username, password } });
                      this.setState({ selectAccountModal: false });
                    }}
                  />
                ))
              }
            </ScrollView>
          </View>
        </Modal>
        {
          formType === 'Sign Up'
            ? (
              <View>
                {
                  signupFields.map(
                    ({ label, value, field, secure }, i) => (
                      <View
                        style={{
                          marginBottom: fieldErrors[i]
                            ? 0 : (10 + (i === signupFields.length - 1) * 10),
                        }}
                        key={label}
                      >
                        <View
                          style={{
                            ...styles.inputContainerStyle,
                            borderColor: fieldErrors[i] ? 'red' : 'black',
                          }}
                        >
                          {
                            field === 'username'
                            && <Icon style={{ marginBottom: 2 }} name="account" size={20} color="grey" />
                          }
                          {
                            field === 'password'
                            && <Icon style={{ marginBottom: 4 }} name="lock" size={20} color="grey" />
                          }
                          {
                            (field === 'firstName')
                            && <Icon style={{ marginBottom: 4 }} name="face" size={20} color="grey" />
                          }
                          {
                            (field === 'lastName')
                            && <Icon style={{ marginBottom: 4 }} name="face" size={20} color="grey" />
                          }
                          {
                            (field === 'phoneNumber')
                            && <Icon style={{ marginBottom: 4 }} name="cellphone" size={18} color="grey" />
                          }
                          <TextInput
                            keyboardType={field === 'phoneNumber' ? 'phone-pad' : 'default'}
                            ref={(input) => { this[field] = input; }}
                            autoFocus={i === 0}
                            autoCapitalize="none"
                            returnKeyType={i === signupFields.length - 1 ? 'done' : 'next'}
                            placeholder={label}
                            style={styles.textInputStyle}
                            secureTextEntry={secure}
                            value={value}
                            onChangeText={(text) => {
                              this.setState((prevState) => ({
                                signup: {
                                  ...prevState.signup,
                                  [field]: text,
                                },
                              }));
                            }}
                            onSubmitEditing={() => {
                              if (i < signupFields.length - 1) {
                                this[signupFields[i + 1].field].focus();
                              } else {
                                this.signupSubmit();
                              }
                            }}
                            blurOnSubmit={
                              i === signupFields.length - 1 && fieldErrors.length === 0
                            }
                          />
                        </View>
                        {
                          fieldErrors[i]
                          && (
                            <Text
                              style={{
                                color: 'red',
                                fontSize: 10,
                                alignSelf: 'flex-end',
                                marginBottom: 5 + (i === signupFields.length - 1) * 10,
                              }}
                            >
                              {fieldErrors[i]}
                            </Text>
                          )
                        }
                      </View>
                    ),
                  )
                }
              </View>
            ) : (
              <View>
                <View
                  style={{ flexDirection: 'row' }}
                >
                  {
                    true
                    && (
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          left: -35,
                        }}
                        onPress={() => { this.setState({ selectAccountModal: true }); }}
                      >
                        <IIcon
                          name="md-list-box"
                          size={38}
                        />
                      </TouchableOpacity>
                    )
                  }
                </View>
                {
                  loginFields.map(
                    ({ label, value, field, secure }, i) => (
                      <View
                        style={{
                          marginBottom: 10 + (i === loginFields.length - 1) * 10,
                        }}
                        key={label}
                      >
                        <View
                          style={{
                            ...styles.inputContainerStyle,
                            borderColor: 'black',
                          }}
                        >
                          {
                            field === 'username'
                            && <Icon style={{ marginBottom: 2 }} name="account" size={20} color="grey" />
                          }
                          {
                            field === 'password'
                            && <Icon style={{ marginBottom: 4 }} name="lock" size={20} color="grey" />
                          }
                          <TextInput
                            ref={(input) => { this[field] = input; }}
                            autoCapitalize="none"
                            returnKeyType={i === loginFields.length - 1 ? 'done' : 'next'}
                            placeholder={label}
                            style={styles.textInputStyle}
                            secureTextEntry={secure}
                            value={value}
                            onChangeText={(text) => {
                              this.setState((prevState) => ({
                                login: {
                                  ...prevState.login,
                                  [field]: text,
                                },
                              }));
                            }}
                            onSubmitEditing={() => {
                              if (i < loginFields.length - 1) {
                                this[loginFields[i + 1].field].focus();
                              } else {
                                this.loginSubmit();
                              }
                            }}
                            blurOnSubmit={
                              i === loginFields.length - 1 && fieldErrors.length === 0
                            }
                          />
                        </View>
                      </View>
                    ),
                  )
                }
              </View>
            )
        }
        <Button
          loading={loading}
          containerStyle={styles.buttonContainerStyle}
          buttonStyle={styles.buttonStyle}
          raised
          title={formType === 'Sign In' ? 'Login' : 'Sign Up'}
          onPress={formType === 'Sign In' ? this.loginSubmit : this.signupSubmit}
        />
        <ErrorMessage
          errorMessage={errorMessage}
        />
        <SignUpArea
          show={formType === 'Sign In'}
          onPress={() => { navigation.navigate('Register'); }}
        />
      </View>
    );
  }
}

export default UserForm;
