/* eslint-disable no-extend-native */
/* eslint-disable react-native/no-inline-styles */
import React, {Fragment, Component} from 'react';
import {
  Alert,
  Image,
  Keyboard,
  AsyncStorage,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  KeyboardAvoidingView,
  View,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import FormTextInput from '../components/FormTextInput';
import ConfigData from './config';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Button from '../components/Button';
let activityLevelList = [
  {value: 'Little/No exercise (sedentary lifestyle)'},
  {value: 'Light exercise (1/2 times a week)'},
  {value: 'Moderate exercise (2-3 times a week)'},
  {value: 'Hard exercise (4-5 times a week)'},
  {value: 'Harder exercise (6-7 times a week)'},
  {value: 'Professional athlete'},
];
const weekdays = [
  {value: 'Sunday'},
  {value: 'Monday'},
  {value: 'Tuesday'},
  {value: 'Wednesday'},
  {value: 'Thursday'},
  {value: 'Friday'},
  {value: 'Saturday'},
];
export default class ProfileScreen extends Component {
  state = {
    name: global.myprofile.name,
    email: global.myprofile.email,
    password: '',
    confirm_password: '',
    address: global.myprofile.address,
    activityLevel: global.myprofile.activityLevel,
    phoneno: global.myprofile.phoneno,
    gender: global.myprofile.gender === 'Male' ? 0 : 1,
    signupButtonDisabled: false,
    current_height: '' + global.myprofile.height,
    current_weight: '' + global.myprofile.weight,
    weight_unit: global.myprofile.weight_unit,
    height_unit: global.myprofile.height_unit,
    age: '' + global.myprofile.age,
    calorieGoal: '' + global.myprofile.calorieGoal.toFixedNumber(1),
    weight_date: global.myprofile.weight_date,
    weighinNotificationDay: global.myprofile.weighinNotificationDay || 1,
    saving: 0,
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
    const {name, email, password, phoneno, address} = global.myprofile;
    console.log('current profile', global.myprofile);
    return (
      <ScrollView
        style={{
          width: Dimensions.get('screen').width - 20,
          height: '100%',
          paddingLeft: 10,
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={{flex: 1, width: '100%', paddingTop: 10}}>
              <Text style={{width: 100, marginTop: 10}}>Gender</Text>
              <View style={{paddingTop: 10}}>
                <SegmentedControlTab
                  values={['Male', 'Female', 'Not to say']}
                  selectedIndex={this.state.gender}
                  onTabPress={gender => {
                    global.myprofile.gender = ['Male', 'Female', 'Not to say'][
                      gender
                    ];
                    this.setState({gender: gender});
                  }}
                />
              </View>
              <Text style={{width: 100, marginTop: 10}}>Weight Unit</Text>
              <View style={{paddingTop: 10}}>
                <SegmentedControlTab
                  values={['lbs', 'kg']}
                  selectedIndex={this.state.weight_unit}
                  onTabPress={s => {
                    global.myprofile.weight_unit = s;
                    this.setState({weight_unit: s});
                  }}
                />
              </View>
              <Text style={{width: 100, marginTop: 10}}>Height Unit</Text>

              <View style={{paddingTop: 10}}>
                <SegmentedControlTab
                  values={['Feet', 'Cm']}
                  selectedIndex={this.state.height_unit}
                  onTabPress={s => {
                    global.myprofile.height_unit = s;
                    this.setState({height_unit: s});
                  }}
                />
              </View>

              <Text style={{width: 100, marginTop: 50}}>Current Weight</Text>
              <FormTextInput
                value={
                  this.state.weight_unit === 0
                    ? this.state.current_weight
                    : GetToFixedNumber(this.state.current_weight * 2.205, 2)
                }
                onChangeText={current_weight => {
                  if (this.state.weight_unit === 0) {
                    this.setState({current_weight: current_weight});
                    global.myprofile.weight = current_weight;
                  } else {
                    this.setState({current_weight: current_weight / 2.205});
                    global.myprofile.weight = current_weight / 2.205;
                  }
                }}
              />

              <Text style={{width: 100}}>Current Height</Text>
              <FormTextInput
                value={
                  this.state.height_unit === 0
                    ? this.state.current_height
                    : GetToFixedNumber(this.state.current_height / 30.48, 2)
                }
                onChangeText={current_height => {
                  if (this.state.height_unit === 0) {
                    this.setState({current_height: current_height});
                    global.myprofile.height = current_height;
                  } else {
                    this.setState({current_height: 30.48 * current_height});
                    global.myprofile.height = 30.48 * current_height;
                  }
                }}
              />

              <Text style={{width: 100}}>Age</Text>
              <FormTextInput
                value={this.state.age}
                onChangeText={age => {
                  global.myprofile.age = age;
                  this.setState({age: age});
                }}
              />

              <Text style={{width: 300}}>My Daily Calorie Limit</Text>

              <FormTextInput
                value={this.state.calorieGoal}
                onChangeText={daily_limit => {
                  this.setState({calorieGoal: daily_limit});
                }}
              />

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
                data={activityLevelList}
                value={activityLevelList[this.state.activityLevel].value}
                onChangeText={(value, index, data) => {
                  global.myprofile.activityLevel = index;
                  this.setState({activityLevel: index});
                }}
              />
            </View>
            <View style={{width: '100%', marginTop: 30}}>
              <Text>Weigh-in notification day</Text>
              <Dropdown
                style={{
                  width: 200,
                  height: 30,
                  borderWidth: 1,
                  borderColor: '#ddd',
                }}
                dropdownOffset={{top: 10, left: 0}}
                itemCount={4}
                data={weekdays}
                value={weekdays[this.state.weighinNotificationDay].value}
                onChangeText={(value, index, data) => {
                  global.myprofile.weighinNotificationDay = index;
                  this.setState({weighinNotificationDay: index});
                  AsyncStorage.setItem('weighinNotificationDay', index);
                }}
              />
            </View>
            <Button
              label={'Save to server'}
              disabled={this.state.loginButtonDisabled}
              onPress={navigate => {
                this.setState({saving: true});
                fetch(ConfigData.SERVER_HOST + 'api/save_profile', {
                  method: 'post',
                  body: JSON.stringify({}),
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                })
                  .then(_response => {
                    this.setState({saving: false});
                  })
                  .catch(_e => {
                    // eslint-disable-next-line no-alert
                    alert('Error in saving the data! Try later.');
                    this.setState({saving: false});
                  });
              }}
            />
            <View style={{height: 50}} />
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        {this.state.saving ? (
          <View
            style={{
              flex: 1,
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.1)',
            }}>
            <ActivityIndicator
              size="large"
              color="black"
              style={{marginTop: '45%'}}
            />
          </View>
        ) : (
          <View />
        )}
      </ScrollView>
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

const toFixedNumber = function(n) {
  let val = Number(this).toFixed(n);
  for (var i = val.length - 1; i >= val.length - n; i--) {
    if (val.substr(i, 1) === 0) {
      val = val.substr(0, i);
    } else {
      break;
    }
  }

  if (val.substr(val.length - 1, 1) === '.') {
    val = val.substr(0, val.length - 1);
  }
  return val;
};

function GetToFixedNumber(s, n) {
  n = n || 0;
  if (typeof s === 'undefined') {
    return 'undefined';
  } else {
    return s.toFixedNumber(n);
  }
}

String.prototype.toFixedNumber = toFixedNumber;
Number.prototype.toFixedNumber = toFixedNumber;
