import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {color} from '../styles/style';
import {wp} from '../styles/responsive';
import {useRoute} from '@react-navigation/native';
import RNRestart from 'react-native-restart';

const ErrorScreen = () => {
  const route = useRoute();
  const {error} = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{error}</Text>
      <Pressable style={styles.tryAgainBtn} onPress={() => RNRestart.restart()}>
        <Text style={styles.btnText}>Try Again</Text>
      </Pressable>
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
    fontSize: wp(6),
    textAlign: 'center',
    fontFamily: 'Nunito-Regular',
  },
  tryAgainBtn: {
    width: wp(40),
    backgroundColor: color.textWhite,
    paddingVertical: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(2),
    marginTop: wp(5),
  },
  btnText: {
    fontSize: wp(5),
    color: color.background,
    fontFamily: 'Nunito-Bold',
  },
});

export default ErrorScreen;
