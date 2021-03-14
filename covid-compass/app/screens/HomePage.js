import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, ScrollView} from 'react-native';
import { LineChart, BarChart, Grid } from 'react-native-svg-charts';
import {  Spinner } from 'native-base';

const HomePage = ({ navigation }) => {
  const [currentData, setCurrentData] = useState()
  const [historicData, setHistoricData] = useState()
  const [loadingCurrent, setLoadingCurrent] = useState(true);
  const [loadingHistoric, setLoadingHistoric] = useState(true);

  useEffect(() => {
    fetch('https://api.covidactnow.org/v2/county/12011.json?apiKey=81fd4c1a6dae45a5a3f3e07983754248')
      .then(async (res) => await res.json())
      .then(res => {
        console.log('current')
        console.log(res);
        const { cases, deaths, newCases, newDeaths: curNewDeaths } = res.actuals;
        const { county: curCounty } = res;
        const current = {
          liveData: [cases, deaths, newCases, curNewDeaths],
          county: curCounty
        }
        setCurrentData(current);
        setLoadingCurrent(false);
      })
      .catch(error => {
        console.log(error);
      })
    
    fetch('https://api.covidactnow.org/v2/county/12011.timeseries.json?apiKey=81fd4c1a6dae45a5a3f3e07983754248')
      .then(async (res) => await res.json())
      .then(res => {
        console.log('historic')
        // console.log(res);
        const totalCases = res.actualsTimeseries.map((dataPoint) => {
          if (dataPoint.cases) {
            return dataPoint.cases;
          }
        })
        const newDeaths = res.actualsTimeseries.map((dataPoint) => {
          if (dataPoint.newDeaths) {
            return dataPoint.newDeaths;
          }
        })
        console.log('newDeaths')
        console.log(newDeaths)
        const historic = {
          totalCases,
          newDeaths
        }
        // console.log(historic)
        setHistoricData(historic);
        setLoadingHistoric(false);
      })
      .catch(error => {
        console.log(error);
      })
  }, [])

  if (loadingCurrent || loadingHistoric) {
    console.log('loading')
    return (
      <View style={{ padding: '10%', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    )
  } else if (!currentData || !historicData) {
    console.log('error')
    return (
      <View style={{ padding: '10%' }}>
        <Text>Error</Text>
      </View>
    )
  }
  console.log('displaying')
  const { county, liveData } = currentData;
  console.log(liveData);
  const { totalCases, newDeaths } = historicData;
  return (
    <View style={{ padding: '10%' }}>
    <Text>Information for {county}</Text>
    <Text>Live Data</Text>
    <ScrollView>
    <BarChart style={{ height: 200 }} data={liveData} svg={{ fill: 'rgb(134, 65, 244)' }} contentInset={{ top: 30, bottom: 30 }}>
      <Grid />
    </BarChart>
    <Text>Total Cases</Text>
    <LineChart
        style={{ height: 200 }}
        data={totalCases}
        svg={{ stroke: 'rgb(134, 65, 244)' }}
        contentInset={{ top: 20, bottom: 20 }}
    >
      <Grid />
    </LineChart>
    <Text>New Deaths</Text>
    <LineChart
        style={{ height: 200 }}
        data={newDeaths}
        svg={{ stroke: 'rgb(134, 65, 244)' }}
        contentInset={{ top: 20, bottom: 20 }}
    >
      <Grid />
    </LineChart>
    {/* <Button
      title='Covid Data'
      onPress={() => navigation.navigate('CovidDataDisplay')}
    /> */}
    <Button
      title='Settings'
      onPress={() => navigation.navigate('Settings Page')}
    />
    </ScrollView>
  </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({});
