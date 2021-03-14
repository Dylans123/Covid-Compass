import React, { useEffect, useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LineChart, BarChart, Grid } from 'react-native-svg-charts';
import { Spinner } from 'native-base';
import { Dimensions } from 'react-native';

const CovidDataDisplay = ({ route, navigation }) => {
  const { currentData, historicData } = route.params;

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
    <SafeAreaView
      style={{
        backgroundColor: '#CDCDCD',
        padding: '10%',
        height: Dimensions.get('window').height,
        alignContent: 'center',
        justifyContent: 'center',
      }}>
      <StatusBar backgroundColor='#000' barStyle='light-content' />
      <View>
        <Text>Information for {county}</Text>
        <Text>Live Data</Text>
        <ScrollView>
          {liveData != 'Loading live data...' && (
            <BarChart
              style={{ height: 200 }}
              data={liveData}
              svg={{ fill: 'rgb(134, 65, 244)' }}
              contentInset={{ top: 30, bottom: 30 }}>
              <Grid />
            </BarChart>
          )}

          <Text>Total Cases</Text>
          {totalCases != 'Loading total cases...' && (
            <LineChart
              style={{ height: 200 }}
              data={totalCases}
              svg={{ stroke: 'rgb(134, 65, 244)' }}
              contentInset={{ top: 20, bottom: 20 }}>
              <Grid />
            </LineChart>
          )}
          <Text>New Deaths</Text>
          {newDeaths != 'Loading new deaths...' && (
            <LineChart
              style={{ height: 200 }}
              data={newDeaths}
              svg={{ stroke: 'rgb(134, 65, 244)' }}
              contentInset={{ top: 20, bottom: 20 }}>
              <Grid />
            </LineChart>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CovidDataDisplay;

const styles = StyleSheet.create({});
