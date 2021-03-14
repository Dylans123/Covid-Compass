import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const HomePage = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [countyID, setCountyID] = useState(null);
  const [currentData, setCurrentData] = useState();
  const [loadingCurrent, setLoadingCurrent] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      lon = location.coords.longitude;
      lat = location.coords.latitude;

      fetch(
        'https://geo.fcc.gov/api/census/area?lat=' +
          lat +
          '&lon=' +
          lon +
          '&format=json'
      )
        .then(async (res) => await res.json())
        .then((res) => {
          setCountyID(res.results[0].county_fips);
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  }, []);

  useEffect(() => {
    fetch(
      'https://api.covidactnow.org/v2/county/' +
        countyID +
        '.json?apiKey=81fd4c1a6dae45a5a3f3e07983754248'
    )
      .then(async (res) => await res.json())
      .then((res) => {
        // console.log('current');
        console.log(res);
        const {
          cases,
          deaths,
          newCases,
          newDeaths: curNewDeaths,
        } = res.actuals;
        const { county: curCounty } = res;
        const current = {
          liveData: [cases, deaths, newCases, curNewDeaths],
          county: curCounty,
        };
        setCurrentData(current);
        setLoadingCurrent(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [countyID]);

  const mapit = (location, countyID, currentData) => {
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
            title={countyID != null ? countyID : 'test title'}
            description={
              currentData != null ? currentData.county : 'test description'
            }>
            <View style={{ backgroundColor: 'gray', padding: 10 }}>
              <Text>
                {currentData != null
                  ? JSON.stringify(currentData)
                  : 'test live data'}
              </Text>
            </View>
          </Marker>
        </MapView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {console.log(location)}
      {console.log(countyID)}
      {console.log(currentData)}
      {location != null && mapit(location, countyID, currentData)}
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
