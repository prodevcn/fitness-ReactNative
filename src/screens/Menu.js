import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    Dimensions,
    StyleSheet,
    ScrollView,
    View,
    Image,
    Text,
} from 'react-native';
import { tsConstructorType } from '@babel/types';
import ConfigData from './config';

const window = Dimensions.get('window');
const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';

const styles = StyleSheet.create({
    menu: {
        flex: 1,
        width: window.width,
        height: window.height,
        backgroundColor: '#ddd',
    },
    avatarContainer: {
        marginBottom: 20,
        marginTop: 40,
        marginLeft: 20
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        flex: 1,
    },
    name: {
        position: 'absolute',
        left: 70,
        top: 20,
    },
    item: {
        fontSize: 14,
        fontWeight: '300',
        paddingTop: 15,
        paddingBottom: 10,
        paddingLeft: 20
    },
});

export default class Menu extends React.Component {
    state = {
        selectedIndex: 0
    };

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.onClickMenuItem = this.onClickMenuItem.bind(this);
        this.onItemSelected = this.props.onItemSelected;
    }

    onClickMenuItem = (label, index) => {
        this.onItemSelected(label);
        this.setState({ selectedIndex: index });
    }

    render() {
        return (
            <ScrollView scrollsToTop={false} style={styles.menu}>
                <View style={styles.avatarContainer}>
                    <Image
                        style={styles.avatar}
                        source={{ uri }}
                    />
                    <Text style={styles.name}>{global.myprofile.name}</Text>
                </View>

                <Text
                    onPress={() => { this.onClickMenuItem('Home', 0); this.props.contentView.setState({ tabIndex: ConfigData.TAB_DASHBOARD }) }}
                    style={[styles.item, this.state.selectedIndex == 0 ? { backgroundColor: 'white' } : {}]}
                ><Icon name="home" size={20}></Icon> Home</Text>

                <Text
                    onPress={() => { this.onClickMenuItem('Contacts', 1); this.props.contentView.setState({ tabIndex: ConfigData.TAB_TRACK }) }}
                    style={[styles.item, this.state.selectedIndex == 1 ? { backgroundColor: 'white' } : {}]}
                ><Icon name="magic" size={20}></Icon> Track</Text>

                <Text
                    onPress={() => { this.onClickMenuItem('Contacts', 2); this.props.contentView.setState({ tabIndex: ConfigData.TAB_PREFERENCE }) }}
                    style={[styles.item, this.state.selectedIndex == 2 ? { backgroundColor: 'white' } : {}]}
                ><Icon name="cogs" size={20}></Icon> Preference</Text>

                <Text
                    onPress={() => {
                        this.onClickMenuItem('Contacts', 3); this.props.contentView.setState({ tabIndex: ConfigData.TAB_DAILYGOALS });
                    }}
                    style={[styles.item, this.state.selectedIndex == 3 ? { backgroundColor: 'white' } : {}]}
                ><Icon name="dot-circle-o" size={20}></Icon> Daily Goals</Text>

                <Text
                    onPress={() => { this.onClickMenuItem('Contacts', 4); this.props.contentView.setState({ tabIndex: ConfigData.TAB_MYCOACH }); }}
                    style={[styles.item, this.state.selectedIndex == 4 ? { backgroundColor: 'white' } : {}]}
                ><Icon name="user" size={20}></Icon> My coach</Text>

                <Text
                    onPress={() => { this.onClickMenuItem('Contacts', 5); this.props.contentView.setState({ tabIndex: ConfigData.TAB_HELP }); }}
                    style={[styles.item, this.state.selectedIndex == 5 ? { backgroundColor: 'white' } : {}]}
                ><Ionicons name="md-help" size={20}></Ionicons> Help</Text>

                <Text
                    onPress={() => {
                        this.onClickMenuItem('Contacts', 6);
                        if (this.props.contentView.props.name == "OK")
                            this.props.contentView.nagivation.goBack();
                        else
                            this.props.contentView.nagivation.pop(2);
                    }}
                    style={[styles.item, this.state.selectedIndex == 6 ? { backgroundColor: 'white' } : {}]}
                ><Icon name="power-off" size={20}></Icon> Sign out</Text>
            </ScrollView >
        );
    }
}
