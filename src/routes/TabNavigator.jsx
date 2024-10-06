import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {View, Image, Pressable, StyleSheet, Animated} from 'react-native';
import {TABS_ROUTES} from './routes';
import {color} from '../styles/style';
import {hp, wp} from '../styles/responsive';
import {useEffect, useRef} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {TransitionPresets} from '@react-navigation/stack';
import {useNavigation, useNavigationState} from '@react-navigation/native';

const CustomTabBar = props => {
  const navigation = useNavigation();
  const tabBarHeight = useRef(new Animated.Value(hp(0))).current;
  const state = useSelector(
    state => ({
      userlogin: state.store.userlogin,
      currentTab: state.store.currentTab,
    }),
    shallowEqual,
  );

  useEffect(() => {
    if (state.currentTab === 'MusicPlayer') {
      Animated.timing(tabBarHeight, {
        toValue: hp(-15),
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(tabBarHeight, {
        toValue: hp(0),
        duration: 0,
        useNativeDriver: false,
      }).start();
    }
  }, [state.currentTab]);
  // Get the current navigation state
  const navigationState = navigation.getState();
  const routeName = navigationState.routes[navigationState.index].name;// Active tab name

  console.log('Active Tab Index:', navigationState);
//   console.log('Active Tab Name:', activeTabName);

  //   console.log('Active Tab Index:', currentTabIndex);
  //   console.log('Active Tab Name:', activeTab);

  return (
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
  );
};

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {backgroundColor: 'transparent'},
      }}
      //   tabBar={props => {

      tabBar={props => <CustomTabBar {...props} />}
      //   }}
    >
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

export default TabNavigator;
