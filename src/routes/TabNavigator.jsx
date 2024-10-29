import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {View, Image, Pressable, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {TABS_ROUTES} from './routes';
import {color} from '../styles/style';
import {wp} from '../styles/responsive';
import {TransitionPresets} from '@react-navigation/stack';
import {useNavigationState} from '@react-navigation/native';

const CustomTabBar = props => {
  const translateY = useSharedValue(0);
  const navigationState = useNavigationState(state => state);
  const animatedStyle = useAnimatedStyle(() => {
    if (navigationState?.routes[1]?.state?.index === 1) {
      translateY.value = 100;
    } else {
      translateY.value = 0;
    }
    return {
      transform: [
        {
          translateY: withTiming(translateY.value, 1000),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.tabBarmainContainer, animatedStyle]}>
      <View style={styles.tabBarsubcontainer}>
        <BottomTabBar {...props} />
      </View>
    </Animated.View>
  );
};

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  const onSwithTabs = path => {
    // if(path === '')
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {backgroundColor: 'transparent'},
      }}
      tabBar={props => <CustomTabBar {...props} />}>
      {TABS_ROUTES.map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.route}
          component={item.component}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
            tabBarStyle: styles.tabBarStyle,

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
                  onSwithTabs(props.to);
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
  tabBarmainContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
  },
  tabBarsubcontainer: {
    backgroundColor: '#0a071e',
    borderTopColor: '#0a071e',
  },
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
});

export default TabNavigator;
