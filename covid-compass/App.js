import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartPage from './app/screens/StartPage';
import HomePage from './app/screens/HomePage';
import SearchPage from './app/screens/SearchPage';
import SettingsPage from './app/screens/SettingsPage';
import CovidDataDisplay from './app/screens/CovidDataDisplay';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='StartPage' component={StartPage} />
        <Stack.Screen name='HomePage' component={HomePage} />
        <Stack.Screen name='SearchPage' component={SearchPage} />
        <Stack.Screen name='SettingsPage' component={SettingsPage} />
        <Stack.Screen name='CovidDataDisplay' component={CovidDataDisplay} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
