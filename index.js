import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import { PlaybackService } from './src/config/PlaybackService';
import TrackPlayer from 'react-native-track-player';
import 'react-native-reanimated'


LogBox.ignoreAllLogs();

// This needs to go right after you register the main component of your app
// AppRegistry.registerComponent(...)
AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => require('./src/config/PlaybackService'));
