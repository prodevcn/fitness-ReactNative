import React, { Fragment, Component } from 'react';
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
    StatusBar
} from 'react-native';
import FormTextInput from "../components/FormTextInput";
import Button from "../components/Button";
import { Config } from '@jest/types';
import ConfigData from './config';

export default class ForgotPassword extends Component {
    state = {
        email: "",
        password: ""
    };

    handleEmailChange = (email) => {
        this.setState({ email: email });
    };

    emailCorrect = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    };

    render() {

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView style={styles.container} behavior='padding'>
                    <View style={{ flex: 1, width: '100%', height: '30%', padding: 0, paddingTop: '30%', backgroundColor: 'white' }}>
                        <Text style={{ color: 'black', fontSize: 35, textAlign: 'center' }}>Medical App Test</Text>
                    </View>
                    <View style={{ flex: 1, width: "80%" }}>
                        <FormTextInput
                            value={this.state.email}
                            onChangeText={this.handleEmailChange}
                            placeholder={"E-mail"}
                        />

                        <Button label={"Reset Password"} onPress={(navigate) => {
                            let email = this.state.email.trim();
                            if (!this.emailCorrect(email)) {
                                Alert.alert("Error", "Invalid E-mail Address! Try again.");
                                return;
                            }

                            fetch(ConfigData.SERVER_HOST + 'api/user/forgotpassword',
                                {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        email: email.toLowerCase()
                                    })
                                })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    if (responseJson.message == "OK") {
                                        Alert.alert("Success", "Check your email and follow the instruction.")
                                    } else {
                                        Alert.alert('Error', "User not found");
                                    }
                                })
                                .catch((error) => {
                                    Alert.alert('Error', "Unexpected error has occurred");
                                });
                        }} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ width: '100%', textAlign: 'center', color: 'blue', paddingBottom: 40 }}
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}>
                            Login
                        </Text>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>

        );
    }
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: "center",
        //justifyContent: "space-between"
    }
});