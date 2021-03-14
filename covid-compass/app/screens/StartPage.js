import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
} from 'react-native';

const StartPage = ({ navigation }) => {
  return (
    <SafeAreaView>
      <StatusBar backgroundColor='#000' barStyle='light-content' />
      <Button title='Start' onPress={() => navigation.navigate('Home Page')} />
    </SafeAreaView>
  );
};

export default StartPage;

const styles = StyleSheet.create({});
