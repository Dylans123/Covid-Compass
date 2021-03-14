import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const HomePage = ({ navigation }) => {
  return (
    <View>
      <Button
        title='Covid Data'
        onPress={() => navigation.navigate('CovidDataDisplay')}
      />
      <Button
        title='Search'
        onPress={() => navigation.navigate('SearchPage')}
      />
      <Button
        title='Settings'
        onPress={() => navigation.navigate('SettingsPage')}
      />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({});
