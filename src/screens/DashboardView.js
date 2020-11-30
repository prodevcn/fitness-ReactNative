/* eslint-disable no-extend-native */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Dimensions,
  Platform,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  View,
  Image,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {PieChart} from 'react-native-chart-kit';
import DialogInput from 'react-native-dialog-input';
import ConfigData from './config';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const getWeekday = d => {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return weekdays[d.getDay()];
};

const getLabel = date => {
  return (
    date.getFullYear() +
    '/' +
    (date.getMonth() + 1) +
    '/' +
    date.getDate() +
    ' ' +
    getWeekday(date)
  );
};
const getLabelWithoutWeekday = date => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return (
    date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
  );
};

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
  s = s || 0;
  if (typeof s === 'undefined') {
    return 'undefined';
  } else {
    return s.toFixedNumber(n);
  }
}

String.prototype.toFixedNumber = toFixedNumber;
Number.prototype.toFixedNumber = toFixedNumber;

export default class DashboardView extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      inputDialog: false,
      today: new Date(),
      currentFoodTime: 0,
      todayLabel: getLabel(new Date()),
      dinners: [],
      breakfast: [],
      lunch: [],
      dinner: [],
      weightLogs: [],
      latesnacks: [],
      breakfastList: [],
      dinnerList: [],
      lunchList: [],
      snackList: [],
      exerciseList: [],
      exercises: [],
      currentlyOpenSwipeable: null,
      pieChartVisible: true,
      carbo: 0,
      fat: 0,
      protein: 0,
      saving: false,
    };
    this.cancelSwipeRowBack = this.cancelSwipeRowBack.bind(this);
    this.parentObj = this.props.parentObj;
    this.onPrevDate = this.onPrevDate.bind(this);
    this.onNextDate = this.onNextDate.bind(this);
    this.addFood = this.addFood.bind(this);
    this.addBreakfast = this.addBreakfast.bind(this);
    this.addLunch = this.addLunch.bind(this);
    this.addDinner = this.addDinner.bind(this);
    this.addSnack = this.addSnack.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.weightLogs = this.weightLogs.bind(this);
    this.addLogWeight = this.addLogWeight.bind(this);

    this.goToSearchAndAdd = this.goToSearchAndAdd.bind(this);
    props.setchild(this);
    setTimeout(() => {
      this.setState({saving: false});
    }, 1000);
  }

  componentDidMount() {
    this._isMounted = true;

    if (global.dinnerState != null) {
      setTimeout(() => {
        this.setState(global.dinnerState);
      }, 1);
    }

    this.refreshData();
  }

  componentWillUnmount() {
    global.dinnerState = this.state;
    this._isMounted = false;
  }

  refreshData = () => {
    global.myDB.db.transaction(tx => {
      tx.executeSql(
        'select * from weight_logs where user_id = ' + global.myprofile.userID,
        [],
        (_tx, result) => {
          if (result.rows.length >= 0) {
            let ltVal = [];
            for (var i = 0; i < result.rows.length; i++) {
              if (
                getLabelWithoutWeekday(result.rows.item(i).date) ===
                getLabelWithoutWeekday(this.state.today)
              ) {
                ltVal.push(result.rows.item(i));
              }
            }
            this.setState({weightLogs: ltVal});
          }
        },
      );
      tx.executeSql(
        'select * from daily_track where user_id = ' +
          global.myprofile.userID +
          " and `date` = '" +
          toDateString(this.state.today) +
          "' limit 1",
        [],
        (_tx, result) => {
          let sum_fat = 0,
            sum_protein = 0,
            sum_carbo = 0;
          if (result.rows.length === 0) {
            let data = [[], [], [], [], []];
            this.setState({
              breakfast: data[0],
              breakfastList: data[0],
              latesnacks: data[3],
              snackList: data[3],
              lunch: data[1],
              lunchList: data[1],
              dinner: data[2],
              dinnerList: data[2],
              exerciseList: data[4],
              exercises: data[4],
              currentlyOpenSwipeable: null,
              currentFoodTime: 0,
              pieChartVisible: true,
              fat: sum_fat,
              protein: sum_protein,
              carbo: sum_carbo,
            });
            return;
          }

          for (var i = 0; i < result.rows.length; i++) {
            let data = JSON.parse(decodeURI(result.rows.item(i).data));
            var dinnerList = [data[0], data[1], data[2], data[3]];
            for (var it in dinnerList) {
              for (var j in dinnerList[it]) {
                sum_fat += Number(dinnerList[it][j].nf_fat);
                sum_protein += Number(dinnerList[it][j].nf_protein);
                sum_carbo += Number(dinnerList[it][j].nf_carbo);
              }
            }
            setTimeout(() => {
              this.setState({
                breakfast: data[0],
                breakfastList: data[0],
                latesnacks: data[3],
                snackList: data[3],
                lunch: data[1],
                lunchList: data[1],
                dinner: data[2],
                dinnerList: data[2],
                exerciseList: data[4],
                exercises: data[4],
                currentlyOpenSwipeable: null,
                currentFoodTime: 0,
                fat: sum_fat.toFixedNumber(2),
                protein: sum_protein.toFixedNumber(2),
                carbo: sum_carbo.toFixedNumber(2),
                pieChartVisible: true,
              });
            }, 100);
          }
        },
      );
    });
  };

  onPrevDate = () => {
    var prevDay = new Date(this.state.today.getTime() - 1000 * 3600 * 24);
    this.setState({
      today: prevDay,
      todayLabel: getLabel(prevDay),
    });
    setTimeout(() => {
      this.refreshData();
    }, 100);
  };

  onNextDate = () => {
    var nextDay = new Date(this.state.today.getTime() + 1000 * 3600 * 24);
    this.setState({
      today: nextDay,
      todayLabel: getLabel(nextDay),
    });
    setTimeout(() => {
      this.refreshData();
    }, 100);
  };

  addBreakfast = food => {
    let dinner = this.state.breakfast;
    dinner.push(food);
    dinner = dinner.map(x => x);
    this.setState({breakfast: dinner});
  };

  addLunch = food => {
    let dinner = this.state.lunch;
    dinner.push(food);
    dinner = dinner.map(x => x);
    this.setState({lunch: dinner});
  };

  addDinner = food => {
    let dinner = this.state.dinner;
    dinner.push(food);
    dinner = dinner.map(x => x);
    this.setState({dinner: dinner});
  };

  addSnack = food => {
    let dinner = this.state.latesnacks;
    dinner.push(food); //[food.food_name, food.nf_calories.toFixedNumber(2), food.photo.thumb, food]);
    dinner = dinner.map(x => x);
    this.setState({latesnacks: dinner});
  };

  addExercises = newExercises => {
    let exercises = this.state.exercises;
    newExercises.forEach(element => {
      exercises.push({
        food_name: element.name,
        nf_calories: element.nf_calories.toFixedNumber(2),
        photo: element.photo,
        quantity: element.duration_min.toFixedNumber(0),
        unit: 'minute(s)',
      });
    });

    exercises = exercises.map(x => x);
    this.setState({exercises: exercises});
    setTimeout(() => {
      this.showFoodsInDinner(5);
    }, 200);
  };

  goToSearchAndAdd = time => {
    if (time === 6) {
      this.setState({inputDialog: true});
    } else if (time === 5) {
      this.parentObj.props.navigation.navigate('add_exercise', {
        callback: this.addExercises,
      });
    } else {
      this.setState({currentFoodTime: time});
      this.parentObj.setState({searchViewDisplay: true});
    }
  };

  addFood = food => {
    this.addedFood = 1;
    if (Platform.OS === 'ios') {
      console.log('Push notification');

      PushNotificationIOS.setApplicationIconBadgeNumber(0);
      var tomorrow = new Date(new Date().getTime() + 86400 * 1000);
      PushNotificationIOS.cancelLocalNotifications({
        type: ConfigData.ALERT.REGISTER_MEAL,
      });
      PushNotificationIOS.scheduleLocalNotification({
        fireDate: new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate(),
          8,
          0,
          0,
        ).getTime(),
        alertBody: ConfigData.ALERT.REGISTER_MEAL,
        alertTitle: 'MedLynk',
        applicationIconBadgeNumber: 1,
        repeatInterval: 'year',
        userInfo: {type: ConfigData.ALERT.REGISTER_MEAL},
      });
    }

    food.food_name =
      food.food_name.substr(0, 20) + (food.food_name.length > 20 ? '...' : '');

    if (this.state.currentFoodTime === 0) {
      var hours = new Date().getHours();

      if (hours >= 5 && hours <= 10) {
        this.state.currentFoodTime = 1;
      } else if (hours > 10 && hours <= 16) {
        this.state.currentFoodTime = 2;
      } else if (hours > 16 && hours <= 22) {
        this.state.currentFoodTime = 3;
      } else {
        this.state.currentFoodTime = 4;
      }
    }

    switch (this.state.currentFoodTime) {
      case 1:
        this.addBreakfast(food);
        break;
      case 2:
        this.addLunch(food);
        break;
      case 3:
        this.addDinner(food);
        break;
      case 4:
        this.addSnack(food);
        break;
    }

    setTimeout(() => {
      this.showFoodsInDinner(this.state.currentFoodTime);
    }, 100);
    setTimeout(() => {
      PushNotificationIOS.cancelLocalNotifications({
        type: ConfigData.ALERT.CANT_REACH_TO_CALORIE,
      });

      PushNotificationIOS.setApplicationIconBadgeNumber(0);

      if (this.intCalorie && this.intCalorie < global.calorieGoal * 0.95) {
        const t_tomorrow = new Date(new Date().getTime() + 86400 * 1000);
        PushNotificationIOS.scheduleLocalNotification({
          fireDate: t_tomorrow.getTime(),
          alertBody: ConfigData.ALERT.CANT_REACH_TO_CALORIE,
          alertTitle: 'MedLynk',
          applicationIconBadgeNumber: 1,
          userInfo: {type: ConfigData.ALERT.CANT_REACH_TO_CALORIE},
        });
      }
    }, 2000);
  };
  cancelSwipeRowBack = () => {
    const {currentlyOpenSwipeable} = this.state;

    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }
  };

  sectionHeaderComponent = (headerLabel, addIndex, sectionList) => {
    let sum = 0,
      // eslint-disable-next-line no-unused-vars
      sum_fat = 0,
      // eslint-disable-next-line no-unused-vars
      sum_protein = 0,
      // eslint-disable-next-line no-unused-vars
      sum_carbo = 0;

    sectionList.forEach(element => {
      sum += Number(element.nf_calories);
      sum_fat += Number(element.nf_fat);
      sum_protein += Number(element.nf_protein);
      sum_carbo += Number(element.nf_carbo);
    });

    return (
      <View
        style={{
          flex: 1,
          height: 25,
          backgroundColor: '#eee',
          borderBottomColor: '#ddd',
          borderBottomWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={{lineHeight: 25, fontWeight: 'bold'}}>
          {' '}
          {headerLabel}{' '}
        </Text>

        <View style={{flexDirection: 'row'}}>
          {addIndex !== 6 && (
            <Text style={{lineHeight: 25, right: 20}}>
              <Text style={{fontWeight: 'bold'}}>{sum.toFixedNumber(2)} </Text>
              Cal
            </Text>
          )}
          <TouchableOpacity
            style={{top: 3, right: 10}}
            onPress={() => this.goToSearchAndAdd(addIndex)}>
            <Image
              source={require('./../assets/images/add_plus.png')}
              style={{width: 19, height: 19}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  sectionBodyComponent = (sectionList, placeholder) => {
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        {sectionList.length === 0 ? (
          <Text
            style={{
              lineHeight: 30,
              left: 10,
              fontFamily: 'Arial',
              color: '#777',
            }}>
            {' '}
            {placeholder}
          </Text>
        ) : (
          <FlatList
            data={sectionList}
            renderItem={({item}) => (
              <View style={{flexDirection: 'row', height: 36}}>
                <Image
                  source={{uri: item.photo.thumb}}
                  style={{
                    borderRadius: 15,
                    width: 30,
                    height: 30,
                    borderWidth: 1,
                    borderColor: 'lightgray',
                    marginTop: 3,
                    left: 10,
                  }}
                />
                <View style={{left: 15, height: 36}}>
                  <Text style={{lineHeight: 22, left: 15}}>
                    {item.food_name}
                  </Text>
                  <Text
                    style={{
                      lineHeight: 14,
                      left: 15,
                      fontSize: 10,
                      color: '#555',
                    }}>
                    {item.quantity} {item.unit}
                  </Text>
                </View>
                <Text
                  style={{
                    lineHeight: 36,
                    position: 'absolute',
                    right: 10,
                    color: '#888',
                  }}>
                  {item.nf_calories.toFixedNumber(2)} Cal
                </Text>
              </View>
            )}
          />
        )}
      </View>
    );
  };

  addLogWeight(weight) {
    global.myDB.db
      .executeSql(
        "insert into weight_logs (`date`, user_id, weight) values('" +
          toDateString(this.state.today) +
          "', " +
          global.myprofile.userID +
          ', ' +
          Number(weight) +
          ')',
        [],
      )
      .then(() => {
        let x = this.state.weightLogs.map(xt => xt);
        x.push({date: this.state.today, weight: weight});
        this.setState({weightLogs: x, inputDialog: false});

        if (
          new Date(this.state.today).getTime() >= global.myprofile.weight_date
        ) {
          global.myprofile.weight = weight;
          global.myprofile.weight_date = new Date(this.state.today).getTime();
        }
      })
      .catch(e => {
        console.log('Dashboard 408, ', e);
      });
  }

  render() {
    return (
      <View style={{flex: 1, width: Dimensions.get('screen').width}}>
        <DialogInput
          isDialogVisible={this.state.inputDialog}
          modalStyle={{border: 1, borderColor: '#fc96f4'}}
          title={'Weight Log'}
          message={
            'Enter your weight (' +
            (global.myprofile.weight_unit === 0 ? 'kg' : 'lbs') +
            ')'
          }
          hintInput={''}
          submitInput={inputText => {
            if (isNaN(Number(inputText))) {
              return;
            }
            if (global.myprofile.weight_unit === 0) {
              this.addLogWeight(inputText);
            } else {
              this.addLogWeight(GetToFixedNumber(Number(inputText) / 2.205, 3));
            }
          }}
          closeDialog={() => {
            this.setState({inputDialog: false});
          }}
        />
        <View style={{width: '100%', height: 40, backgroundColor: '#F08080'}}>
          <Text
            style={{
              lineHeight: 40,
              flex: 1,
              textAlign: 'center',
              color: 'white',
              fontSize: 16,
            }}>
            {this.state.todayLabel}
          </Text>
          <TouchableOpacity
            style={{position: 'absolute', left: 5}}
            onPress={this.onPrevDate}>
            <Text style={{lineHeight: 40, color: 'white'}}>
              <Icon name="chevron-left" size={20} />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{position: 'absolute', right: 5}}
            onPress={this.onNextDate}>
            <Text style={{lineHeight: 40, color: 'white'}}>
              <Icon name="chevron-right" size={20} />
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          {this.getCalorieStatusArea()}
          <View
            style={{
              width: Dimensions.get('screen').width,
              alignItems: 'center',
            }}>
            <Text textAlign={'center'} style={{color: '#999'}}>
              Tap <Icon name="paper-plane" size={12} /> to submit the data to
              the doctor.
            </Text>
          </View>
          <ScrollView
            style={{flex: 1}}
            onPress={this.cancelSwipeRowBack}
            scrollEventThrottle={16}
            onScroll={event => {
              this.cancelSwipeRowBack();

              if (event.nativeEvent.contentOffset.y >= 110) {
                if (this.state.pieChartVisible) {
                  this.setState({pieChartVisible: false});
                }
              } else {
                if (!this.state.pieChartVisible) {
                  this.setState({pieChartVisible: true});
                }
              }
            }}>
            <View
              style={{
                width: Dimensions.get('screen').width,
                flexDirection: 'column',
                alignItems: 'stretch',
              }}>
              {Number(this.state.fat) +
                Number(this.state.protein) +
                Number(this.state.carbo) >
                0 && (
                <PieChart
                  data={[
                    {
                      name: 'Fat',
                      population: Number(this.state.fat),
                      color: 'chocolate',
                      legendFontColor: '#7F7F7F',
                      legendFontSize: 14,
                    },
                    {
                      name: 'Protein',
                      population: Number(this.state.protein),
                      color: 'darkgreen',
                      legendFontColor: '#7F7F7F',
                      legendFontSize: 14,
                    },
                    {
                      name: 'Carbo',
                      population: Number(this.state.carbo),
                      color: 'pink',
                      legendFontColor: '#7F7F7F',
                      legendFontSize: 14,
                    },
                  ]}
                  width={Dimensions.get('screen').width}
                  height={120}
                  chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) =>
                      `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2',
                      stroke: '#ffa726',
                    },
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  // absolute
                />
              )}
              {this.sectionHeaderComponent(
                'Breakfast',
                1,
                this.state.breakfastList,
              )}
              {this.sectionBodyComponent(
                this.state.breakfastList,
                'No foods logged',
              )}

              {this.sectionHeaderComponent('Lunch', 2, this.state.lunchList)}
              {this.sectionBodyComponent(
                this.state.lunchList,
                'No foods logged',
              )}

              {this.sectionHeaderComponent('Dinner', 3, this.state.dinnerList)}
              {this.sectionBodyComponent(
                this.state.dinnerList,
                'No foods logged',
              )}

              {this.sectionHeaderComponent(
                'Late Snacks',
                4,
                this.state.snackList,
              )}
              {this.sectionBodyComponent(
                this.state.snackList,
                'No foods logged',
              )}

              {null &&
                this.sectionHeaderComponent(
                  'Exercises',
                  5,
                  this.state.exerciseList,
                )}
              {null &&
                this.sectionBodyComponent(
                  this.state.exerciseList,
                  'No exercises logged',
                )}

              {this.sectionHeaderComponent('Weight logs', 6, [])}
              {this.weightLogs(this.state.weightLogs, 'No weight logged')}
            </View>
          </ScrollView>
        </View>
        {this.state.saving && (
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
        )}
      </View>
    );
  }

  weightLogs(wl, placeholder) {
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        {wl.length === 0 ? (
          <Text
            style={{
              lineHeight: 30,
              left: 10,
              fontFamily: 'Arial',
              color: '#777',
            }}>
            {' '}
            {placeholder}
          </Text>
        ) : (
          <FlatList
            data={wl}
            keyExtractor={(_item, index) => 'list_item_' + index}
            renderItem={({item}) => (
              <View
                style={{
                  flexDirection: 'row',
                  height: 36,
                  width: Dimensions.get('screen').width,
                  justifyContent: 'space-between',
                }}>
                <View style={{left: 15, height: 36}}>
                  <Text style={{lineHeight: 36}}>
                    {getLabelWithoutWeekday(item.date)}
                  </Text>
                </View>
                <Text style={{lineHeight: 36, right: 15, color: '#555'}}>
                  {changeWUnit(item.weight).toFixedNumber(2) + ''}{' '}
                  {global.myprofile.weight_unit === 0 ? 'kg' : 'lbs'}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    );
  }

  showFoodsInDinner = time => {
    let dinners;
    switch (time - 1) {
      case 0:
        dinners = this.state.breakfast;
        break;
      case 1:
        dinners = this.state.lunch;
        break;
      case 2:
        dinners = this.state.dinner;
        break;
      case 3:
        dinners = this.state.latesnacks;
        break;
      case 4:
        dinners = this.state.exercises;
        break;
    }
    var retDinners = dinners;
    let sum_fat = 0,
      sum_protein = 0,
      sum_carbo = 0;

    var dinnerList = [
      this.state.breakfast,
      this.state.lunch,
      this.state.dinner,
      this.state.latesnacks,
    ];
    for (var i in dinnerList) {
      for (var j in dinnerList[i]) {
        sum_fat += Number(dinnerList[i][j].nf_fat);
        sum_protein += Number(dinnerList[i][j].nf_protein);
        sum_carbo += Number(dinnerList[i][j].nf_carbo);
      }
    }

    switch (time - 1) {
      case 0:
        this.setState({
          breakfastList: retDinners,
          fat: sum_fat,
          protein: sum_protein,
          carbo: sum_carbo,
        });
        break;
      case 1:
        this.setState({
          lunchList: retDinners,
          fat: sum_fat,
          protein: sum_protein,
          carbo: sum_carbo,
        });
        break;
      case 2:
        this.setState({
          dinnerList: retDinners,
          fat: sum_fat,
          protein: sum_protein,
          carbo: sum_carbo,
        });
        break;
      case 3:
        this.setState({
          snackList: retDinners,
          fat: sum_fat,
          protein: sum_protein,
          carbo: sum_carbo,
        });
        break;
      case 4:
        this.setState({
          exerciseList: retDinners,
          fat: sum_fat,
          protein: sum_protein,
          carbo: sum_carbo,
        });
        break;
    }

    global.myDB.db.transaction(tx => {
      tx.executeSql(
        'select 1 from daily_track where user_id = ' +
          global.myprofile.userID +
          " and `date` = '" +
          toDateString(this.state.today) +
          "'",
        [],
        (_txb, result) => {
          if (result.rows.length === 0) {
            global.myDB.db.executeSql(
              'insert into daily_track (user_id, `date`, `data`) values(' +
                global.myprofile.userID +
                ',' +
                "'" +
                toDateString(this.state.today) +
                "','" +
                encodeURI(
                  JSON.stringify([
                    this.state.breakfast,
                    this.state.lunch,
                    this.state.dinner,
                    this.state.latesnacks,
                    this.state.exercises,
                  ]),
                ) +
                "')",
            );
          } else {
            global.myDB.db.executeSql(
              'update daily_track set data = ' +
                encodeURI(
                  JSON.stringify([
                    this.state.breakfast,
                    this.state.lunch,
                    this.state.dinner,
                    this.state.latesnacks,
                    this.state.exercises,
                  ]),
                ) +
                "' where user_id = " +
                global.myprofile.userID +
                " and `date` = '" +
                this.state.todayLabel +
                "'",
            );
          }
        },
      );
    });
  };

  getCalorieStatusArea = () => {
    let intCalorie = 0;
    // let exeCalorie = 0;

    var dinnerList = [
      this.state.breakfast,
      this.state.lunch,
      this.state.dinner,
      this.state.latesnacks,
    ];
    for (var i in dinnerList) {
      for (var j in dinnerList[i]) {
        intCalorie += Number(dinnerList[i][j].nf_calories);
      }
    }

    this.intCalorie = intCalorie;

    if (this.addedFood) {
      this.addedFood = 0;
      // Alert.alert("Error", "You're overtaking the calorie today. Please be careful!");

      if (Platform.OS === 'ios') {
        console.log('Push notification');

        if (intCalorie > global.calorieGoal) {
          PushNotificationIOS.cancelLocalNotifications({
            type: ConfigData.ALERT.GOING_OVER_CALORIE,
          });
          PushNotificationIOS.setApplicationIconBadgeNumber(0);
          var today = new Date(new Date().getTime() + 86400 * 1000);
          PushNotificationIOS.scheduleLocalNotification({
            fireDate: new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              8,
              30,
              0,
            ).getTime(),
            alertBody: ConfigData.ALERT.GOING_OVER_CALORIE,
            alertTitle: 'MedLynk',
            applicationIconBadgeNumber: 1,
            userInfo: {type: ConfigData.ALERT.GOING_OVER_CALORIE},
          });
        }
      }
    }

    // for (var j in this.state.exercises) {
    //     exeCalorie += Number(this.state.exercises[j]['nf_calories']);
    // }

    return (
      <View
        style={{
          width: '100%',
          borderBottomColor: '#ddd',
          borderBottomWidth: 2,
        }}>
        <View
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{color: '#f009', fontWeight: 'bold', textAlign: 'center'}}>
            Goal{' '}
            <Text style={{fontSize: 15}}>
              {GetToFixedNumber(global.myprofile.calorieGoal, 2)}
            </Text>
          </Text>
          <Text
            style={{color: 'blue', fontWeight: 'bold', textAlign: 'center'}}>
            Intake{' '}
            <Text style={{fontSize: 15}}>
              {GetToFixedNumber(intCalorie, 2)}
            </Text>
          </Text>
          <Text
            style={{
              color: '#A52A2A99',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Remain{' '}
            <Text style={{fontSize: 15}}>
              {GetToFixedNumber(global.myprofile.calorieGoal - intCalorie, 2)}
            </Text>
          </Text>
          {/* <Text style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
                Goal
                {"\n"}
                {GetToFixedNumber(global.myprofile.calorieGoal, 2)}</Text>
                <Text>-</Text>
                <Text style={{ color: 'blue', fontWeight: 'bold', textAlign: 'center' }}>
                    Intake
                    {"\n"}
                    {GetToFixedNumber(intCalorie, 2)}
                </Text>
                <Text>+</Text>
                <Text style={{ color: 'green', fontWeight: 'bold', textAlign: 'center' }}>
                    Exercise
                    {"\n"}
                    {exeCalorie.toFixedNumber(2)}
                </Text>
                <Text>=</Text>
                <Text style={{ color: 'brown', fontWeight: 'bold', textAlign: 'center' }}>
                    Remaining
                    {"\n"}
                    {(global.myprofile.calorieGoal - intCalorie + exeCalorie).toFixedNumber(2)}
                </Text> */}
        </View>
        {!this.state.pieChartVisible && (
          <View
            style={{
              width: Dimensions.get('screen').width - 100,
              paddingTop: 3,
              paddingBottom: 3,
              left: 50,
              right: 50,
              borderTopColor: '#ddd',
              borderTopWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: 'chocolate',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              Fat{' '}
              <Text style={{fontSize: 15}}>
                {GetToFixedNumber(this.state.fat, 2)}
              </Text>
            </Text>
            <Text
              style={{
                color: 'darkgreen',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              Protein{' '}
              <Text style={{fontSize: 15}}>
                {GetToFixedNumber(this.state.protein, 2)}
              </Text>
            </Text>
            <Text
              style={{
                color: '#008B8B',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              Carbo{' '}
              <Text style={{fontSize: 15}}>
                {GetToFixedNumber(this.state.carbo, 2)}
              </Text>
            </Text>
          </View>
        )}
      </View>
    );
  };

  submitData = () => {
    this.setState({saving: true});
    // global.myDB.db.executeSql("insert into weight_logs (`date`, user_id, weight) values('" + this.state.today + "', " + global.myprofile.userID + ", " + Number(weight) + ")",
    global.myDB.db.transaction(tx => {
      const query =
        "select * from weight_logs where `date` = '" +
        toDateString(this.state.today) +
        "' and user_id = " +
        global.myprofile.userID;
      console.log(query);
      tx.executeSql(query, [], (_tx, result) => {
        console.log('--*** Loaded data from weight_logs to save');
        var weights = [];
        for (var i = 0; i < result.rows.length; i++) {
          weights.push(result.rows.item(i).weight);
        }
        console.log(weights);
        weights = weights.join(',');
        fetch(ConfigData.SERVER_HOST + 'api/daily_track', {
          method: 'post',
          body: JSON.stringify({
            query: [
              'delete from daily_track where user_id = ' +
                global.myprofile.userID +
                " and `date` = '" +
                toDateString(this.state.today) +
                "'",
              'insert into daily_track (user_id, `date`, `data`) values(' +
                global.myprofile.userID +
                ",'" +
                toDateString(this.state.today) +
                "','" +
                encodeURI(
                  JSON.stringify([
                    this.state.breakfast,
                    this.state.lunch,
                    this.state.dinner,
                    this.state.latesnacks,
                    this.state.exercises,
                  ]),
                ) +
                "')",
              'update user_profile set current_weight = ' +
                global.myprofile.weight +
                ", updated_weight_date='" +
                global.myprofile.weight_date +
                "' where user_id=" +
                global.myprofile.userID,
              "delete from weight_log where `date` = '" +
                toDateString(this.state.today) +
                "' and user_id = " +
                global.myprofile.userID,
              "insert into weight_log(`date`, user_id, weight) values('" +
                toDateString(this.state.today) +
                "', " +
                global.myprofile.userID +
                ", '" +
                weights +
                "')",
            ],
          }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
          .then(_response => {
            console.log(3);
            this.setState({saving: false});
          })
          .catch(_e => {
            // eslint-disable-next-line no-alert
            alert('Error in submitting data! Try later.');
            this.setState({saving: false});
          });
      });
    });
  };
}

function changeWUnit(s) {
  if (global.myprofile.weight_unit === 0) {
    return s;
  } else {
    return s * 2.20462;
  }
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
