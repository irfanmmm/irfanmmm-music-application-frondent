import {
  Image,
  Pressable,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';

import SplashScreen from 'react-native-splash-screen';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation, useNavigationState } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Login from './Login';
import { hp, wp } from '../config/width_hight_config';
import { TABS_ROUTES } from '../config/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setCurrentTab } from '../config/redux/reducer';
import { color } from '../config/style';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Root = () => {


  const tabBarHeight = useRef(new Animated.Value(hp(0))).current;
  const state = useSelector(state => ({
    userlogin: state.store.userlogin,
    currentTab: state.store.currentTab,
  }), shallowEqual)
  const dispatch = useDispatch()
  const [iseLogged, setIsLoagged] = useState(true)




  useEffect(() => {

    AsyncStorage.getItem('user-data').then((res) => {
      if (res) {

        setIsLoagged(true);
        SplashScreen.hide();
      } else {
        setIsLoagged(false);
        SplashScreen.hide();
      }
    }).catch((error) => {
      setIsLoagged(false);
      SplashScreen.hide();
    })

  }, []);

  useEffect(() => {
    if (state.currentTab === 'MusicPlayer') {
      Animated.timing(tabBarHeight, {
        toValue: hp(-15),
        duration: 1000,
        useNativeDriver: false,
      }).start();
      // setShowTabBar(false);
    } else {
      Animated.timing(tabBarHeight, {
        toValue: hp(0),
        duration: 0,
        useNativeDriver: false,
      }).start();
      // setShowTabBar(true);
    }
  }, [state.currentTab])




  function Tabs() {
    const navigation = useNavigation()
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: 'transparent' },
        }}
        tabBar={props => (
          <Animated.View
            style={{
              position: 'absolute',
              bottom: tabBarHeight,
              left: 0,
              width: '100%',
            }}>
            <View
              style={{
                // height: '100%',
                backgroundColor: '#0a071e',
                borderTopColor: '#0a071e',
              }}>
              <BottomTabBar {...props} />
            </View>
          </Animated.View>
        )}>
        {TABS_ROUTES.map((item, index) => (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              ...TransitionPresets.SlideFromRightIOS,
              tabBarStyle: {
                backgroundColor: color.bagroundcolor,
                borderTopColor: color.bagroundcolor,
                position: 'absolute',
                height: wp(20),
                paddingBottom: wp(5),
                bottom: 0,
                right: wp(5),
                left: wp(5),
                borderTopLeftRadius: wp(5),
                borderTopRightRadius: wp(5),
              },
              tabBarShowLabel: false,
              tabBarIcon: ({ focused }) => {
                return (
                  <View style={styles.iconContainer}>
                    <Image
                      style={{ width: '60%', height: '60%' }}
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
                    props.onPress();
                    // handleTabPress(false)
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

    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: 'transparent' },
            ...TransitionPresets.SlideFromRightIOS,
          }}>
          {
            iseLogged || state.userlogin ?
              <Stack.Screen name="Tabs" component={Tabs} /> :
              <Stack.Screen name="Login" component={Login} />
          }
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

export default Root;
