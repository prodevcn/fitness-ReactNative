import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TextInput,
    Keyboard,
    Image,
    TouchableOpacity,
} from 'react-native';
import SideMenu from 'react-native-side-menu';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ConfigData from './config';

const styles = StyleSheet.create({
    navigationBar: {
        height: 44 + getStatusBarHeight(),
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'green',
    },
    navigationTitle: {
        width: '100%',
        textAlign: 'center',
        paddingTop: 8,
        marginTop: getStatusBarHeight(),
        fontSize: 20,
        position: 'absolute',
        color: 'white'
    },
    backButton: {
        position: 'absolute',
        paddingTop: 4,
        paddingLeft: 10
    },
});

export default class ExerciseAddScreen extends Component {
    state = {
        searchQuery: '',
        addButtonDisabled: false
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.navigationBar}>
                    <Text style={styles.navigationTitle}>
                        Add Exercise
                    </Text>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        style={[styles.backButton, { marginTop: getStatusBarHeight() }]}
                    >
                        <Text style={{ color: 'white' }}>
                            <Icon5 name='angle-left' size={30}></Icon5>
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, marginTop: getStatusBarHeight() + 50 }}>
                    <TextInput
                        value={this.state.searchQuery}
                        onChangeText={(text) => { this.setState({ searchQuery: text }) }}
                        multiline={true}
                        scrollEnabled={true}
                        style={{ marginLeft: 30, height: 200, marginTop: 20, marginRight: 30, borderWidth: 1, borderColor: '#ddd' }}
                        placeholder={"Enter your exercises.\n\ne.g.\n running 45 min\n walked 1 hour\n 100 cal"} />

                    <TouchableOpacity
                        style={{ backgroundColor: (this.state.searchQuery.trim().length == 0 || this.state.addButtonDisabled) ? 'gray' : 'green', marginLeft: 30, marginRight: 30, marginTop: 30, height: 40 }}
                        onPress={this.addExercise}

                        disabled={(this.state.searchQuery.trim().length == 0 || this.state.addButtonDisabled)}>
                        <Text style={{ flex: 1, textAlign: 'center', lineHeight: 40, color: 'white', fontWeight: 'bold' }}>Add</Text>
                    </TouchableOpacity>
                </View>

            </View >
        );
    }

    addExercise = () => {
        this.setState({ addButtonDisabled: true });
        fetch(global.apiConfig.apiExerciseURL,
            {
                method: 'post',
                body: JSON.stringify({
                    query: this.state.searchQuery,
                    gender: global.myprofile.gender || 'male',
                    weight_kg: global.myprofile.weight,
                    height_cm: global.myprofile.height,
                    age: global.myprofile.age
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-app-id': global.apiConfig.appID,
                    'x-app-key': global.apiConfig.appKey,
                    'x-remote-user-id': 0
                }
            }).then((response) => response.json()).then((responseJson) => {
                this.setState({ addButtonDisabled: false });
                if (responseJson.exercises && responseJson.exercises.length > 0) {
                    this.props.navigation.state.params.callback(responseJson.exercises);
                    this.props.navigation.goBack();
                } else {
                    alert("Exercises unrecognized. Try other exercises.");
                }
            }).catch(
                (error) => {
                    this.setState({ addButtonDisabled: false });
                    alert("There was an error while processing the request. Try again.");
                }
            )
    }
}