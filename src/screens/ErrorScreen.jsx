import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {color} from '../styles/style';
import {hp, responsiveui, wp} from '../styles/responsive';
import {useRoute} from '@react-navigation/native';

const ErrorScreen = () => {
  const route = useRoute();
  const {error} = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bagroundcolor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: color.textWhite,
    fontSize: wp(4),
    textAlign: 'center',
  },
});

export default ErrorScreen;
