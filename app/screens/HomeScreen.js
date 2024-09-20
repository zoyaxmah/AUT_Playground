import React, {useState, useEffect} from 'react';
import { View, 
    StyleSheet,
    TouchableOpacity,
    Text,
    Alert,
    Image
} from 'react-native';

function Homescreen({ navigation }) {
    

    return (
        <View style={styles.background}>
            <Image
                source={require('../../assets/PlaygroundLogo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Image
                source={require('../../assets/HomeButton.png')}
                style={styles.homeButton}
                resizeMode="contain"
            />
            <TouchableOpacity
                onPress={() => {
                    console.log('game time!');
                    navigation.navigate('Game');
                }}
                style={[styles.touchableOpacity, {padding: 10}]}
            >
                <Image 
                source={require('../../assets/GameButton.png')}
                style={styles.gameButton}
                resizeMode="contain"
                />
            </TouchableOpacity>
            <View style={styles.bottomPanel} />
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#fc6a26",
    },
    touchableOpacity: {
        position: 'absolute',
        bottom:0,
        left:20,
        zIndex: 2,
        backgroundColor:'transparent',
    },
    logo: {
        width: 100, 
        height: 60,
        position:'absolute',
        top:'5%',
        left: '38%',
    },
    homeButton: {
        width: 30,
        height:30,
        position: 'absolute',
        bottom: 15,
        left: '47%',
        zIndex: 1,
    },
    gameButton: {
        width: 30,
        height:30,
        position: 'absolute',
        bottom: 15,
        left: 20,
        zIndex:1,
    },
    bottomPanel: {
        height: 58,
        width: '100%',
        backgroundColor: '#ffd13b',
        position:'absolute',
        bottom:0,
        zIndex: 0,
    },
});

export default Homescreen;