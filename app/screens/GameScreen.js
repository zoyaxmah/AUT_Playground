import MapView, { Marker } from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, ScrollView } from 'react-native';


function GameScreen() {
    return(
        <MapView 
        style={styles.map}
        initialRegion={{
            latitude: -36.853500246993384,
            longitude: 174.766484575191,
            latitudeDelta: 0.00022,
            longitudeDelta: 0.0021,
            }}
        >
            <Marker
            coordinate={{ latitude: -36.853500246993384, longitude: 174.766484575191 }}
            title="My Location"
            description="Here is where the action happens!"
            />
        </MapView>

        
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
});

export default GameScreen;
