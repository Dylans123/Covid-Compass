import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const HomePage = ({ navigation }) => {
  return (
    <View>
      <Button
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
      />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({});
