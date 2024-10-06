import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Animated,
  View,
  Pressable,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeArea} from 'react-native-safe-area-context';
import {color} from '../styles/style';
import {hp, responsiveui, wp} from '../styles/responsive';
import {HomeCard} from '../components/HomeCard';
import {HomeHoriZontalCard} from '../components/HomeHoriZontalCard';
import {useApiCalls} from '../hooks/useApiCalls';
import {setProfile} from '../config/redux/reducer';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ReAnimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSetupTrackPlayer} from '../trackplayer/useSetupTrackPlayer';
import { MinimisedContainer } from '../components/MinimisedContainer';

const Home = ({navigation}) => {
  useSetupTrackPlayer({
    onLoad: () => {},
  });
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const {getProfileDetails, loading, getAllsongs, recentsongs} = useApiCalls();

  const state = useSelector(
    state => ({
      profileDetails: state.store.profiledetails,
    }),
    shallowEqual,
  );

  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, hp(15));
  const translateY = diffClamp.interpolate({
    inputRange: [0, hp(15)],
    outputRange: [0, -hp(15)],
  });

  const [songsDetails, setSongDetails] = useState([]);
  const [activeInput, setActiveInput] = useState(false);
  const [rececntSongs, setRececntSongs] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await getProfileDetails();

      const reponse = await getAllsongs();
      setSongDetails(reponse?.data);

      const recent = await recentsongs();
      if (recent.status) {
        setRececntSongs(recent?.data);
      }
      dispatch(setProfile(response));
    })();
  }, []);

  const handleeClick = (item, index) => {
    navigation.navigate('MusicPlayer', {
      slectedSong: item,
      selectedIndex: index,
    });
  };
  const inputWidth = useSharedValue(wp(60)); // Initial width is 60% of screen
  const inputY = useSharedValue(wp(0)); // Initial width is 60% of screen

  const animatedInputStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(inputY.value, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
      width: withTiming(inputWidth.value, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }), // Easing function for smooth transition), // Animating the width
    };
  });

  const handleeClickSearchIcon = () => {
    setActiveInput(true);
    inputWidth.value = wp(90); // Animate to full width when active
    inputY.value = wp(15);
  };

  const handleBlur = () => {
    setActiveInput(false);
    inputWidth.value = wp(60); // Return to initial width when input loses focus
    inputY.value = wp(10);
  };

  const handleSearchInput = text => {
    console.log(text); // search text
  };

  return (
    <View style={styles.safeArea}>
      <Animated.View
        style={[
          styles.hedder,

          {
            paddingTop: insets.top === 0 ? hp(5) : insets.top + hp(2),
            transform: [{translateY: translateY}],
            opacity: activeInput ? 0 : 1,
          },
        ]}>
        {loading ? (
          <SkeletonPlaceholder borderRadius={4} direction="left">
            <View style={{flexDirection: 'row'}}>
              <View style={styles.profid} />
              <View style={{justifyContent: 'center', marginLeft: wp(5)}}>
                <View
                  style={{width: wp(50), height: wp(3), marginBottom: wp(2)}}
                />
                <View style={{width: wp(30), height: wp(3)}} />
              </View>
            </View>
          </SkeletonPlaceholder>
        ) : (
          <>
            <Image
              resizeMode={'cover'}
              source={{uri: state?.profileDetails?.profile}}
              style={styles.profid}
            />
            <View style={styles.hedder_center}>
              <Text style={styles.name_person}>
                {state.profileDetails?.username
                  ? state.profileDetails.username
                  : 'Sarwar Jahan'}
              </Text>
              <Text style={styles.hedder_discription}>Gold Member</Text>
            </View>
          </>
        )}
        <Feather name="bell" size={wp(7)} color={color.textgrey} />
        {/* <Image source={require('../img/bell.png')} /> */}
      </Animated.View>
      {activeInput && (
        <ReAnimated.View
          style={[
            animatedInputStyle,
            {
              backgroundColor: color.bagroundcolor,
              zIndex: 50,
              left: wp(5),
              position: 'relative',
              color: color.textWhite,
              borderWidth: 1,
              paddingHorizontal: wp(5),
              borderColor: color.textdarckgrey,
              borderRadius: wp(2),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}>
          <TextInput
            style={{height: wp(10)}}
            placeholder="Search Latest Songs"
            onBlur={handleBlur} // Handle when input loses focus
            autoFocus={true} // Open the keyboard when input becomes active
            onChangeText={handleSearchInput}
          />
          <Pressable onPress={handleBlur}>
            <AntDesign size={wp(5)} name="search1" color={'#808080'} />
          </Pressable>
        </ReAnimated.View>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={({
          nativeEvent: {
            contentOffset: {y},
          },
        }) => scrollY.setValue(y)}>
        <View
          style={[styles.search_container, activeInput && {marginTop: hp(5)}]}>
          {!activeInput && (
            <View style={{flexDirection: 'row', gap: wp(10)}}>
              <Text style={styles.search_hedding}>
                {'Listen The\nLatest Musics'}
              </Text>
              <Pressable
                style={styles.search_box_container}
                onPress={handleeClickSearchIcon}>
                <AntDesign size={wp(7)} name="search1" color={'#808080'} />
              </Pressable>
            </View>
          )}
        </View>
        {rececntSongs.length >= 3 && (
          <>
            <Text style={styles.hedding_2}>Recently Played</Text>
            <View style={{height: responsiveui(0.4)}}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingLeft: responsiveui(0.05)}} // Optional, for some padding on the sides
                data={rececntSongs}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={({item, index}) => (
                  <HomeHoriZontalCard
                    loading={loading}
                    item={item}
                    index={index}
                  />
                )}
              />
            </View>
            <Text style={styles.hedding_3}>Recommended for you</Text>
          </>
        )}
        {loading
          ? Array.from({length: 5}).map((_, index) => (
              <SkeletonPlaceholder borderRadius={4} direction="left">
                <View
                  style={{
                    paddingLeft: responsiveui(0.05),
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: wp(4),
                  }}>
                  <View
                    style={{
                      width: responsiveui(0.28),
                      height: responsiveui(0.28),
                      marginRight: responsiveui(0.04),
                      borderRadius: wp(1),
                    }}
                  />
                  <View>
                    <View
                      style={{
                        width: wp(30),
                        height: wp(5),
                        marginBottom: wp(2),
                      }}></View>
                    <View
                      style={{
                        width: wp(50),
                        height: wp(5),
                        marginBottom: wp(2),
                      }}></View>
                    <View style={{width: wp(20), height: wp(5)}}></View>
                  </View>
                </View>
              </SkeletonPlaceholder>
            ))
          : songsDetails?.map((item, i) => {
              return (
                <HomeCard
                  onPress={handleeClick}
                  key={i}
                  item={item}
                  index={i}
                />
              );
            })}
      </ScrollView>
      <MinimisedContainer/>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.bagroundcolor,
    position: 'relative',
    paddingBottom: hp(4.5) + wp(4),
  },
  hedder: {
    position: 'absolute',
    elevation: 4,
    height: hp(15),
    top: 0,
    left: 0,
    zIndex: 10,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveui(0.05),
    backgroundColor: color.bagroundcolor,
  },
  recomonded_card_parent: {
    paddingLeft: responsiveui(0.05),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(4),
  },
  profid: {
    width: responsiveui(0.12),
    height: responsiveui(0.12),
    borderRadius: responsiveui(0.12) / 2,
  },
  hedder_center: {
    flex: 3,
    alignItems: 'flex-start',
    paddingLeft: responsiveui(0.025),
  },
  name_person: {
    color: color.textWhite,
    fontSize: responsiveui(0.055),
    fontFamily: 'Nunito-SemiBold',
  },
  hedder_discription: {
    fontSize: responsiveui(0.038),
    color: '#DEDEDE',
    fontFamily: 'Nunito-Regular',
  },
  search_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveui(0.05),
    marginTop: hp(15),
    marginBottom: wp(7.5),
  },
  search_hedding: {
    color: color.textWhite,
    fontSize: responsiveui(0.068),
    fontFamily: 'Nunito-SemiBold',
  },
  search_box_container: {
    width: responsiveui(0.385),
    flexDirection: 'row',
    alignItems: 'center',
  },
  search_icon: {
    width: wp(8),
    height: wp(8),
  },
  search_box: {
    marginLeft: responsiveui(0.055),
    fontSize: wp(6),
  },
  hedding_2: {
    color: color.textWhite,

    marginBottom: wp(4),
    paddingLeft: responsiveui(0.05),
    color: color.textWhite,
    fontSize: wp(6),
    fontFamily: 'Nunito-SemiBold',
  },
  hedding_3: {
    marginTop: wp(2.5),
    marginBottom: wp(4),
    paddingLeft: responsiveui(0.05),
    color: color.textWhite,
    fontSize: wp(6),
    fontFamily: 'Nunito-SemiBold',
  },
});
