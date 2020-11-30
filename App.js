import React from 'react';
import { Text, Animated, Easing } from 'react-native';
import LoginScreen from './src/screens/Login';
import SignupScreen from './src/screens/Signup';
import SignupDetailScreen from './src/screens/Signup_Detail';
import ForgotPassword from './src/screens/ForgotPassword';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MainScreen from './src/screens/MainScreen';
import ExerciseAddScreen from './src/screens/exerciseAddScreen';
import Database from './src/database/Database';
// import Realm from './src/database/Realm';


global.dinnerState = null;
global.apiConfig = {
    appID: '775ca81b',
    appKey: '1a2e21f2dd03a3a007529aa2001a1276',
    apiURL: 'https://api.nutritionix.com/v1_1/',
    searchAPI: (phrase) => apiURL + 'search/' + phrase + '?' + 'appId=' + appID + '&appKey=' + appKey + '&',
    itemAPI: () => apiURL + 'item?' + 'appId=' + appID + '&appKey=' + appKey + '&',
    brandAPI: (brandID) => apiURL + 'brand/' + brandID + '?' + 'appId=' + appID + '&appKey=' + appKey + '&',
    brandSearchAPI: () => apiURL + 'brand/search?' + 'appId=' + appID + '&appKey=' + appKey + '&',
    globalData1: '',
    apiExerciseURL: 'https://trackapi.nutritionix.com/v2/natural/exercise',
    apiNutrientsURL: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
    api2URL: "https://trackapi.nutritionix.com/v2/search/instant",
    makeQueryString: (url, params) => {
        var str = [];
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const element = params[key];
                str.push(key + '=' + encodeURIComponent(element));
            }
        }
        return url + '?' + str.join('&');
    }
}

global.myprofile = {};

global.myDB = new Database();
global.myDB.initDB();
const MainNavigator = createStackNavigator({
    Login: {
        screen: LoginScreen, path: 'Login', navigationOptions: {
            header: null,
        }
    },
    ForgotPassword: {
        screen: ForgotPassword, path: 'ForgotPassword', navigationOptions: {
            header: null,
        }
    },
    Signup: {
        screen: SignupScreen, path: 'Signup', navigationOptions: {
            header: null,
        }
    },
    SignupDetail: {
        screen: SignupDetailScreen, path: 'SignupDetail', navigationOptions: {
            header: null,
        }
    },
    add_exercise: {
        screen: ExerciseAddScreen, path: 'add_exercise', navigationOptions: { header: null }
    },
    Main: {
        screen: MainScreen,
        navigationOptions: {
            gesturesEnabled: false,
            headerStyle: {
                backgroundColor: "#0ff"
            },
            headerTitle: "Main Screen",
            header: null
        }
    }
}, {
    initialRouteName: 'Login',
    transitionConfig: () => ({
        transitionSpec: {
            duration: 200,
            timing: Animated.timing,
            easing: Easing.out(Easing.poly(4))
        },

        screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps

            const thisSceneIndex = scene.index
            const width = layout.initHeight

            const translateY = position.interpolate({
                inputRange: [thisSceneIndex - 1, thisSceneIndex],
                outputRange: [0, 0],
            })

            return { transform: [{ translateY }] }
        }
    }),
});

function make2(s) {
    return s < 10 ? "0" + s : s;
}

global.getFullDate = function (date) {
    return date.getFullYear() + "-" + make2(date.getMonth() + 1) + "-" + make2(date.getDate()) + " " + make2(date.getHours()) + ":" + make2(date.getMinutes()) + ":" + make2(date.getSeconds());
}
const App = createAppContainer(MainNavigator);

export default App;

console.disableYellowBox = true; 
