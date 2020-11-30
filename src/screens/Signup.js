/* eslint-disable react-native/no-inline-styles */
import React, {Fragment, Component} from 'react';
import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import FormTextInput from '../components/FormTextInput';
import Button from '../components/Button';
import ConfigData from './config';
import AsyncStorage from '@react-native-community/async-storage';

export default class SignupScreen extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    address: '',
    phoneno: '',
    signupButtonDisabled: false,
  };

  handleEmailChange = email => {
    this.setState({email: email});
  };

  handlePasswordChange = password => {
    this.setState({password: password});
  };

  emailCorrect = email => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View
            style={{
              flex: 0.4,
              width: '100%',
              height: '30%',
              padding: 0,
              paddingTop: '30%',
              backgroundColor: 'white',
            }}>
            <Text style={{color: 'black', fontSize: 35, textAlign: 'center'}}>
              Medical App Test
            </Text>
          </View>
          <View style={{flex: 1, width: '80%'}}>
            <FormTextInput
              value={this.state.name}
              onChangeText={name => {
                this.setState({name: name});
              }}
              placeholder={'Your name'}
            />
            <FormTextInput
              value={this.state.email}
              onChangeText={this.handleEmailChange}
              placeholder={'E-mail'}
            />
            <FormTextInput
              value={this.state.password}
              secureTextEntry={true}
              onChangeText={this.handlePasswordChange}
              placeholder={'Password'}
            />
            <FormTextInput
              value={this.state.confirm_password}
              secureTextEntry={true}
              onChangeText={confirm_password => {
                this.setState({confirm_password: confirm_password});
              }}
              placeholder={'Confirm Password'}
            />
            <FormTextInput
              value={this.state.phoneno}
              onChangeText={phoneno => {
                this.setState({phoneno: phoneno});
              }}
              placeholder={'Phone Number'}
            />
            <FormTextInput
              value={this.state.address}
              onChangeText={address => {
                this.setState({address: address});
              }}
              placeholder={'Address'}
            />
            <Button
              label={'Next'}
              disabled={this.state.signupButtonDisabled}
              onPress={navigate => {
                let email = this.state.email.trim();
                let name = this.state.name.trim();
                let password = this.state.password;
                let state = this.state;

                if (name.length < 3) {
                  Alert.alert(
                    'Error',
                    'Your name is too short. Try to enter full name.',
                  );
                  return;
                }
                if (!this.emailCorrect(email)) {
                  Alert.alert('Error', 'Invalid E-mail Address! Try again.');
                  return;
                }

                if (this.state.password !== this.state.confirm_password) {
                  Alert.alert('Error', "Passwords don't match!");
                  return;
                }

                if (this.state.password.length < 4) {
                  Alert.alert(
                    'Error',
                    'Password should be at least 4 characters! Try again.',
                  );
                  return;
                }

                this.setState({signupButtonDisabled: true});

                fetch(ConfigData.SERVER_HOST + 'api/user/', {
                  method: 'POST',
                  timeout: 20,
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    name: name,
                    email: email.toLowerCase(),
                    password: password,
                    phoneno: state.phoneno,
                    address: state.address,
                  }),
                })
                  .then(response => {
                    return response.json();
                  })
                  .then(responseJson => {
                    this.setState({signupButtonDisabled: false});
                    AsyncStorage.setItem('login_email', email.toLowerCase());
                    AsyncStorage.setItem('login_password', password);
                    console.log(responseJson);
                    if (responseJson.message === 'success') {
                      this.props.navigation.navigate('SignupDetail', {
                        userID: responseJson.value,
                      });
                      return;
                    } else {
                      if (
                        responseJson.error &&
                        responseJson.error.includes('UNIQUE constraint')
                      ) {
                        Alert.alert(
                          'Failure',
                          'Email already existing. Try again.',
                        );
                      } else {
                        Alert.alert(
                          'Failure',
                          'Failed to create an account. Try again.',
                        );
                      }
                    }
                  })
                  .catch(error => {
                    Alert.alert('Error', 'Unexpected error has occurred');
                    console.log(error);
                    this.setState({signupButtonDisabled: false});
                  });
              }}
            />
          </View>
          <View>
            <Text
              style={{
                width: '100%',
                textAlign: 'center',
                color: 'blue',
                paddingBottom: 40,
              }}
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              Log in
            </Text>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    //justifyContent: "space-between"
  },
});
