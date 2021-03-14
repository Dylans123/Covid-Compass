import React, { useState, useEffect } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { LineChart, BarChart, Grid } from 'react-native-svg-charts';
import * as Location from 'expo-location';
import { SearchBar } from 'react-native-elements';
import Geocoder from 'react-native-geocoding';

Geocoder.init('AIzaSyCDmfNfDBKbl1rn30FOoFezWq41slIbkOw');

const HomePage = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [countyID, setCountyID] = useState(null);
  const [currentData, setCurrentData] = useState();
  const [loadingCurrent, setLoadingCurrent] = useState(true);
  const [historicData, setHistoricData] = useState();
  const [loadingHistoric, setLoadingHistoric] = useState(true);
  const [search, setSearch] = useState();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      lon = location.coords.longitude;
      lat = location.coords.latitude;

      setLocation({ latitude: lat, longitude: lon });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      fetch(
        'https://geo.fcc.gov/api/census/area?lat=' +
          location.latitude +
          '&lon=' +
          location.longitude +
          '&format=json',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
        .then(async (res) => await res.json())
        .then((res) => {
          setCountyID(res.results[0].county_fips);
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  }, [location]);

  useEffect(() => {
    fetch(
      'https://api.covidactnow.org/v2/county/' +
        countyID +
        '.json?apiKey=81fd4c1a6dae45a5a3f3e07983754248',
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then(async (res) => await res.json())
      .then((res) => {
        // console.log('current');
        // console.log(res);
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

    fetch(
      'https://api.covidactnow.org/v2/county/' +
        countyID +
        '.timeseries.json?apiKey=81fd4c1a6dae45a5a3f3e07983754248'
    )
      .then(async (res) => await res.json())
      .then((res) => {
        // console.log('historic');
        // console.log(res);
        const totalCases = res.actualsTimeseries.map((dataPoint) => {
          if (dataPoint.cases) {
            return dataPoint.cases;
          }
        });
        const newDeaths = res.actualsTimeseries.map((dataPoint) => {
          if (dataPoint.newDeaths) {
            return dataPoint.newDeaths;
          }
        });
        //console.log('newDeaths');
        //console.log(newDeaths);
        const historic = {
          totalCases,
          newDeaths,
        };
        // console.log(historic)
        setHistoricData(historic);
        setLoadingHistoric(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [countyID]);

  const mapit = (location, countyID, currentData, historicData, navigation) => {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          <Marker
            key={'1'}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={'Click to See More'}
            description={
              currentData != null ? currentData.county : 'Loading county..'
            }
            onCalloutPress={() => {
              //   console.log('pressed');
              if (currentData != null && historicData != null) {
                navigation.navigate('Covid Data Display', {
                  currentData: currentData,
                  historicData: historicData,
                });
              }
            }}></Marker>
        </MapView>
      </View>
    );
  };

  function updateSearch(search) {
    setSearch(search);
    console.log('If init ' + Geocoder.isInit);
    Geocoder.from(search)
      .then((json) => {
        var loc = json.results[0].geometry.location;
        setLocation({ latitude: loc.lat, longitude: loc.lng });
        console.log(loc);
      })
      .catch((error) => console.log(error));
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#000000' barStyle='light-content' />
      <View style={{ width: 350, marginTop: 50 }}>
        <SearchBar
          style={{ alignItems: 'center', justifyContent: 'center' }}
          placeholder='Type Here...'
          onChangeText={updateSearch}
          lightTheme={true}
          value={search}
        />
      </View>

      <View>
        {location != null &&
          mapit(location, countyID, currentData, historicData, navigation)}
      </View>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  map: {
    width: 350,
    height: 600,
  },
});
