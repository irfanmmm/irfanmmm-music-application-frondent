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
  BackHandler,
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
import {MinimisedContainer} from '../components/MinimisedContainer';
import {BlurView} from '@react-native-community/blur';
import TrackPlayer, {useActiveTrack} from 'react-native-track-player';
import {Bell, Search} from 'react-native-feather';

const Home = ({navigation}) => {
  useSetupTrackPlayer({
    onLoad: () => {},
  });
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const activeTrack = useActiveTrack();

  const {getProfileDetails, loading, getAllsongs, recentsongs} = useApiCalls();

  const [isBluer, setIsBlure] = useState(false);

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
  const [searchSongsDetails, setSearchSongDetails] = useState([]);
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

    BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress');
    };
  }, []);

  const handleeClick = (item, index) => {
    navigation.navigate('MusicPlayer', {
      slectedSong: item,
      selectedIndex: index,
    });
  };
  const inputWidth = useSharedValue(wp(60));
  const inputY = useSharedValue(wp(0));

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
      }),
    };
  });

  const handleeClickSearchIcon = () => {
    setActiveInput(true);
    inputWidth.value = wp(90);
    inputY.value = wp(10);
  };

  const handleBlur = () => {
    setActiveInput(false);
    inputWidth.value = wp(60);
    inputY.value = wp(10);
  };

  const handleSearchInput = text => {
    const searchTerm = text.trim().toLowerCase();
    const searchItems = songsDetails?.filter(item => {
      return (
        item?.title?.toLowerCase()?.includes(searchTerm) ||
        item?.artist?.includes(text)
      );
    });

    setSearchSongDetails(searchItems);
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
        <Bell
          stroke={color.textWhite}
          width={wp(7)}
          height={wp(7)}
          strokeWidth={1.5}
        />
      </Animated.View>
      {activeInput && (
        <ReAnimated.View
          style={[
            animatedInputStyle,
            {
              backgroundColor: color.bagroundcolor,
              zIndex: 50,
              left: wp(5),
              elevation: 100,
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
            style={{
              width: wp(60),
              color: color.textWhite,
              fontSize: wp(5),
              fontFamily: 'Nunito-Bold',
            }}
            maxLength={150}
            placeholder="Search Latest Songs"
            placeholderTextColor={color.textMuted}
            onBlur={handleBlur}
            autoFocus={true}
            onChangeText={handleSearchInput}
          />
          <Pressable onPress={handleBlur}>
            <Search
              stroke={color.textMuted}
              width={wp(7)}
              height={wp(7)}
              strokeWidth={1}
            />
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
                contentContainerStyle={{paddingLeft: responsiveui(0.05)}}
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
          : [...searchSongsDetails, ...songsDetails]?.map((item, i) => {
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
      {activeTrack && (
        <MinimisedContainer
          onBlurScreen={blure => {
            setIsBlure(blure);
          }}
        />
      )}
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
