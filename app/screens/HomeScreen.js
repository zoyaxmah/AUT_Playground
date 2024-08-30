import REact, {useState} from 'react';
import { View, 
    StyleSheet,
    TouchableOpacity,
    Text,
    TextInput,
    Image,
} from 'react-native';

function Homescreen({ Navigation}) {
    return (
        <View style={styles.background}>
            <View style={styles.bottomPanel}>
                <Image
                    source={require('../PlaygroundLogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#fc6a26",
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100, 
        height: 60,
        marginBottom: 1450,

    },
    bottomPanel: {
        height: 70,
        width: '100%',
        backgroundColor: '#ffd13b',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -740,
    }
});

export default Homescreen;