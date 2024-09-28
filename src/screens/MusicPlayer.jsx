import _ from 'lodash';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  ScrollView,
  unstable_batchedUpdates,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useSafeArea} from 'react-native-safe-area-context';
import {hp, responsiveui, wp} from '../config/width_hight_config';
import {color} from '../config/style';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import BottomSheet from '../components/CustomBottomSheet';
import BottomSheetUi from '../components/BottomSheetUi';
import {Controls} from '../components/Controls';
import {CONTROLS} from '../config/control';
import TrackPlayer, {
  Capability,
  Event,
  State,
  useActiveTrack,
  useIsPlaying,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import {setCurrentTab} from '../config/redux/reducer';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Slider from '@react-native-community/slider';
import {useApiCalls} from '../config/useApiCalls';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import json from '../config/dummydata';
import {useQueue} from '../trackplayer/useQueur';
import LinearGradient from 'react-native-linear-gradient';
import {unknownTrackImageUri} from '../trackplayer/commonthumbnail';
import {usePlayerBackground} from '../trackplayer/usePlayerBackground';
import TextTicker from 'react-native-text-ticker';
import {useRoute} from '@react-navigation/native';
import {useSetupTrackPlayer} from '../trackplayer/useSetupTrackPlayer';
import {
  API_CRIDENTIOLS,
  BASE_URL,
  URL_WEBSOCKET,
} from '../config/apicridentiols';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AroowBack from 'react-native-vector-icons/Ionicons';
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {App2} from '../components/BottomSheet2';
import FastImage from 'react-native-fast-image';

const calculateInterpolatedOpacity = steps => {
  const parts = steps.toString()?.split('-');
  const opacityValue = parseFloat(parts[1]) / 50;
  if (Number.isNaN(opacityValue)) {
    return 0;
  }
  return opacityValue;
};

const MusicPlayer = ({navigation}) => {
  useSetupTrackPlayer({
    onLoad: () => {},
  });
  const route = useRoute();
  const [playbackState, setPlaybackState] = useState(State.None);

  const {loading, getAllsongs, getSong} = useApiCalls();
  const {playing} = useIsPlaying();
  const songProgressing = usePlaybackState();
  const animateLike = useRef(null);

  const scrollX = useRef(new Animated.Value(0)).current;
  const progress = useProgress();
  const dispatch = useDispatch();
  const state = useSelector(state => state.store.currentTab, shallowEqual);

  const insets = useSafeArea();
  const tabBarHeight = useRef(new Animated.Value(-insets.top - hp(2))).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const playBarOpacity = useRef(new Animated.Value(0)).current;
  const ref = useRef(null);
  const queueOffset = useRef(0);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTrack, setActiveTrack] = useState(null);
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState({
    like: false,
    id: null,
  });
  const thumbnailRef = useRef(null);
  const thumbnailWidth2 = useSharedValue(wp(90));
  const thumbnailHeight2 = useSharedValue(wp(90));
  const thumbnailX2 = useSharedValue(0);
  const thumbnailY2 = useSharedValue(50);
  const thumbnailScale = useSharedValue(1);
  const opacity = useSharedValue(1); // Initial opacity
  const opacity2 = useSharedValue(0); // Initial opacity

  const [songDetails, setSongDetails] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [thumbnailSize, setThumbnailSize] = useState({
    width: wp(90),
    height: hp(45),
  });

  const {activeQueueId, setActiveQueueId} = useQueue();
  const currentIndexRef = useRef(currentIndex);
  const isScrollingRef = useRef(false);

  const handleTrackSelect = async (selectedTrack, index, allsongs) => {
    try {
      const trackIndex = allsongs.findIndex(
        track => track.url === selectedTrack.url,
      );

      if (trackIndex === -1) return;

      const isChangingQueue = 'song' !== activeQueueId;

      if (isChangingQueue) {
        const beforeTracks = allsongs.slice(0, trackIndex);
        const afterTracks = allsongs.slice(trackIndex + 1);

        await TrackPlayer.add(selectedTrack);
        await TrackPlayer.add(afterTracks);
        await TrackPlayer.add(beforeTracks);

        queueOffset.current = trackIndex;
        setCurrentIndex(trackIndex);
        await TrackPlayer.play();

        setActiveQueueId('songs');
      } else {
        const nextTrackIndex =
          trackIndex - queueOffset.current < 0
            ? allsongs.length + trackIndex - queueOffset.current
            : trackIndex - queueOffset.current;

        await TrackPlayer.skip(nextTrackIndex);
        setCurrentIndex(nextTrackIndex);
        await TrackPlayer.play();
      }
      const currentTrack = await TrackPlayer.getTrack(trackIndex);
      setCurrentTrack(currentTrack); // Update the song details state here
    } catch (error) {}
  };

  const togglePlayBack = async () => {
    playing ? await TrackPlayer.pause() : await TrackPlayer.play();
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await TrackPlayer.getActiveTrack();

      const songs = await getAllsongs();
      console.log(songs?.data);

      if (songs?.status) {
        setCurrentIndex(0);
        if (!data) {
          const addBeseUrl = songs?.data?.map(item => ({
            ...item,
            url: BASE_URL + item?.url,
            artwork: BASE_URL + item?.artwork,
          }));

          await handleTrackSelect(addBeseUrl[0], 0, addBeseUrl);
        }
      }

      setSongDetails(songs?.data);
      const token = await AsyncStorage.getItem('user-data');

      const websocket = new WebSocket(
        `${URL_WEBSOCKET}?token=${JSON.parse(token)}`,
      );
      setWs(websocket);

      // When a message is received from the server
      websocket.onmessage = event => {
        if (event?.data?.split('=')[0] == 'id') {
          let id = event?.data?.split('=')[1]?.split('&')[0];
          let like = event?.data?.split('&')[1]?.split('=')[1];
          setMessages({
            like: JSON.parse(like),
            id,
          });
        } else {
          let like = event.data.split('=')[1].split('&')[0];
          let id = event.data.split('&')[1].split('=')[1];
          setMessages({
            like: JSON.parse(like),
            id,
          });
        }
      };
    };

    fetchData();

    const backHandlerListener = BackHandler.addEventListener(
      'hardwareBackPress',
      handleNavigateToBack,
    );

    return () => {
      backHandlerListener.remove();
    };
  }, []);

  useEffect(() => {
    if (route?.params) {
      var {slectedSong, selectedIndex} = route?.params;
    }
    (async () => {
      if (
        flatListRef.current !== null &&
        selectedIndex !== undefined &&
        songDetails.length > 0
      ) {
        await TrackPlayer.skip(selectedIndex);

        try {
          if (selectedIndex > 0) {
            const scrollToIndexDebounced = _.debounce(index => {
              flatListRef.current?.scrollToIndex({index, animated: true});
            }, 300);
            scrollToIndexDebounced(selectedIndex);
          } else {
          }
        } catch (error) {}

        setCurrentIndex(selectedIndex);
      } else {
        const scrollToIndexDebounced = _.debounce(index => {
          flatListRef.current?.scrollToIndex({index: 0, animated: true});
        }, 300);

        scrollToIndexDebounced(0);
        setCurrentIndex(0);
      }
    })();
  }, [flatListRef, route?.params, songDetails]);

  useEffect(() => {
    const trackChangeListener = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      async state => {
        if (state.index !== currentIndex) {
          setCurrentIndex(state.index);
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(`track?id=${state?.track?._id}`);
          }
          const token = await AsyncStorage.getItem('user-data');
          fetch(API_CRIDENTIOLS.GET_SONG + '?id=' + state?.track?._id, {
            headers: {
              Authorization: JSON.parse(token),
            },
          })
            .then(res => res.json())
            .then(res => {});
        }
      },
    );

    return () => {
      trackChangeListener.remove();
    };
  }, [currentIndex, songDetails, TrackPlayer, ws]);

  const onPress = useCallback(() => {
    const isActive = ref?.current?.isActive();
    if (isActive) {
      ref?.current?.scrollTo(0);
    } else {
      ref?.current?.scrollTo(hp(-97));
    }
  }, []);

  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  const handleNavigateToBack = () => {
    navigation.navigate('Home');
    dispatch(setCurrentTab(''));
    return true;
  };

  const handleNextPress = async () => {
    const nextIndex = currentIndex + 1; // Example logic for next index
    TrackPlayer.skip(nextIndex);
    setCurrentIndex(nextIndex);
  };

  const handlePreviousPress = async () => {
    const nextIndex = currentIndex - 1; // Example logic for next index
    TrackPlayer.skip(nextIndex);
    setCurrentIndex(nextIndex);
  };

  const handleeClick = index => {
    switch (index) {
      case 0:
        break;
      case 1:
        handlePreviousPress();
        break;
      case 2:
        togglePlayBack();
        break;
      case 3:
        handleNextPress();
        break;
      case 4:
        break;
      default:
        break;
    }
  };

  const handleLike = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      animateLike?.current?.play();
      ws.send(`like=${!messages?.like}&id=${currentTrack?._id}`);
    }
  };

  const scrollXx = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: value => {
      scrollXx.value = value.contentOffset.x;
    },
  });

  useEffect(() => {
    const index = Math.round(scrollXx.value / wp(100));
    if (index !== currentIndex) {
      isScrollingRef.current = true;
      TrackPlayer.skip(index);
      setCurrentIndex(index);
    }
  }, [scrollXx.value]);

  useEffect(() => {
    if (isScrollingRef.current) {
      isScrollingRef.current = false;
      return;
    }
    TrackPlayer.getTrack(currentIndex).then(res => {
      flatListRef?.current?.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
      setCurrentTrack(res);
      setActiveTrack(res);
    });
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const componentSize = wp(90);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: thumbnailScale.value},
        // {translateX: componentSize * ((thumbnailScale.value - 1) * 2.5)},
        {
          translateY: thumbnailY2.value,
        }, // Adjust up
      ],
    };
  });

  // starting time y 50 to -20
  const handleSlideToHeader = currentValue => {
    const minSlideValue = -651.84; // Fully open
    const maxSlideValue = -0.0226; // Fully closed

    let normalizedValue =
      (currentValue - minSlideValue) / (maxSlideValue - minSlideValue);
    const minScale = 0.5; // Minimum scale size
    const maxScale = 1; // Maximum scale size

    thumbnailScale.value =
      minScale +
      normalizedValue *
        (maxScale - minScale);

    // thumbnailY2.value = minScaley + normalizedValue * (maxScaley - minScaley);
  };

  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  const animatedStyle3 = useAnimatedStyle(() => {
    return {
      opacity: opacity2.value,
    };
  });

  return (
    <LinearGradient
      colors={activeTrack?.colors ?? [color.bluecolor, color.bagroundcolor]}
      style={[styles.safeArea]}>
      <GestureHandlerRootView
        style={{
          flex: 1,
          width: wp(100),
        }}>
        <TapGestureHandler
          numberOfTaps={2}
          onActivated={() => !ref?.current?.isActive() && handleLike()}>
          <View style={{position: 'relative'}}>
            <View
              style={{
                marginTop: hp(5),
                paddingHorizontal: responsiveui(0.05),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                width: '100%',
                position: 'absolute',
                zIndex: -1,
                top: 0,
              }}>
              <Pressable onPress={handleNavigateToBack}>
                <AroowBack
                  name="arrow-back"
                  color={color.textWhite}
                  size={wp(7)}
                />
              </Pressable>
              {loading ? (
                <SkeletonPlaceholder borderRadius={4} direction="left">
                  <View
                    style={{
                      width: wp(80),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View style={{width: wp(50), height: wp(5)}}></View>
                  </View>
                </SkeletonPlaceholder>
              ) : (
                <Text style={styles.main_hedding}>Ophelia by Steven</Text>
              )}
              <Reanimated.View style={[animatedStyle2]}>
                <TouchableOpacity onPress={() => handleLike()}>
                  <AntDesign
                    size={wp(7)}
                    color={
                      messages?.like == true &&
                      messages?.id == currentTrack?._id
                        ? color.bluecolor
                        : color.textWhite
                    }
                    name={
                      messages?.like == true &&
                      messages?.id == currentTrack?._id
                        ? 'heart'
                        : 'hearto'
                    }
                  />
                </TouchableOpacity>
              </Reanimated.View>

              <Reanimated.View
                style={[
                  {
                    position: 'absolute',
                    right: responsiveui(0.05),
                    top: 0,
                  },
                  animatedStyle3,
                ]}>
                <Pressable onPress={() => handleeClick(2)}>
                  {songProgressing.state === State.Playing ? (
                    <Icon name="pause" color={color.textWhite} size={wp(8)} />
                  ) : (
                    <Entypo
                      name="controller-play"
                      color={color.textWhite}
                      size={wp(8)}
                    />
                  )}
                </Pressable>
              </Reanimated.View>
            </View>

            <View
              style={{
                width: '100%',
              }}>
              {loading ? (
                <>
                  <SkeletonPlaceholder borderRadius={4}>
                    <View style={styles.thumbnail_container}>
                      <Image
                        resizeMode="cover"
                        source={require('../img/unknown_track.png')}
                        style={styles.thumbnail}
                      />
                    </View>
                  </SkeletonPlaceholder>
                  <SkeletonPlaceholder borderRadius={4} direction="left">
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: wp(100),
                        marginBottom: 20,
                        flexDirection: 'column',
                      }}>
                      <View
                        style={{
                          width: wp(40),
                          height: wp(5),
                          marginBottom: wp(3),
                        }}></View>
                      <View style={{width: wp(50), height: wp(5)}}></View>
                    </View>
                  </SkeletonPlaceholder>
                </>
              ) : (
                songDetails?.length > 0 && (
                  <Reanimated.FlatList
                    horizontal
                    pagingEnabled
                    ref={flatListRef}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    data={songDetails}
                    getItemLayout={(data, index) => ({
                      length: responsiveui(1),
                      offset: responsiveui(1) * index,
                      index,
                    })}
                    renderItem={({item, index}) => (
                      <View style={[styles.thumbnail_container]}>
                        <Reanimated.View
                          style={[
                            animatedStyle,
                            {width: wp(90), height: wp(90)},
                          ]}>
                          <FastImage
                            resizeMode={FastImage.resizeMode.cover}
                            source={
                              item?.artwork
                                ? {
                                    uri: BASE_URL + item?.artwork,
                                    priority: FastImage.priority.normal,
                                  }
                                : require('../img/unknown_track.png')
                            }
                            style={{
                              width: '100%',
                              height: '100%',
                              overflow: 'hidden',
                              borderRadius: wp(2),
                            }}
                          />
                        </Reanimated.View>
                        <View style={{marginTop: hp(7)}}>
                          <TextTicker
                            style={styles.song_hedding}
                            duration={10000}
                            loop
                            bounce>
                            {item?.title}
                          </TextTicker>
                          <Text style={styles.singer}>
                            {item?.artist || 'Unknown'}
                          </Text>
                        </View>
                      </View>
                    )}
                  />
                )
              )}
            </View>
            {/* {loading ? (
              <SkeletonPlaceholder
                speed={400}
                backgroundColor="#00000086"
                borderRadius={4}
                direction="right">
                <View
                  style={{
                    height: wp(0.4),
                    marginBottom: wp(6),
                    marginHorizontal: wp(5),
                    marginTop: wp(2),
                  }}
                />
              </SkeletonPlaceholder>
            ) :  */}
            {/* ( */}
            <Slider
              style={styles.progressbar}
              value={progress.position}
              minimumValue={0}
              maximumValue={progress.duration}
              thumbTintColor="#fff"
              minimumTrackTintColor={'#fff'}
              // maximumTrackTintColor='#000'
              onSlidingComplete={async value => {
                await TrackPlayer.seekTo(value);
              }}
            />
            {/* )} */}
            {loading ? (
              <SkeletonPlaceholder borderRadius={4} direction="left">
                <View style={styles.song_length_container}>
                  <View style={{width: wp(20), height: wp(5)}}></View>
                  <View style={{width: wp(20), height: wp(5)}}></View>
                </View>
              </SkeletonPlaceholder>
            ) : (
              <View style={styles.song_length_container}>
                <Text style={styles.song_corrent}>
                  {new Date(progress.position * 1000)
                    .toISOString()
                    .substr(14, 5)}
                </Text>
                <Text style={styles.song_corrent}>
                  {new Date((progress.duration - progress.position) * 1000)
                    .toISOString()
                    .substr(14, 5)}
                </Text>
              </View>
            )}

            <LottieView
              ref={animateLike}
              loop={false}
              style={{
                position: 'absolute',
                zIndex: 1,
                left: wp(25),
                top: hp(25),
                height: wp(50),
                width: wp(50),
              }}
              source={require('./../img/animatedlike.json')}
            />

            <View style={styles.controls}>
              <Icon name="shuffle" color={color.textWhite} size={wp(7)} />
              <Pressable onPress={() => handleeClick(1)}>
                <Icon name="skip-back" color={color.textWhite} size={wp(7)} />
              </Pressable>

              <Pressable
                onPress={() => handleeClick(2)}
                style={{
                  backgroundColor: color.bluecolor,

                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: wp(3),
                  borderRadius: wp(15),
                }}>
                {songProgressing.state === State.Playing ? (
                  <Icon name="pause" color={color.textWhite} size={wp(14)} />
                ) : (
                  <Entypo
                    name="controller-play"
                    color={color.textWhite}
                    size={wp(14)}
                    style={{
                      marginLeft: wp(1), // Adjust the margin slightly to center align
                    }}
                  />
                )}
              </Pressable>
              <Pressable onPress={() => handleeClick(3)}>
                <Icon
                  name="skip-forward"
                  color={color.textWhite}
                  size={wp(7)}
                />
              </Pressable>
              <Icon name="repeat" color={color.textWhite} size={wp(7)} />
            </View>
            {state === 'MusicPlayer' && (
              <TouchableOpacity
                style={styles.bottm_container}
                onPress={onPress}>
                <Text style={styles.bottm_text}>RECENT SONGS</Text>
              </TouchableOpacity>
            )}
            <View style={styles.container}>
              <BottomSheet ref={ref} currentPosition={handleSlideToHeader}>
                <LinearGradient
                  colors={
                    activeTrack?.colors ?? [
                      color.bluecolor,
                      color.bagroundcolor,
                    ]
                  }
                  style={{flex: 1, backgroundColor: color.bagroundcolor}}>
                  <View
                    style={{
                      borderTopColor: color.textWhite,
                      borderTopWidth: 1,
                      width: isNaN(
                        (progress.position / progress?.duration) * wp(100),
                      )
                        ? wp(0)
                        : (progress.position / progress?.duration) * wp(100),

                      marginBottom: wp(3),
                    }}
                  />
                  <Text
                    style={[
                      styles.bottm_text,
                      {
                        color: color.textWhite,
                        textAlign: 'center',
                        marginBottom: wp(5),
                      },
                    ]}>
                    RECENT SONGS
                  </Text>

                  {songDetails?.map((item, index) => (
                    <BottomSheetUi
                      key={index}
                      title={item?.title}
                      img={item?.artwork}
                      artist={item?.artist}
                      Playing={
                        songProgressing.state === State.Playing ? true : false
                      }
                      index={index}
                      activeTrack={currentIndex}
                      onSelect={async () => await TrackPlayer.skip(index)}
                      onPlay={() => handleeClick(2)}
                    />
                  ))}
                </LinearGradient>
              </BottomSheet>
            </View>
          </View>
        </TapGestureHandler>
      </GestureHandlerRootView>
    </LinearGradient>
  );
};

export default MusicPlayer;

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: hp(2),
    flex: 1,
    backgroundColor: color.bagroundcolor,
    paddingBottom: hp(4.5) + wp(4),
  },
  hedder_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveui(0.05),
    paddingTop: responsiveui(0.05),
  },
  main_hedding: {
    color: 'white',
    fontSize: responsiveui(0.05),
    fontFamily: 'Nunito-Bold',
  },
  thumbnail_container: {
    width: responsiveui(1),
    paddingHorizontal: responsiveui(0.05),
    marginTop: responsiveui(0.1),
    alignItems: 'center',
    marginBottom: hp(2),
    position: 'relative',
    zIndex: 1000,
  },
  thumbnail: {
    // width: wp(90),
    // height: hp(45),
    elevation: 5,
    borderRadius: wp(1),
  },
  song_hedding: {
    color: color.textWhite,
    marginTop: wp(3),
    fontSize: wp(8),
    fontFamily: 'Nunito-Bold',
  },
  singer: {
    color: color.textdarckgrey,
    textAlign: 'center',
    marginTop: responsiveui(0.001),
    fontSize: wp(4),
    fontFamily: 'Nunito-Regular',
  },
  progressbar: {
    marginHorizontal: wp(2.5),
    // marginBottom: wp(2),
    marginTop: wp(-2),
    height: hp(5),
    backgroundColor: 'transparent',
    borderRadius: 25,
  },
  song_length_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveui(0.05),
  },
  song_corrent: {
    color: color.textWhite,
    fontSize: responsiveui(0.04),
    fontFamily: 'Nunito-SemiBold',
  },
  controls: {
    marginVertical: wp(0.5),
    paddingHorizontal: responsiveui(0.05),
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: responsiveui(0.25),
    alignItems: 'center',
  },
  play_pause: {
    backgroundColor: color.bluecolor,
    elevation: 10,
    width: responsiveui(0.18),
    height: responsiveui(0.18),
    borderRadius: responsiveui(0.2) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer_container: {
    width: '100%',
    alignItems: 'center',
  },
  footer_text: {
    color: color.textWhite,
    fontFamily: 'Nunito-SemiBold',
    fontSize: responsiveui(0.05),
  },
  footer_line: {
    opacity: 0.2,
    backgroundColor: color.textdarckgrey,
    marginTop: responsiveui(0.02),
    width: '50%',
    height: 3,
    borderRadius: 1.5,
  },
  modal_hedding: {
    textAlign: 'center',
    backgroundColor: color.modal_baground,
    color: color.textWhite,
    fontFamily: 'Nunito-SemiBold',
    fontSize: responsiveui(0.05),
  },
  modal_line: {
    backgroundColor: color.textdarckgrey,
    height: 2,
    borderRadius: 1,
    marginHorizontal: responsiveui(0.1),
    marginVertical: responsiveui(0.05),
  },
  contentContainer: {
    flex: 1,
  },
  active_bottomsheet_hedder: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left_thumbnail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  left_thumbnail_image: {
    width: responsiveui(0.15),
    height: responsiveui(0.15),
  },
  left_content: {
    paddingLeft: responsiveui(0.03),
  },
  left_hedding: {
    color: color.textWhite,
    fontFamily: 'Nunito-SemiBold',
    fontSize: responsiveui(0.04),
  },
  left_discriptions: {
    color: color.textdarckgrey,
    fontFamily: 'Nunito-SemiBold',
    fontSize: responsiveui(0.035),
  },
  playicon: {
    width: responsiveui(0.05),
    height: responsiveui(0.05),
  },
  closeButtonContainer: {
    alignItems: 'center',
    marginVertical: responsiveui(0.02),
  },
  closeButtonText: {
    color: color.textWhite,
    fontFamily: 'Nunito-SemiBold',
    fontSize: responsiveui(0.05),
  },
  bottm_container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: wp(5),
  },
  bottm_text: {
    color: color.textdarckgrey,
    fontFamily: 'Nunito-Bold',
    fontSize: wp(5),
  },
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -20,
    position: 'absolute',
    width: wp(100),
  },
  button: {
    height: 10,
    borderRadius: 25,
    aspectRatio: 1,
    backgroundColor: 'white',
    opacity: 0.6,
  },
});
