import MapView, { Marker } from 'react-native-maps';
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

function GameScreen({ navigation }) {
  return (
    <View>
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title="My Location"
          description="Here is where the action happens!"
        />
      </MapView>

      <View style={styles.dock}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.dockText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <Text style={styles.dockText}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.dockText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  dock: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 10,
  },
  dockText: {
    fontSize: 16,
    color: '#333',
  },
});

export default GameScreen;
