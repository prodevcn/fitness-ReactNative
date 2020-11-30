/* eslint-disable no-alert */
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
import {Dropdown} from 'react-native-material-dropdown';
import FormTextInput from '../components/FormTextInput';
import Button from '../components/Button';
import ConfigData from './config';
import SegmentedControlTab from 'react-native-segmented-control-tab';

export default class SignupDetailScreen extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    address: '',
    activityLevel: 0,
    phoneno: '',
    gender: 0,
    signupButtonDisabled: false,
    weight_unit: 0,
    height_unit: 0,
    current_weight: '',
    weight1: '',
    current_height: '',
    height1: '',
    height2: '',
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
    const {
      name,
      email,
      password,
      phoneno,
      address,
    } = this.props.navigation.state.params;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View style={{flex: 1, width: '80%', paddingTop: 50}}>
            <Text style={{width: 100, marginTop: 50}}>Gender</Text>
            <View style={{paddingTop: 10}}>
              <SegmentedControlTab
                values={['Male', 'Female', 'Not to say']}
                selectedIndex={this.state.gender}
                onTabPress={gender => this.setState({gender: gender})}
              />
            </View>
            <Text style={{width: 100, marginTop: 50}}>Current Weight</Text>
            <View style={{flexDirection: 'row'}}>
              <FormTextInput
                style={{flex: 1}}
                value={
                  this.state.weight_unit
                    ? this.state.current_weight + ''
                    : this.state.weight1 + ''
                }
                onChangeText={current_weight => {
                  this.state.weight_unit === 0
                    ? this.setState({
                        weight1: current_weight,
                        current_weight: toFixedNumber(
                          current_weight / 2.20462,
                          1,
                        ),
                      })
                    : this.setState({
                        current_weight,
                        weight1: toFixedNumber(current_weight * 2.20462, 1),
                      });
                }}
              />
              <Text style={{paddingTop: 15}}>
                {this.state.weight_unit ? 'kg' : 'lbs'}
              </Text>
            </View>
            <View style={{paddingTop: 10, paddingBottom: 30}}>
              <SegmentedControlTab
                values={['lbs', 'kg']}
                selectedIndex={this.state.weight_unit}
                onTabPress={weight_unit => this.setState({weight_unit})}
              />
            </View>
            {this.state.height_unit
              ? [
                  <Text style={{width: 100}}>Current Height</Text>,
                  <View style={{flexDirection: 'row'}}>
                    <FormTextInput
                      style={{flex: 1}}
                      value={this.state.current_height + ''}
                      onChangeText={current_height => {
                        this.setState({
                          current_height,
                          height1: parseInt(current_height / 30.48, 10),
                          height2: toFixedNumber(
                            (current_height -
                              parseInt(current_height / 30.48, 10) * 30.48) /
                              2.54,
                            1,
                          ),
                        });
                      }}
                    />
                    <Text style={{paddingTop: 15}}>cm</Text>
                  </View>,
                ]
              : [
                  <Text style={{width: 100}}>Current Height</Text>,
                  <View style={{flexDirection: 'row'}}>
                    <FormTextInput
                      style={{width: '40%'}}
                      value={this.state.height1 + ''}
                      onChangeText={height1 => {
                        this.setState({
                          height1,
                          current_height:
                            (height1 * 12 + Number(this.state.height2)) * 2.54,
                        });
                      }}
                    />
                    <Text style={{paddingTop: 15, paddingRight: 30}}>
                      fts.{' '}
                    </Text>
                    <FormTextInput
                      style={{width: '40%'}}
                      value={this.state.height2 + ''}
                      onChangeText={height2 => {
                        this.setState({
                          height2,
                          current_height:
                            (this.state.height1 * 12 + Number(height2)) * 2.54,
                        });
                      }}
                    />
                    <Text style={{paddingTop: 15}}>in. </Text>
                  </View>,
                ]}
            <View style={{paddingTop: 10, paddingBottom: 30}}>
              <SegmentedControlTab
                values={['feet', 'cm']}
                selectedIndex={this.state.height_unit}
                onTabPress={height_unit => this.setState({height_unit})}
              />
            </View>

            <Text style={{width: 100}}>Age</Text>
            <View style={{flexDirection: 'row'}}>
              <FormTextInput
                style={{flex: 1}}
                value={this.state.age}
                onChangeText={age => {
                  this.setState({age: age});
                }}
              />
              <Text style={{paddingTop: 15}}>years old</Text>
            </View>

            {/* <Text style={{width: 300}}>My Daily Calorie Limit</Text>

            <FormTextInput
              value={this.state.daily_limit}
              onChangeText={daily_limit => {
                this.setState({daily_limit: daily_limit});
              }}
            /> */}

            <Text style={{width: 300}}>Activity Level</Text>
            <Dropdown
              style={{
                width: 200,
                height: 30,
                borderWidth: 1,
                borderColor: '#ddd',
              }}
              dropdownOffset={{top: 10, left: 0}}
              itemCount={6}
              data={[
                {value: 'Little/No exercise (sedentary lifestyle)'},
                {value: 'Light exercise (1/2 times a week)'},
                {value: 'Moderate exercise (2-3 times a week)'},
                {value: 'Hard exercise (4-5 times a week)'},
                {value: 'Harder exercise (6-7 times a week)'},
                {value: 'Professional athlete'},
              ]}
              value={'Little/No exercise (sedentary lifestyle)'}
              onChangeText={(value, index, data) => {
                this.setState({activityLevel: index});
              }}
            />
          </View>
          <View style={{width: '70%'}}>
            <Button
              label={'Complete Registration'}
              disabled={this.state.signupButtonDisabled}
              onPress={navigate => {
                if (isNaN(this.state.current_weight)) {
                  alert('Please enter the valid number in weight field');
                  return;
                }
                if (isNaN(this.state.current_height)) {
                  alert('Please enter the valid number in height field');
                  return;
                }

                let daily_limit = 0;
                let coActivityLevel = 0;
                let isMale = this.state.gender === 0;
                let bmr =
                  10 * this.state.current_weight +
                  6.25 * this.state.current_height -
                  5 * this.state.age +
                  (isMale ? +5 : -161);

                switch (this.state.activityLevel) {
                  case 0:
                    coActivityLevel = 1.2;
                    break;
                  case 1:
                    coActivityLevel = 1.4;
                    break;
                  case 2:
                    coActivityLevel = 1.6;
                    break;
                  case 3:
                    coActivityLevel = 1.75;
                    break;
                  case 4:
                    coActivityLevel = 2;
                    break;
                  case 5:
                    coActivityLevel = 2.3;
                    break;
                  default:
                    coActivityLevel = 10;
                    break;
                }

                daily_limit = bmr * coActivityLevel;
                this.setState({signupButtonDisabled: true, daily_limit});

                fetch(ConfigData.SERVER_HOST + 'api/user_cnt/', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    user_id: this.props.navigation.state.params.userID,
                    starting_weight: this.state.current_weight,
                    current_weight: this.state.current_weight,
                    current_height: this.state.current_height,
                    age: this.state.age,
                    daily_calorie_limit: daily_limit,
                    gender: this.state.gender,
                    activityLevel: this.state.activityLevel,
                    weight_unit: this.state.weight_unit,
                    height_unit: this.state.height_unit,
                  }),
                })
                  .then(response => response.json())
                  .then(responseJson => {
                    this.setState({signupButtonDisabled: false});
                    if (responseJson.message === 'success') {
                      global.myDB.db.executeSql(
                        "insert into weight_logs (`date`, user_id, weight) values ('" +
                          toDateString(new Date()) +
                          "', " +
                          responseJson.value +
                          ', ' +
                          this.state.current_weight +
                          ')',
                      );
                      Alert.alert(
                        'Success',
                        'You created your account successfully.',
                      );
                      this.props.navigation.pop(2);
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
                    this.setState({signupButtonDisabled: false});
                    Alert.alert('Error', 'Unexpected error has occurred');
                  });
              }}
            />
            <Text
              style={{
                width: '100%',
                textAlign: 'center',
                color: 'blue',
                paddingBottom: 40,
              }}
              onPress={() => {
                this.props.navigation.pop(1);
              }}>
              Back
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

function toFixedNumber(m, n) {
  let val = Number(m).toFixed(n);
  for (var i = val.length - 1; i >= val.length - n; i--) {
    if (val.substr(i, 1) === 0) {
      val = val.substr(0, i);
    } else {
      break;
    }
  }

  if (val.substr(val.length - 1, 1) === '.') {
    return val.substr(0, val.length - 1);
  }
  return val;
}

function toDateString(date) {
  return (
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) +
    '-' +
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
  );
}
