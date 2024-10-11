import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';
import 'react-native-reanimated';

LogBox.ignoreAllLogs(true);
AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() =>
  require('./src/config/PlaybackService'),
);
