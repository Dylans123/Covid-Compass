import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const StartPage = ({ navigation }) => {
  return (
    <View>
      <Button title='Start' onPress={() => navigation.navigate('Home Page')} />
    </View>
  );
};

export default StartPage;

const styles = StyleSheet.create({});
