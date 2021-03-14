import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const CovidDataDisplay = ({ navigation }) => {
  return (
    <View>
      <Button
        title='Covid Data'
        onPress={() => navigation.navigate('CovidDataDisplay')}
      />
      <Button
        title='Settings'
        onPress={() => navigation.navigate('SettingsPage')}
      />
    </View>
  );
};

export default CovidDataDisplay;

const styles = StyleSheet.create({});
