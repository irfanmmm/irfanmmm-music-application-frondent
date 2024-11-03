import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import store from './src/config/redux/store';
import StackNavigator from './src/routes/StackNavigator';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { useSetupTrackPlayer } from './src/trackplayer/useSetupTrackPlayer';

const App = () => {
  useSetupTrackPlayer({
    onLoad: () => {},
  });
  // App.js or index.js
  useEffect(() => {
    // Background message handler
    // const backgroundMessageHandler = messaging().setBackgroundMessageHandler(
    //   async remoteMessage => {
    //     console.log('Message handled in the background!', remoteMessage);
    //   },
    // );

    // Create a notification channel (Android)
    // PushNotification.createChannel(
    //   {
    //     channelId: 'default-channel-id',
    //     channelName: 'Default Channel',
    //     channelDescription: 'A default channel',
    //     // soundName: 'default',
    //   },
    //   created => console.log(`createChannel returned '${created}'`),
    // );

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);

      PushNotification.localNotification({
        channelId: 'default-channel-id',
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        userInfo: remoteMessage.data,
        largeIcon: 'ic_notification',
        smallIcon: 'ic_notification',
        bigLargeIcon: 'ic_notification',
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      <StackNavigator />
    </Provider>
  );
};
export default App;
