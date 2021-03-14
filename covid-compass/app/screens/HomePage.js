import React, { useState, useEffect } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { LineChart, BarChart, Grid } from 'react-native-svg-charts';
import * as Location from 'expo-location';

const HomePage = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [countyID, setCountyID] = useState(null);
  const [currentData, setCurrentData] = useState();
  const [loadingCurrent, setLoadingCurrent] = useState(true);
  const [historicData, setHistoricData] = useState();
  const [loadingHistoric, setLoadingHistoric] = useState(true);

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
  }, []);

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

  const mapit = (location, countyID, currentData, historicData) => {
    const { county, liveData } =
      currentData != null
        ? currentData
        : { county: 'Loading county...', liveData: 'Loading live data...' };
    const { totalCases, newDeaths } =
      historicData != null
        ? historicData
        : {
            totalCases: 'Loading total cases...',
            newDeaths: 'Loading new deaths...',
          };

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
            description={county}>
            <View style={{ backgroundColor: '#CDCDCD', padding: '10%' }}>
              <Text>Information for {county}</Text>
              <Text>Live Data</Text>
              <ScrollView>
                {liveData != 'Loading live data...' && (
                  <BarChart
                    style={{ height: 200, width: 250 }}
                    data={liveData}
                    svg={{ fill: 'rgb(134, 65, 244)' }}
                    contentInset={{ top: 30, bottom: 30 }}>
                    <Grid />
                  </BarChart>
                )}

                <Text>Total Cases</Text>
                {totalCases != 'Loading total cases...' && (
                  <LineChart
                    style={{ height: 200, width: 250 }}
                    data={totalCases}
                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                    contentInset={{ top: 20, bottom: 20 }}>
                    <Grid />
                  </LineChart>
                )}
                <Text>New Deaths</Text>
                {newDeaths != 'Loading new deaths...' && (
                  <LineChart
                    style={{ height: 200, width: 250 }}
                    data={newDeaths}
                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                    contentInset={{ top: 20, bottom: 20 }}>
                    <Grid />
                  </LineChart>
                )}
              </ScrollView>
            </View>
          </Marker>
        </MapView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* {console.log(location)}
      {console.log(countyID)}
      {console.log(currentData)} */}
      {location != null && mapit(location, countyID, currentData, historicData)}
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
