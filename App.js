import {
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
// import Icon from 'react-native-vector-icons/AntDesign';
// import HeartIcon from 'react-native-vector-icons/Foundation';
// import Skip from 'react-native-vector-icons/Feather';
import {responsiveui} from './src/config/width_hight_config';
// import {color} from './src/config/style';
import Home from './src/screens/Home';
import MusicPlayer from './src/screens/MusicPlayer';
import Favorate from './src/screens/Favorate';
import SplashScreen from 'react-native-splash-screen';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Login from './src/screens/Login';

const TABS = [
  {
    route: 'Home',
    component: Home,
    active: require('./src/img/home_active.png'),
    diactivate: require('./src/img/home.png'),
  },
  {
    route: 'MusicPlayer',
    component: MusicPlayer,
    active: require('./src/img/headphone_active.png'),
    diactivate: require('./src/img/headphone.png'),
  },
  {
    route: 'Favorate',
    component: Favorate,
    active: require('./src/img/heartactive.png'),
    diactivate: require('./src/img/heart.png'),
  },
];

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const App = () => {
  const tabBarHeight = useRef(new Animated.Value(responsiveui(0))).current;
  const [showTabBar, setShowTabBar] = useState(false);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    if (showTabBar) {
      setTimeout(() => {
        Animated.timing(tabBarHeight, {
          toValue: -100,
          duration: 1000,
          useNativeDriver: false,
        }).start();
        setShowTabBar(false);
      }, 3000);
    }
  }, [showTabBar, tabBarHeight]);

  const handleTabPress = visible => {
    if (visible) {
      setTimeout(() => {
        Animated.timing(tabBarHeight, {
          toValue: -100,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }, 3000);
      setShowTabBar(false);
    } else {
      Animated.timing(tabBarHeight, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
      setShowTabBar(true);
    }
  };

  function Tabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {backgroundColor: 'transparent'},
        }}
        tabBar={props => (
          <Animated.View
            style={{
              height: 0.15,
              position: 'absolute',
              bottom: tabBarHeight,
              left: 0,
              width: '100%',
            }}>
            <View
              style={{
                height: '100%',
                backgroundColor: '#0a071e',
                borderTopColor: '#0a071e',
              }}>
              <BottomTabBar {...props} />
            </View>
          </Animated.View>
        )}>
        {TABS.map((item, index) => (
          <Tab.Screen
            key={index}
            name={item.route}
            // eslint-disable-next-line no-undef
            initialParams={{handleTabPress, showTabBar}}
            component={item.component}
            options={{
              ...TransitionPresets.SlideFromRightIOS,
              tabBarStyle: {
                backgroundColor: '#0a071e',
                borderTopColor: '#0a071e',
                position: 'absolute',
                bottom: 0,
                // shadowColor: 'white',
                // shadowRadius: 5,
                // elevation: 2,
                right: responsiveui(0.05),
                left: responsiveui(0.05),
                borderTopLeftRadius: responsiveui(0.05),
                borderTopRightRadius: responsiveui(0.05),
              },
              tabBarShowLabel: false,
              tabBarIcon: ({focused}) => {
                return (
                  <View style={styles.iconContainer}>
                    <Image
                      style={{width: '60%', height: '60%'}}
                      resizeMode="contain"
                      source={focused ? item.active : item.diactivate}
                    />
                  </View>
                );
              },
              tabBarButton: props => (
                <Pressable
                  {...props}
                  onPress={() => {
                    handleTabPress(true);
                    props.onPress();
                  }}
                  style={styles.tabBarButton}>
                  <View style={styles.tabButtonView}>{props.children}</View>
                </Pressable>
              ),
            }}
          />
        ))}
      </Tab.Navigator>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {backgroundColor: 'transparent'},
            ...TransitionPresets.SlideFromRightIOS,
          }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Tabs" component={Tabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
