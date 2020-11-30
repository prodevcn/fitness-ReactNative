/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-extend-native */
import React from 'react';
import {Dimensions, ScrollView, View, Text} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

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

const getWeekday = d => {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return weekdays[d.getDay()];
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
    return val.substr(0, val.length - 1);
  }
  return val;
};

String.prototype.toFixedNumber = toFixedNumber;
Number.prototype.toFixedNumber = toFixedNumber;

function GetToFixedNumber(s, n) {
  n = n || 0;
  if (typeof s === 'undefined') {
    return 'undefined';
  } else {
    return s.toFixedNumber(n);
  }
}

export default class StatsView extends React.Component {
  state = {
    test: 1,
    today: new Date(),
    todayLabel: getLabel(new Date()),
    idealWeight: 10,
    bmi: 100,
    bmr: 102,
    calorieIntake: 10,
    macro: 100,
    weights: [75, 74, 74.1, 73.1, 72, 71.4, 71, 70.4],
  };
  componentDidMount() {
    this.updateValues();
  }

  updateValues() {
    let bmi =
        global.myprofile.weight /
        ((global.myprofile.height * global.myprofile.height) / 10000),
      bmiStatus;
    let isMale = global.myprofile.gender.toLowerCase() === 'male';

    if (bmi < 18.5) {
      bmiStatus = 'Underweight';
    } else if (bmi < 25) {
      bmiStatus = 'Normal';
    } else if (bmi < 30) {
      bmiStatus = 'Overweight';
    } else {
      bmiStatus = 'Obese';
    }

    bmiStatus = '(' + bmiStatus + ')';
    let bmr =
      10 * global.myprofile.weight +
      6.25 * global.myprofile.height -
      5 * global.myprofile.age +
      (isMale ? +5 : -161);
    let coActivityLevel;

    switch (global.myprofile.activityLevel) {
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

    let suggestedCalorieIntake = bmr * coActivityLevel;
    let robinson = isMale
      ? 52 + ((global.myprofile.height - 152.4) / 2.54) * 1.9
      : 49 + ((global.myprofile.height - 152.4) / 2.54) * 1.7;
    let goalCalorieIntake =
      10 * robinson +
      6.25 * global.myprofile.height -
      5 * global.myprofile.age +
      (isMale ? +5 : -161);

    this.setState({
      bmi: bmi,
      bmiStatus: bmiStatus,
      bmr: bmr,
      suggestedCalorieIntake: suggestedCalorieIntake,
      calorieIntake: global.myprofile.weight * 15 * 2.20462,
      calorieGainWeight: global.myprofile.weight * 18 * 2.20462,
      calorieLoseWeight: global.myprofile.weight * 12 * 2.20462,
      robinson: robinson,
      miller: isMale
        ? 56.2 + ((global.myprofile.height - 152.4) / 2.54) * 1.41
        : 53.1 + ((global.myprofile.height - 152.4) / 2.54) * 1.36,
      hamwi: isMale
        ? 48 + ((global.myprofile.height - 152.4) / 2.54) * 2.7
        : 45.5 + ((global.myprofile.height - 152.4) / 2.54) * 2.2,
      devine: isMale
        ? 50 + ((global.myprofile.height - 152.4) / 2.54) * 2.3
        : 45.5 + ((global.myprofile.height - 152.4) / 2.54) * 2.3,
      goalCalorieIntake,
    });

    global.myDB.db
      .executeSql(
        'select * from weight_logs where user_id=' +
          global.myprofile.userID +
          ' order by `date` desc, id desc',
      )
      .then(result => {
        // if (result) {
        //     var
        //     for (var i = 0; i < result.rows.length; i++) {
        //     }
        // }
      });
  }

  render() {
    console.log('Render', global.myprofile);
    return (
      <ScrollView
        style={{width: Dimensions.get('screen').width, height: '100%'}}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 5,
            paddingBottom: 5,
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
          }}>
          <View style={{width: '50%'}}>
            <Text
              style={{
                left: 20,
                fontSize: 15,
                lineHeight: 30,
                fontWeight: 'bold',
              }}>
              BMR
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 30,
                  marginRight: 10,
                  textAlign: 'center',
                  color: '#444',
                }}>
                {GetToFixedNumber(this.state.bmr, 1)}
              </Text>
            </View>
          </View>
          <View
            style={{width: '50%', borderLeftWidth: 1, borderLeftColor: '#ddd'}}>
            <Text
              style={{
                left: 20,
                fontSize: 15,
                lineHeight: 30,
                fontWeight: 'bold',
              }}>
              BMI
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 30,
                  marginRight: 10,
                  textAlign: 'center',
                  color: '#444',
                }}>
                {GetToFixedNumber(this.state.bmi, 1)} {this.state.bmiStatus}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 1,
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
          }}
        />

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 5,
            paddingBottom: 5,
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
          }}>
          <View style={{width: '50%'}}>
            <Text
              style={{
                left: 20,
                fontSize: 15,
                lineHeight: 30,
                fontWeight: 'bold',
              }}>
              Ideal Weight ({global.myprofile.weight_unit === 0 ? 'Kg' : 'lbs'})
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginLeft: 10,
                }}>
                Robinson Formula
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginRight: 10,
                }}>
                {GetToFixedNumber(changeWUnit(this.state.robinson), 1)}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginLeft: 10,
                }}>
                Miller Formula
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginRight: 10,
                }}>
                {GetToFixedNumber(changeWUnit(this.state.miller), 1)}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginLeft: 10,
                }}>
                Devine Formula
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginRight: 10,
                }}>
                {GetToFixedNumber(changeWUnit(this.state.devine), 1)}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginLeft: 10,
                }}>
                Hamwi Formula
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginRight: 10,
                }}>
                {GetToFixedNumber(changeWUnit(this.state.hamwi), 1)}
              </Text>
            </View>
          </View>
          <View
            style={{width: '50%', borderLeftColor: '#ddd', borderLeftWidth: 1}}>
            <Text
              style={{
                left: 5,
                fontSize: 15,
                lineHeight: 30,
                fontWeight: 'bold',
              }}>
              Calorie Intake (Simple)
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginLeft: 10,
                }}>
                To maintain
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginRight: 10,
                }}>
                {GetToFixedNumber(this.state.calorieIntake, 1)} Cal
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginLeft: 10,
                }}>
                To gain weight
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginRight: 10,
                }}>
                {GetToFixedNumber(this.state.calorieGainWeight, 1)} Cal
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginLeft: 10,
                }}>
                To lose weight
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginRight: 10,
                }}>
                {GetToFixedNumber(this.state.calorieLoseWeight, 1)} Cal
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 1,
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
          }}
        />

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 5,
            paddingBottom: 5,
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
          }}>
          <View style={{width: '100%'}}>
            <Text
              style={{
                left: 20,
                fontSize: 15,
                lineHeight: 30,
                fontWeight: 'bold',
              }}>
              (Suggested) Calorie Intake
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginLeft: 10,
                  fontWeight: 'bold',
                }}>
                Total
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginRight: 10,
                  fontWeight: 'bold',
                }}>
                {GetToFixedNumber(this.state.suggestedCalorieIntake, 1)} Cal
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginLeft: 20,
                }}>
                Proteins
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginRight: 20,
                }}>
                {GetToFixedNumber(this.state.suggestedCalorieIntake * 0.12, 1)}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginLeft: 20,
                }}>
                Carbohydrates
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginRight: 20,
                }}>
                {GetToFixedNumber(this.state.suggestedCalorieIntake * 0.6, 1)}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginLeft: 20,
                }}>
                Fats
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginRight: 20,
                }}>
                {GetToFixedNumber(this.state.suggestedCalorieIntake * 0.28, 1)}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 1,
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
          }}
        />

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 5,
            paddingBottom: 5,
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
          }}>
          <View style={{width: '100%'}}>
            <Text
              style={{
                left: 20,
                fontSize: 15,
                lineHeight: 30,
                fontWeight: 'bold',
              }}>
              (Suggested) Goal Calorie
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginLeft: 10,
                }}>
                For goal weight
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 30,
                  marginRight: 10,
                }}>
                {GetToFixedNumber(this.state.goalCalorieIntake, 0)} Cal
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 5,
            paddingBottom: 5,
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
          }}>
          <View style={{width: '100%'}}>
            <Text
              style={{
                left: 20,
                fontSize: 15,
                lineHeight: 30,
                fontWeight: 'bold',
              }}>
              Your Weight Logs
            </Text>
            <LineChart
              data={{
                labels: ['Week -6', '-5', '-4', '-3', '-2', '-1', 'Today'],
                datasets: [
                  {
                    data: this.state.weights,
                  },
                ],
              }}
              width={Dimensions.get('window').width} // from react-native
              height={180}
              yAxisLabel={''}
              yAxisSuffix={'kg'}
              chartConfig={{
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#fb8c00',
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => 'white',
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '3',
                  strokeWidth: '2',
                  stroke: '#ffffff',
                },
                barPercentage: 0.5,
              }}
              style={{
                marginVertical: 4,
                borderRadius: 16,
              }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

function changeWUnit(s) {
  return global.myprofile.weight_unit === 0 ? s : s * 2.20462;
}
