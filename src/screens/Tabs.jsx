function Tabs() {
    // useEffect(() => {
    //   const activeTabRoute = TABS_ROUTES[index]?.route;

    // }, [index])

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