import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {useSetupTrackPlayer} from '../trackplayer/useSetupTrackPlayer';
import {useLogTrackPlayerState} from '../trackplayer/useLogTrackPlayerState';
import {Image, View} from 'react-native';
import {color} from '../styles/style';
import {useApiCalls} from '../hooks/useApiCalls';
import {addEventListener} from '@react-native-community/netinfo';

const InitiolScreen = ({navigation}) => {
  const {checkHealth, error} = useApiCalls();
  useEffect(() => {
    AsyncStorage.getItem('user-data').then(async token => {
      if (token) {
        const unsubscribe = addEventListener(async state => {
          console.log('Connection type', state.type);
          console.log('Is connected?', state.isConnected);

          if (!state.isConnected)
            return navigation.navigate('ErrorScreen', {
              error: 'Network Error Please Try Again',
            });

          const health = await checkHealth();

          if (health.status) {
            navigation.navigate('Tabs');
          } else {
            navigation.navigate('Login');
          }
        });
      } else {
        navigation.navigate('Login');
      }
    });
  }, []);
  SplashScreen.hide();

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
