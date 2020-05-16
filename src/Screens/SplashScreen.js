import React, { Component } from 'react';
import {
  View, Image, Dimensions,
} from 'react-native';

import { withGlobalContext } from '../GlobalContext';

class SplashScreen extends Component {
  async componentDidMount() {
    const { navigation, global } = this.props;
    const { bootstrapAsync } = global;

    const user = await bootstrapAsync();
    if (user) {
      navigation.navigate(`MainTabs${user.group}`);
    } else {
      navigation.navigate('LoginRegister');
    }
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 100 }}>
        <Image
          source={require('../app_logo.png')}
          resizeMode="cover"
          style={{
            borderColor: '#1a237e',
            borderRadius: 10,
            width: Dimensions.get('window').width / 2.5,
            height: Dimensions.get('window').width / 2.5,
            marginBottom: 10,
          }}
        />
      </View>
    );
  }
}

export default withGlobalContext(SplashScreen);
