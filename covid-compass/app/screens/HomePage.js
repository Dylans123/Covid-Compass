import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const HomePage = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const mapit = (location) => {
    console.log(location);
    console.log(location.coords.latitude);
    console.log(location.coords.longitude);
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          <Marker
            key={'1'}
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={'test1'}
            description={'test2'}
          />
        </MapView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {location != null && mapit(location)}
      {/* <Button
        title='Covid Data'
        onPress={() => navigation.navigate('Covid Data Display')}
      />
      <Button
        title='Search'
        onPress={() => navigation.navigate('Search Page')}
      />
      <Button
        title='Settings'
        onPress={() => navigation.navigate('Settings Page')}
      /> */}
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
