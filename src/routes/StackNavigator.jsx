import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import InitiolScreen from '../screens/SplashScreen';
import Login from '../screens/Login';
import ErrorScreen from '../screens/ErrorScreen';
import TabNavigator from './TabNavigator';

const StackNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {backgroundColor: 'transparent'},
            ...TransitionPresets.SlideFromRightIOS,
          }}>
          <Stack.Screen name="SplashScreen" component={InitiolScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="ErrorScreen" component={ErrorScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default StackNavigator;
