import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {useSetupTrackPlayer} from '../trackplayer/useSetupTrackPlayer';
import {useLogTrackPlayerState} from '../trackplayer/useLogTrackPlayerState';
import {Image, View} from 'react-native';
import {color} from '../styles/style';
import {useApiCalls} from '../hooks/useApiCalls';
const InitiolScreen = ({navigation}) => {
  const {checkHealth} = useApiCalls();
  useEffect(() => {
    AsyncStorage.getItem('user-data').then(async token => {
      if (token) {
        const health = await checkHealth();

        if (health.status) {
          navigation.navigate('Tabs');
        } else {
          navigation.navigate('Login');
        }
      } else {
        navigation.navigate('Login');
      }
    });
  }, []);
  const handleTrackPlayerLoaded = useCallback(() => {
    SplashScreen.hide();
  }, []);

  useSetupTrackPlayer({
    onLoad: handleTrackPlayerLoaded,
  });

  useLogTrackPlayerState();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.background,
      }}>
      <Image source={require('./../img/screen.png')} />
    </View>
  );
};

export default InitiolScreen;
