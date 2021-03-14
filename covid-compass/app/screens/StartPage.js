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
      <View
      style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%', width:'100%'}}
    >
      <Text
        style={{textAlign:'center', fontSize:40, marginBottom:150}}
      >
        COVID Compass
      </Text>
      <Button title='Enter COVID Compass 🧭' onPress={() => navigation.navigate('Home Page')} />
      </View>
    </SafeAreaView>
  );
};

export default StartPage;

const styles = StyleSheet.create({});
