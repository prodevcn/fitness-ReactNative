/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Picker,
  Modal,
  TouchableHighlight,
  Text,
  ActivityIndicator,
} from 'react-native';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {TouchableOpacity, TextInput} from 'react-native-gesture-handler';
import {Dropdown} from 'react-native-material-dropdown';

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
String.prototype.toFixedNumber = toFixedNumber;
Number.prototype.toFixedNumber = toFixedNumber;

const styles = StyleSheet.create({
  backButton: {
    paddingTop: 4,
    paddingLeft: 10,
  },
  navigationBar: {
    height: 44 + getStatusBarHeight(),
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#b52e57',
  },
  navigationTitle: {
    textAlign: 'center',
    lineHeight: 40,
    fontWeight: 'bold',
    marginTop: getStatusBarHeight(),
    fontSize: 20,
    fontFamily: 'Arial',
    color: 'white',
  },
});

export default class SearchView extends React.Component {
  constructor(props) {
    super(props);
    this.editTimer = null;
    this.parentObj = props.parentObj;
    this.state = {
      searchText: '',
      searchResult: [],
      loading: false,
      sortDirection: 1,
      modal: props.modal || false,
      selectedFood: props.food || null,
    };
    this.changedSearchTextField = false;
  }

  componentDidMount() {
    this.parentObj.onSearchFieldChangeFromChild = this.onSearchFieldChange;
  }

  onSearchFieldChange = text => {
    text = String(text).trim();
    this.setState({searchText: text});
    if (text.length === 0) {
      this.setState({searchResult: []});
    } else {
      this.setState({errorText: global.apiConfig.api2URL, loading: true});

      // Loading foods...........
      var currentSearchText = text;

      fetch(
        global.apiConfig.makeQueryString(global.apiConfig.api2URL, {
          branded: true,
          common: true,
          query: text,
          self: false,
          claims: true,
          detailed: true,
        }),
        {
          method: 'get',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-app-id': global.apiConfig.appID,
            'x-app-key': global.apiConfig.appKey,
            'x-remote-user-id': 0,
          },
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          this.setState({loading: false});
          if (text !== currentSearchText) {
            return;
          }

          var retVal = [];
          for (var key in responseJson) {
            if (responseJson.hasOwnProperty(key)) {
              const element = responseJson[key];
              retVal.push(
                <View
                  style={{flex: 1, backgroundColor: '#b52e5766', height: 30}}
                  key={key}>
                  <Text style={{lineHeight: 30, fontWeight: 'bold'}}>
                    {' '}
                    {key}
                  </Text>
                </View>,
              );

              let eleCount = 0;
              let tags = [];

              element.sort((x, y) => {
                if (x.food_name > y.food_name) {
                  return 1 * this.state.sortDirection;
                }
                if (x.food_name < y.food_name) {
                  return -1 * this.state.sortDirection;
                }
                return 0;
              });
              for (var key1 in element) {
                if (element.hasOwnProperty(key1)) {
                  const ele = element[key1];
                  if (ele.tag_id) {
                    if (tags.indexOf(ele.tag_id) !== -1) {
                      continue;
                    }
                    tags.push(ele.tag_id);
                  }
                  retVal.push(
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        height: 36,
                        borderBottomColor: '#eee',
                        borderBottomWidth: 1,
                      }}
                      key={key + '_' + key1}
                      onPress={() => {
                        if (ele.nix_brand_id) {
                          // is Branded?
                          let selectedFood = {
                            food_name: ele.food_name,
                            nf_protein: get_nutrient_item(
                              ele.full_nutrients,
                              203,
                            ),
                            nf_fat: get_nutrient_item(ele.full_nutrients, 204),
                            nf_carbo: get_nutrient_item(
                              ele.full_nutrients,
                              205,
                            ),
                            nf_calories: ele.nf_calories,
                            photo: ele.photo,
                            quantity: 1,
                            origin_calories: ele.nf_calories,
                            origin_weight: ele.serving_weight_grams,
                            origin_unit: ele.serving_unit,
                            weight: ele.serving_weight_grams,
                            unit: ele.serving_unit,
                            unit_list: [
                              {
                                serving_weight: ele.serving_weight,
                                measure: ele.serving_unit,
                                qty: 1,
                                seq: 1,
                              },
                            ],
                            index: 0,
                          };
                          let foods_list = Array.isArray(
                            this.state.selectedFood,
                          )
                            ? this.state.selectedFood
                            : [selectedFood];
                          let allDetails = [];
                          foods_list.forEach(e => {
                            if (ele) {
                              allDetails.push({
                                calorie: e.nf_calories,
                                nf_protein: e.nf_protein,
                                nf_fat: e.nf_fat,
                                nf_carbo: e.nf_carbo,
                                quantity: e.quantity,
                                unit: e.unit,
                              });
                            }
                          });
                          this.setState({
                            modal: true,
                            selectedFood,
                            allDetails,
                          });
                          // this.parentObj.addFood();
                        } else {
                          let calorie = ele.full_nutrients;
                          let calorieVal = 0;
                          for (var calorieIndex in calorie) {
                            if (calorie[calorieIndex].attr_id === 208) {
                              calorieVal = calorie[calorieIndex].value;
                              break;
                            }
                          }

                          fetch(global.apiConfig.apiNutrientsURL, {
                            method: 'post',
                            body: JSON.stringify({
                              query: ele.food_name,
                            }),
                            headers: {
                              Accept: 'application/json',
                              'Content-Type': 'application/json',
                              'x-app-id': global.apiConfig.appID,
                              'x-app-key': global.apiConfig.appKey,
                              'x-remote-user-id': 0,
                            },
                          })
                            .then(response => response.json())
                            .then(responseJson1 => {
                              let unit_list =
                                responseJson1.foods[0].alt_measures;
                              if (unit_list) {
                              } else {
                                unit_list = [
                                  {
                                    serving_weight: ele.origin_weight,
                                    measure: ele.serving_unit,
                                    qty: 1,
                                    seq: 1,
                                  },
                                ];
                              }
                              let selectedFood = {
                                food_name: ele.food_name,
                                nf_calories: calorieVal,
                                nf_protein: get_nutrient_item(
                                  ele.full_nutrients,
                                  203,
                                ),
                                nf_fat: get_nutrient_item(
                                  ele.full_nutrients,
                                  204,
                                ),
                                nf_carbo: get_nutrient_item(
                                  ele.full_nutrients,
                                  205,
                                ),
                                photo: ele.photo,
                                quantity: 1,
                                origin_calories: calorieVal,
                                origin_weight: ele.serving_weight_grams,
                                origin_unit: ele.serving_unit,
                                weight: ele.serving_weight_grams,
                                unit: ele.serving_unit,
                                unit_list: unit_list,
                                index: 0,
                              };

                              let foods_list = Array.isArray(
                                this.state.selectedFood,
                              )
                                ? this.state.selectedFood
                                : [selectedFood];
                              let allDetails = [];
                              foods_list.forEach(e => {
                                if (e) {
                                  allDetails.push({
                                    calorie: e.nf_calories * e.quantity,
                                    quantity: e.quantity,
                                    nf_protein: e.nf_protein * e.quantity,
                                    nf_fat: e.nf_fat * e.quantity,
                                    nf_carbo: e.nf_carbo * e.quantity,
                                    unit: e.unit,
                                  });
                                }
                              });

                              this.setState({
                                modal: true,
                                selectedFood,
                                allDetails,
                              });
                            });
                        }
                      }}>
                      <Image
                        source={{uri: ele.photo.thumb}}
                        style={{
                          borderRadius: 15,
                          width: 30,
                          height: 30,
                          borderWidth: 1,
                          borderColor: 'lightgray',
                          position: 'absolute',
                          left: 10,
                          top: 3,
                        }}
                      />
                      <Text
                        style={{
                          position: 'absolute',
                          left: 60,
                          lineHeight: 36,
                        }}>
                        {ele.food_name}
                      </Text>
                    </TouchableOpacity>,
                  );
                  eleCount++;
                }
              }

              if (eleCount === 0) {
                retVal.push(
                  <View
                    style={{flex: 1, backgroundColor: 'white', height: 36}}
                    key={key + '____not_found'}>
                    <Text
                      style={{
                        lineHeight: 36,
                        color: '#555',
                        fontFamily: 'Arial',
                      }}>
                      {' '}
                      No items found
                    </Text>
                  </View>,
                );
              }
            }
          }

          this.setState({searchResult: retVal});
        })
        .catch(error => {
          console.log('SearchView:, 290', error);
          this.setState({
            searchResult: [<Text>error</Text>],
          });
        });
    }
  };

  modalTitleBar = () => {
    return (
      <View
        style={[
          styles.navigationBar,
          {flexDirection: 'row', justifyContent: 'space-between'},
        ]}>
        <TouchableOpacity
          onPress={() => {
            this.setState({modal: false});
          }}
          style={[
            styles.backButton,
            {marginTop: getStatusBarHeight(), width: 40},
          ]}>
          <Text style={{color: 'white'}}>
            <Icon5 name="angle-left" size={30} />
          </Text>
        </TouchableOpacity>
        <Text style={styles.navigationTitle}>Detail</Text>
        <View style={{width: 40}} />
      </View>
    );
  };
  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.modal ? (
          <Modal
            style={{flex: 1}}
            animationType="none"
            transparent={false}
            visible={this.state.modal}>
            {this.modalTitleBar()}
            <View style={{flex: 1}}>
              {(() => {
                let foods_list = Array.isArray(this.state.selectedFood)
                  ? this.state.selectedFood
                  : [this.state.selectedFood];
                let retVal = [];
                let index = -1;
                foods_list.forEach(element => {
                  if (element) {
                    let units = [];
                    index++;
                    element.unit_list.forEach(element1 => {
                      units.push({value: element1.measure});
                    });

                    var thisIndex = index;

                    retVal.push(
                      <View
                        style={{
                          width: '100%',
                          height: 70,
                          borderTopColor: '#ddd',
                          borderTopWidth: 1,
                        }}
                        key={'detailscreen_key_' + index}>
                        <View
                          style={{height: 40, left: 10, flexDirection: 'row'}}>
                          <Image
                            source={{uri: element.photo.thumb}}
                            style={{
                              borderRadius: 15,
                              width: 30,
                              height: 30,
                              borderWidth: 1,
                              borderColor: 'lightgray',
                              left: 0,
                              top: 5,
                            }}
                          />
                          <Text style={{lineHeight: 40, left: 5}}>
                            {element.food_name.substr(0, 20) +
                              (element.food_name.length > 20 ? '...' : '')}
                          </Text>
                          <Text
                            style={{
                              textAlign: 'right',
                              lineHeight: 40,
                              flex: 1,
                              paddingRight: 20,
                            }}>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                color: 'blue',
                                fontSize: 16,
                              }}
                              ref={'calorieLabel_' + thisIndex}>
                              {this.state.allDetails[
                                thisIndex
                              ].calorie.toFixedNumber(1)}
                            </Text>
                            Cal
                          </Text>
                        </View>
                        <View
                          style={{flex: 1, height: 30, flexDirection: 'row'}}>
                          <View style={{width: 40}}>
                            <TextInput
                              ref={'quantityLabel_' + thisIndex}
                              style={{
                                textAlign: 'right',
                                left: 10,
                                top: 0,
                                borderColor: '#ddd',
                                borderWidth: 1,
                                width: 30,
                                height: 30,
                              }}
                              onChangeText={text => {
                                let ad = this.state.allDetails;
                                let selectedUnit = ad[thisIndex].unit;
                                let selectedWeight = element.origin_weight;

                                element.unit_list.forEach(el => {
                                  if (selectedUnit === el.measure) {
                                    selectedWeight = el.serving_weight;
                                  }
                                });

                                let calorie =
                                  (element.origin_calories /
                                    element.origin_weight) *
                                  selectedWeight;
                                let protein =
                                  (element.nf_protein / element.origin_weight) *
                                  selectedWeight;
                                let fat =
                                  (element.nf_fat / element.origin_weight) *
                                  selectedWeight;
                                let carbo =
                                  (element.nf_carbo / element.origin_weight) *
                                  selectedWeight;

                                ad[thisIndex].calorie = (
                                  calorie * Number(text)
                                ).toFixedNumber(2);
                                ad[thisIndex].nf_protein = (
                                  protein * Number(text)
                                ).toFixedNumber(2);
                                ad[thisIndex].nf_fat = (
                                  fat * Number(text)
                                ).toFixedNumber(2);
                                ad[thisIndex].nf_carbo = (
                                  carbo * Number(text)
                                ).toFixedNumber(2);
                                ad[thisIndex].quantity = text;

                                let foods = Array.isArray(
                                  this.state.selectedFood,
                                )
                                  ? this.state.selectedFood
                                  : [this.state.selectedFood];
                                foods[element.index].nf_calories = (
                                  calorie * Number(text)
                                ).toFixedNumber(2);
                                foods[element.index].nf_protein = (
                                  protein * Number(text)
                                ).toFixedNumber(2);
                                foods[element.index].nf_fat = (
                                  fat * Number(text)
                                ).toFixedNumber(2);
                                foods[element.index].nf_carbo = (
                                  carbo * Number(text)
                                ).toFixedNumber(2);
                                foods[element.index].quantity = text;

                                this.setState({
                                  allDetails: ad,
                                  selectedFood:
                                    foods.length === 1 ? foods[0] : foods,
                                });
                                return true;
                              }}
                              value={
                                '' + this.state.allDetails[thisIndex].quantity
                              }
                            />
                          </View>

                          <View
                            style={{
                              width: 300,
                              height: 30,
                              left: 10,
                              marginTop: -31,
                            }}>
                            <Dropdown
                              ref={'unitLabel_' + thisIndex}
                              style={{
                                width: 200,
                                height: 30,
                                top: 0,
                                borderWidth: 1,
                                borderColor: '#ddd',
                              }}
                              data={units}
                              value={this.state.allDetails[thisIndex].unit}
                              onChangeText={(value, _, data) => {
                                let ad = this.state.allDetails;
                                let selectedUnit = value;
                                let selectedWeight = element.origin_weight;

                                element.unit_list.forEach(el => {
                                  if (selectedUnit === el.measure) {
                                    selectedWeight = el.serving_weight;
                                  }
                                });

                                let calorie =
                                  (element.origin_calories /
                                    element.origin_weight) *
                                  selectedWeight;
                                let protein =
                                  (element.nf_protein / element.origin_weight) *
                                  selectedWeight;
                                let fat =
                                  (element.nf_fat / element.origin_weight) *
                                  selectedWeight;
                                let carbo =
                                  (element.nf_carbo / element.origin_weight) *
                                  selectedWeight;
                                let foods = Array.isArray(
                                  this.state.selectedFood,
                                )
                                  ? this.state.selectedFood
                                  : [this.state.selectedFood];
                                foods[element.index].nf_calories = ad[
                                  thisIndex
                                ].calorie = calorie.toFixedNumber(2);
                                foods[element.index].nf_fat = ad[
                                  thisIndex
                                ].nf_fat = fat.toFixedNumber(2);
                                foods[element.index].nf_protein = ad[
                                  thisIndex
                                ].nf_protein = protein.toFixedNumber(2);
                                foods[element.index].nf_carbo = ad[
                                  thisIndex
                                ].nf_carbo = carbo.toFixedNumber(2);
                                foods[element.index].unit = ad[
                                  thisIndex
                                ].unit = value;

                                this.setState({
                                  allDetails: ad,
                                  selectedFood:
                                    foods.length === 1 ? foods[0] : foods,
                                });
                              }}
                            />
                          </View>
                        </View>
                      </View>,
                    );
                  }
                });

                return retVal;
              })()}

              <TouchableOpacity
                style={{
                  height: 36,
                  backgroundColor: '#ff00ea',
                  marginTop: 50,
                  marginLeft: 50,
                  marginRight: 50,
                }}
                onPress={() => {
                  this.setState({modal: false});

                  setTimeout(() => {
                    this.parentObj.addFood(this.state.selectedFood);
                  }, 40);
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    lineHeight: 36,
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  APPLY
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        ) : (
          <ScrollView
            style={{
              flex: 1,
              width: Dimensions.get('screen').width,
              backgroundColor: 'white',
            }}>
            {/* <TouchableOpacity style={{ height: 30, width: 100 }} onPress={() => {
                                        this.setState({sortDirection : this.state.sortDirection * -1});
                                        setTimeout(() => {
                                            this.onSearchFieldChange(this.state.searchText);
                                        }, 10)
                                    }}>
                                        <Text>Sort</Text>
                                    </TouchableOpacity> */}
            {this.state.searchText.trim().length === 0 ? (
              <Text style={{flex: 1, textAlign: 'center'}}>
                <Icon name="long-arrow-up" size={30} />
                {'\n'}
                Use the search box above to search{'\n'}
                for foods to add to your log{'\n'}
                {this.state.searchText}
              </Text>
            ) : (
              this.state.searchResult
            )}
          </ScrollView>
        )}

        {this.state.loading && (
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
}

function get_nutrient_item(nutritions, item_key) {
  for (var i = nutritions.length - 1; i >= 0; i--) {
    if (nutritions[i].attr_id === item_key) {
      return nutritions[i].value;
    }
  }
}
