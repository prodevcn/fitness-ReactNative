/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TextInput,
  Keyboard,
  Alert,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';
import SideMenu from 'react-native-side-menu';
import Menu from './Menu';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import DashboardView from './DashboardView';
import StatsView from './StatsView';
import TrackView from './TrackView';
import SuggestedView from './SuggestedView';
import PreferenceView from './PreferenceView';
import ConfigData from './config';
import SearchView from './SearchView';
import ProfileScreen from './profile';
import Database from '../database/Database';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import firebase from 'react-native-firebase';

const image = require('../assets/images/menu.png');

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    paddingTop: 4,
    paddingLeft: 10,
  },
  navigationTitle: {
    width: '100%',
    textAlign: 'center',
    paddingTop: 8,
    marginTop: getStatusBarHeight(),
    fontSize: 20,
    position: 'absolute',
    color: 'white',
  },
  navigationTitleSearch: {
    width: '100%',
    paddingTop: 8,
    marginTop: getStatusBarHeight() - 3,
    position: 'absolute',
  },
  caption: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  container: {
    marginTop: 44 + getStatusBarHeight(),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginBottom: 44 + getStatusBarHeight(),
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  navigationBar: {
    height: 44 + getStatusBarHeight(),
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#ff0000',
  },
  tabBar: {
    height: 44 + getStatusBarHeight(),
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#ff0000',
    flexDirection: 'row',
  },
  tabBarChild: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  tabLabel: {
    fontSize: 12,
  },
});

export default class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.dashboardScreen = null;
    this.toggle = this.toggle.bind(this);
    this.nagivation = this.props.navigation;
    this.state = {
      searchViewDisplay: false,
      currentFoodTime: 0,
      isOpen: false,
      selectedItem: 'Home',
      tabIndex: 0,
      titleBarSearch: 1,
      searchText: '',
    };
    this.onSearchFieldFocus = this.onSearchFieldFocus.bind(this);
    this.ShowContent = this.ShowContent.bind(this);
    this.checkPermission = this.checkPermission.bind(this);
    this.onSearchFieldChangeFromChild = text => {};

    setTimeout(() => {
      if (Platform.OS === 'ios') {
        console.log('Push notification');

        PushNotificationIOS.setApplicationIconBadgeNumber(0);

        PushNotificationIOS.cancelLocalNotifications({
          type: ConfigData.ALERT.REGISTER_BREAKFAST,
        });
        PushNotificationIOS.scheduleLocalNotification({
          fireDate: new Date(2020, 2, 1, 10, 0, 0).getTime(),
          alertBody: ConfigData.ALERT.REGISTER_BREAKFAST,
          alertTitle: 'MedLynk',
          applicationIconBadgeNumber: 1,
          repeatInterval: 'day',
          userInfo: {type: ConfigData.ALERT.REGISTER_BREAKFAST},
        });

        PushNotificationIOS.cancelLocalNotifications({
          type: ConfigData.ALERT.REGISTER_LUNCH,
        });
        PushNotificationIOS.scheduleLocalNotification({
          fireDate: new Date(2020, 2, 1, 15, 0, 0).getTime(),
          alertBody: ConfigData.ALERT.REGISTER_LUNCH,
          alertTitle: 'MedLynk',
          applicationIconBadgeNumber: 1,
          repeatInterval: 'day',
          userInfo: {type: ConfigData.ALERT.REGISTER_LUNCH},
        });

        PushNotificationIOS.cancelLocalNotifications({
          type: ConfigData.ALERT.REGISTER_DINNER,
        });
        PushNotificationIOS.scheduleLocalNotification({
          fireDate: new Date(2020, 2, 1, 22, 0, 0).getTime(),
          alertBody: ConfigData.ALERT.REGISTER_DINNER,
          alertTitle: 'MedLynk',
          applicationIconBadgeNumber: 1,
          repeatInterval: 'day',
          userInfo: {type: ConfigData.ALERT.REGISTER_DINNER},
        });

        PushNotificationIOS.cancelLocalNotifications({
          type: ConfigData.ALERT.WEEKLY_WEIGHIN,
        });
        var monday = new Date(2020, 2, 1, 9, 0, 0);
        while (
          monday.getDay() !==
          parseInt(global.myprofile.weighinNotificationDay, 10)
        ) {
          monday = new Date(monday.getTime() + 86400 * 1000);
        }

        PushNotificationIOS.scheduleLocalNotification({
          fireDate: monday.getTime(),
          alertBody: ConfigData.ALERT.WEEKLY_WEIGHIN,
          alertTitle: 'MedLynk',
          applicationIconBadgeNumber: 1,
          repeatInterval: 'week',
          userInfo: {type: ConfigData.ALERT.WEEKLY_WEIGHIN},
        });

        PushNotificationIOS.cancelLocalNotifications({
          type: ConfigData.ALERT.MONTHLY_WEIGHIN,
        });
        PushNotificationIOS.scheduleLocalNotification({
          fireDate: new Date(2020, 2, 1, 9, 30, 0).getTime(),
          alertBody: ConfigData.ALERT.MONTHLY_WEIGHIN,
          alertTitle: 'MedLynk',
          applicationIconBadgeNumber: 1,
          repeatInterval: 'month',
          userInfo: {type: ConfigData.ALERT.MONTHLY_WEIGHIN},
        });
      }
    }, 1000);

    setInterval(() => {
      PushNotificationIOS.cancelLocalNotifications({
        type: ConfigData.ALERT.NOT_LOGGED_IN,
      });
      var tomorrow = new Date(new Date().getTime() + 86400 * 1000);
      PushNotificationIOS.scheduleLocalNotification({
        fireDate: tomorrow.getTime(),
        alertBody: ConfigData.ALERT.NOT_LOGGED_IN,
        alertTitle: 'MedLynk',
        applicationIconBadgeNumber: 1,
        repeatInterval: 'day',
        userInfo: {type: ConfigData.ALERT.NOT_LOGGED_IN},
      });
    }, 1000 * 60 * 10); //EVERY 10 MINUTES
  }

  componentDidMount() {
    this.checkPermission();
    this.messageListener();
  }

  checkPermission = async () => {
    console.log('------------------Checking firebase permission');
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log('Firebase Permission enabled');
      this.getFcmToken();
    } else {
      console.log('Firebase Permission disabled');
      this.requestPermission();
    }
  };

  getFcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log('FCM TOKEN: ', fcmToken);
      // this.showAlert('Your Firebase Token is: ', fcmToken);
      // AsyncStorage.setItem('fcm_token', fcmToken);
      fetch(ConfigData.SERVER_HOST + 'api/token_reg', {
        method: 'post',
        body: JSON.stringify({
          user_id: global.myprofile.userID,
          token: fcmToken,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    } else {
      this.showAlert('Failed', 'No token received');
    }
  };
  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
    }
  };

  messageListener = async () => {
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const {title, body} = notification;
        this.showAlert(title, body);
      });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const {title, body} = notificationOpen.notification;
        this.showAlert(title, body);
      });

    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {title, body} = notificationOpen.notification;
      this.showAlert(title, body);
    }

    this.messageListener = firebase.messaging().onMessage(message => {
      console.log(JSON.stringify(message));
    });
  };

  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  };

  toggle() {
    if (!this.state.searchViewDisplay) {
      this.setState({
        isOpen: !this.state.isOpen,
      });
    } else {
      this.setState({
        searchViewDisplay: false,
      });
      Keyboard.dismiss();
    }
  }

  updateMenuState(isOpen) {
    this.setState({isOpen});
  }

  onMenuItemSelected = item =>
    this.setState({
      isOpen: false,
      selectedItem: item,
    });

  submitDailyMeal = () => {
    this.dashboardScreen.submitData();
  };

  ShowContent = () => {
    switch (this.state.tabIndex) {
      case 0:
        return <DashboardView parentObj={this} setchild={this.setdashboard} />;
      case 1:
        return <StatsView parentObj={this} />;
      case 2:
        return <TrackView parentObj={this} />;
      case 3:
        return <SuggestedView parentObj={this} />;
      case 4:
        return <ProfileScreen parentObj={this} />;
    }

    return null;
  };
  setdashboard = a => {
    this.dashboardScreen = a;
  };
  addFood = food => {
    this.setState({tabIndex: 0, searchViewDisplay: false});
    setTimeout(() => {
      this.dashboardScreen.addFood(food);
    }, 100);
  };

  onSearchFieldFocus = () => {
    this.setState({searchViewDisplay: true, currentFoodTime: 0});
  };

  onSearchFieldChange = text => {
    this.onSearchFieldChangeFromChild(text);
  };

  render() {
    const contentView = (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          {this.ShowContent()}
          {this.state.searchViewDisplay && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}>
              <SearchView parentObj={this} />
            </View>
          )}
        </View>
      </View>
    );

    const menu = (
      <Menu onItemSelected={this.onMenuItemSelected} contentView={this} />
    );

    return (
      <SideMenu
        menu={menu}
        isOpen={this.state.isOpen}
        onChange={isOpen => this.updateMenuState(isOpen)}>
        <View style={styles.navigationBar}>
          {!(
            this.state.tabIndex === ConfigData.TAB_DASHBOARD ||
            this.state.tabIndex === ConfigData.TAB_TRACK ||
            this.state.tabIndex === ConfigData.TAB_SEARCH
          ) ? (
            <Text style={styles.navigationTitle}>
              {(() => {
                switch (this.state.tabIndex) {
                  case 0:
                    return 'Dashboard';
                  case 1:
                    return 'Stats';
                  case 2:
                    return 'Track';
                  case 3:
                    return 'Suggested';
                  case 4:
                    return 'Preferences';
                }
              })()}
            </Text>
          ) : (
            <View
              style={[styles.navigationTitleSearch, {flexDirection: 'row'}]}>
              <TextInput
                placeholder="Search foods to log"
                onChangeText={text => this.setState({searchText: text})}
                style={{
                  flex: 1,
                  marginLeft: 80,
                  marginRight: 80,
                  paddingLeft: 5,
                  height: 30,
                  backgroundColor: 'white',
                  borderRadius: 3,
                  marginTop: 0,
                  marginBottom: 2,
                }}
                onFocus={this.onSearchFieldFocus}
              />

              <TouchableOpacity
                style={{position: 'absolute', right: 85, top: 3}}>
                <Icon5
                  name="barcode"
                  style={{lineHeight: 40, color: '#ff0000'}}
                  size={30}
                />
              </TouchableOpacity>
              {this.state.searchViewDisplay && (
                <TouchableOpacity
                  style={{position: 'absolute', right: 10, top: 7}}
                  onPress={() =>
                    this.onSearchFieldChange(this.state.searchText)
                  }>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      lineHeight: 30,
                      fontSize: 15,
                    }}>
                    Search
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <TouchableOpacity
            onPress={this.toggle}
            style={[styles.backButton, {marginTop: getStatusBarHeight()}]}>
            <Text style={{color: 'white'}}>
              {!this.state.searchViewDisplay ? (
                <Icon5 name="bars" size={30} />
              ) : (
                <Icon5 name="angle-left" size={30} />
              )}
            </Text>
          </TouchableOpacity>

          {this.state.searchViewDisplay === false &&
          (this.state.tabIndex === 0 || this.state.tabIndex === 2) ? (
            <TouchableOpacity
              onPress={this.submitDailyMeal}
              style={[
                styles.backButton,
                {marginTop: getStatusBarHeight(), right: 14},
              ]}>
              <Text style={{color: 'white'}}>
                <Icon name="paper-plane" size={30} />
              </Text>
              {/* <Text adjustsFontSizeToFit numberOfLines={1}
                                        style={{
                                            color: 'white', lineHeight: 16, backgroundColor: 'blue',
                                            textAlign: 'center', borderRadius: 9, width: 16, height: 16,
                                            position: 'absolute', right: -4, top: 0
                                        }}>
                                        1
                                    </Text> */}
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
        {contentView}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBarChild, {flexDirection: 'column'}]}
            onPress={() => {
              this.setState({tabIndex: 0});
            }}>
            <Text
              style={{
                textAlign: 'center',
                paddingTop: 5,
                paddingBottom: 5,
                color: this.state.tabIndex !== 0 ? 'white' : '#f7af59',
              }}>
              <Icon name="columns" size={20} />
            </Text>
            <Text
              style={[
                styles.tabLabel,
                {
                  textAlign: 'center',
                  fontWeight: this.state.tabIndex !== 0 ? 'normal' : 'bold',
                  color: this.state.tabIndex !== 0 ? 'white' : '#f7af59',
                },
              ]}>
              Dashboard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBarChild, {flexDirection: 'column'}]}
            onPress={() => {
              this.setState({tabIndex: 1});
            }}>
            <Text
              style={{
                textAlign: 'center',
                paddingTop: 5,
                paddingBottom: 5,
                color: this.state.tabIndex !== 1 ? 'white' : '#f7af59',
              }}>
              <Icon name="signal" size={20} />
            </Text>
            <Text
              style={[
                styles.tabLabel,
                {
                  textAlign: 'center',
                  fontWeight: this.state.tabIndex !== 1 ? 'normal' : 'bold',
                  color: this.state.tabIndex !== 1 ? 'white' : '#f7af59',
                },
              ]}>
              Stats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBarChild, {flexDirection: 'column'}]}
            onPress={() => {
              this.setState({tabIndex: 2});
            }}>
            <Text
              style={{
                textAlign: 'center',
                paddingTop: 5,
                paddingBottom: 5,
                color: this.state.tabIndex !== 2 ? 'white' : '#f7af59',
              }}>
              <Icon name="magic" size={20} />
            </Text>
            <Text
              style={[
                styles.tabLabel,
                {
                  textAlign: 'center',
                  fontWeight: this.state.tabIndex !== 2 ? 'normal' : 'bold',
                  color: this.state.tabIndex !== 2 ? 'white' : '#f7af59',
                },
              ]}>
              Track
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBarChild, {flexDirection: 'column'}]}
            onPress={() => {
              this.setState({tabIndex: 3});
            }}>
            <Text
              style={{
                textAlign: 'center',
                paddingTop: 5,
                paddingBottom: 5,
                color: this.state.tabIndex !== 3 ? 'white' : '#f7af59',
              }}>
              <Icon name="wpexplorer" size={20} />
            </Text>
            <Text
              style={[
                styles.tabLabel,
                {
                  textAlign: 'center',
                  fontWeight: this.state.tabIndex !== 3 ? 'normal' : 'bold',
                  color: this.state.tabIndex !== 3 ? 'white' : '#f7af59',
                },
              ]}>
              Suggested
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBarChild, {flexDirection: 'column'}]}
            onPress={() => {
              this.setState({tabIndex: 4});
            }}>
            <Text
              style={{
                textAlign: 'center',
                paddingTop: 5,
                paddingBottom: 5,
                color: this.state.tabIndex !== 4 ? 'white' : '#f7af59',
              }}>
              <Icon name="cogs" size={20} />
            </Text>
            <Text
              style={[
                styles.tabLabel,
                {
                  textAlign: 'center',
                  fontWeight: this.state.tabIndex !== 4 ? 'normal' : 'bold',
                  color: this.state.tabIndex !== 4 ? 'white' : '#f7af59',
                },
              ]}>
              Preferences
            </Text>
          </TouchableOpacity>
        </View>
      </SideMenu>
    );
  }
}
