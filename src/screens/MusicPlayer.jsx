import throttle from 'lodash.throttle';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  BackHandler,
  Dimensions,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useSafeArea} from 'react-native-safe-area-context';
import {hp, responsiveui, wp} from '../config/width_hight_config';
import {color} from '../config/style';
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import BottomSheet, {MAX_TRANSLATE_Y} from '../components/CustomBottomSheet';
import BottomSheetUi from '../components/BottomSheetUi';
import TrackPlayer, {
  Event,
  State,
  useIsPlaying,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import {setCurrentTab} from '../config/redux/reducer';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Slider from '@react-native-community/slider';
import {useApiCalls} from '../config/useApiCalls';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useQueue} from '../trackplayer/useQueur';
import LinearGradient from 'react-native-linear-gradient';
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
import Reanimated, {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import {capitalizeFirstLetter} from '../config/capitalizeString';
import {
  ArrowLeft,
  Heart,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'react-native-feather';

let lastIndex = -1;
const MusicPlayer = ({navigation}) => {
  useSetupTrackPlayer({
    onLoad: () => {},
  });
  const route = useRoute();

  const {loading, getAllsongs, getSong} = useApiCalls();
  const {playing} = useIsPlaying();

  const songProgressing = usePlaybackState();
  const animateLike = useRef(null);
  const progress = useProgress();
  const dispatch = useDispatch();
  const state = useSelector(state => state.store.currentTab, shallowEqual);

  const insets = useSafeArea();
  const ref = useRef(null);
  const queueOffset = useRef(0);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTrack, setActiveTrack] = useState(null);
  const [ifClickNextOrPrev, setIfClickNextOrPrev] = useState(false);
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState({
    like: false,
    id: null,
  });
  const thumbnailY2 = useSharedValue(0);
  const thumbnailScale = useSharedValue(1);
  const opacity = useSharedValue(1); // Initial opacity
  const opacity2 = useSharedValue(0); // Initial opacity

  const [songDetails, setSongDetails] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);

  const {activeQueueId, setActiveQueueId} = useQueue();
  const currentIndexRef = useRef(currentIndex);
  const isScrollingRef = useRef(false);

  const handleTrackSelect = async allsongs => {
    await TrackPlayer.reset();
    await TrackPlayer.add(allsongs);
  };

  const togglePlayBack = async () => {
    playing ? await TrackPlayer.pause() : await TrackPlayer.play();
  };

  // const handleScrollToIndex = (index, type = 'defult') => {
  //   if (type === 'defult') {
  //     flatListRef?.current?.scrollToIndex({
  //       index,
  //       animated: true,
  //     });
  //     setTimeout(async () => {
  //       await TrackPlayer.skip(index);
  //       await TrackPlayer.play();
  //       setCurrentTrack(index);
  //     }, 1000);
  //   } else {
  //     setTimeout(async () => {
  //       await TrackPlayer.skip(index);
  //       await TrackPlayer.play();
  //       setCurrentTrack(index);
  //     }, 2000);
  //   }
  // };

  const handleScrollToIndex = useRef(
    throttle(async (index, type = 'default') => {
      if (lastIndex !== index) {
        console.log('hellow======');
        lastIndex = index;
        if (type === 'default') {
          setTimeout(() => {
            flatListRef?.current?.scrollToIndex({
              index,
              animated: true,
            });
          }, 1000);
          await TrackPlayer.skip(index);
          await TrackPlayer.play();
          setCurrentTrack(index);
        } else {
          await TrackPlayer.skip(index);
          await TrackPlayer.play();
          setCurrentTrack(index);
        }
      }
    }, 500),
  ).current;

  useEffect(() => {
    var {slectedSong, selectedIndex} = route?.params;

    const fetchData = async () => {
      const data = await TrackPlayer.getActiveTrack();
      const songs = await getAllsongs();

      if (songs?.status) {
        const addBeseUrl = songs?.data?.map(item => ({
          ...item,
          url: BASE_URL + item?.url,
          artwork: BASE_URL + item?.artwork,
        }));
        await handleTrackSelect(addBeseUrl);
        if (selectedIndex) {
          handleScrollToIndex(selectedIndex);
          isScrollingRef.current = true;
        } else {
          handleScrollToIndex(0);
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
    // if (!isScrollingRef.current) {
    // }

    fetchData();

    const backHandlerListener = BackHandler.addEventListener(
      'hardwareBackPress',
      handleNavigateToBack,
    );

    return () => {
      backHandlerListener.remove();
    };
  }, [isScrollingRef]);

  useEffect(() => {
    const trackChangeListener = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      async state => {
        if (state.index !== currentIndex) {
          // setCurrentIndex(state.index);
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
    if (currentTrack === songDetails?.length - 1) return;
    flatListRef?.current?.scrollToIndex({
      index: currentTrack + 1,
      animated: true,
    });
  };

  const handlePreviousPress = async () => {
    if (currentTrack === 0) return;
    flatListRef?.current?.scrollToIndex({
      index: currentTrack - 1,
      animated: true,
    });
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
  const container = wp(90);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: value => {
      scrollXx.value = value.contentOffset.x;
      const index = Math.floor(value.contentOffset.x / container);
      if (lastIndex !== index) {
        // Only call handleScrollToIndex if the index has changed
        runOnJS(handleScrollToIndex)(index, 'scroll');
      }
    },
  });

  useEffect(() => {
    TrackPlayer.getActiveTrack().then(track => {
      console.log(track);

      setActiveTrack(track.colors);
    });
  }, [currentTrack]);

  const startTranslateY = -wp(15); // -90px + 0.5 (90px - (-90px))
  const endTranslateY = wp(15);
  const animatedStyle = useAnimatedStyle(() => {
    const adjustedTranslateY =
      startTranslateY +
      thumbnailScale.value * (endTranslateY - startTranslateY);

    return {
      transform: [
        {
          scale: thumbnailScale.value,
        },
        {
          translateY: adjustedTranslateY,
        },
      ],
    };
  });

  // starting time y 50 to -20
  const handleSlideToHeader = currentValue => {
    const minSlideValue = MAX_TRANSLATE_Y; // Fully open
    const maxSlideValue = 0; // Fully closed

    let normalizedValue =
      (currentValue - minSlideValue) / (maxSlideValue - minSlideValue); // 0.38
    const minScale = 0.15; // Minimum scale size
    const maxScale = 1; // Maximum scale size

    thumbnailScale.value = minScale + normalizedValue * (maxScale - minScale); //  0.44
  };

  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      opacity: thumbnailScale.value * thumbnailScale.value,
    };
  });
  const animatedStyle3 = useAnimatedStyle(() => {
    return {
      opacity: 1 - thumbnailScale.value,
    };
  });

  return (
    <LinearGradient
      colors={activeTrack ?? [color.bluecolor, color.bagroundcolor]}
      style={[styles.safeArea]}>
      <GestureHandlerRootView
        style={{
          flex: 1,
          width: wp(100),
        }}>
        <Reanimated.View
          style={[
            {
              width: wp(100) - (wp(90) * 0.15 + responsiveui(0.12)),
              position: 'absolute',
              top: -hp(1),
              marginTop: insets.top === 0 ? hp(5) : insets.top + hp(2),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',

              left: wp(90) * 0.15 + responsiveui(0.08),
              // backgroundColor: 'red',
              // height: wp(10),
            },
            animatedStyle3,
          ]}>
          <View style={{maxWidth: wp(70)}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: color.textWhite,
                fontFamily: 'Nunito-ExtraBold',
                fontSize: responsiveui(0.045),
              }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: color.textdarckgrey,
                fontFamily: 'Nunito-Medium',
                fontSize: responsiveui(0.04),
              }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </Text>
          </View>
          {songProgressing.state === State.Playing ? (
            <Pause
              stroke={color.textWhite}
              width={wp(7)}
              height={wp(7)}
              strokeWidth={1.5}
              // fill={color.textWhite}
            />
          ) : (
            <Play
              stroke={color.textWhite}
              width={wp(7)}
              height={wp(7)}
              fill={color.textWhite}
              strokeWidth={1}
              style={{
                marginLeft: wp(1),
              }}
            />
          )}
        </Reanimated.View>
        <Reanimated.View
          style={[
            {
              marginTop: insets.top === 0 ? hp(5) : insets.top + hp(2),
              paddingHorizontal: responsiveui(0.05),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              position: 'absolute',
              zIndex: -1,
              top: 0,
            },
            animatedStyle2,
          ]}>
          <Pressable onPress={handleNavigateToBack}>
            <ArrowLeft
              stroke={color.textWhite}
              width={wp(7)}
              height={wp(7)}
              strokeWidth={1.5}
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
          <TouchableOpacity onPress={() => handleLike()}>
            <Heart
              stroke={
                messages?.like == true && messages?.id == currentTrack?._id
                  ? color.bluecolor
                  : color.textWhite
              }
              fill={messages?.like == true ? color.bluecolor : 'transparent'}
              width={wp(7)}
              height={wp(7)}
              strokeWidth={1.5}
            />
          </TouchableOpacity>
        </Reanimated.View>

        <View
          style={{
            width: '100%',
          }}>
          {loading && (
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
          )}
          {!loading && songDetails?.length > 0 ? (
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
                <TapGestureHandler
                  numberOfTaps={2}
                  onActivated={() => !ref?.current?.isActive() && handleLike()}>
                  <View style={[styles.thumbnail_container]} key={index}>
                    <Reanimated.View
                      style={[
                        animatedStyle,
                        {
                          transform: [
                            {
                              translateY: wp(15),
                            },
                          ],
                          // marginTop: wp(10),
                          width: wp(90),
                          height: wp(90),
                          transformOrigin: 'top left',
                        },
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
                        {capitalizeFirstLetter(item?.title)}
                      </TextTicker>
                      <Text style={styles.singer}>
                        {item?.artist || 'Unknown'}
                      </Text>
                    </View>
                  </View>
                </TapGestureHandler>
              )}
            />
          ) : (
            <SkeletonPlaceholder borderRadius={4} direction="left">
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View style={{width: wp(90), height: wp(90)}} />
              </View>
            </SkeletonPlaceholder>
          )}
        </View>
        <Slider
          style={styles.progressbar}
          value={progress.position}
          minimumValue={0}
          maximumValue={progress.duration}
          thumbTintColor="#fff"
          minimumTrackTintColor={'#fff'}
          onSlidingComplete={async value => {
            await TrackPlayer.seekTo(value);
          }}
        />
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
              {new Date(progress.position * 1000).toISOString().substr(14, 5)}
            </Text>
            <Text style={styles.song_corrent}>
              {new Date(progress.duration * 1000).toISOString().substr(14, 5)}
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
          <Shuffle
            stroke={color.textWhite}
            width={wp(7)}
            height={wp(7)}
            strokeWidth={1.5}
          />
          <Pressable onPress={() => handleeClick(1)}>
            <SkipBack
              stroke={currentIndex === 0 ? color.textMuted : color.textWhite}
              width={wp(7)}
              height={wp(7)}
              strokeWidth={1.5}
            />
          </Pressable>

          <Pressable
            onPress={() => handleeClick(2)}
            style={{
              backgroundColor: color.textWhite,
              justifyContent: 'center',
              alignItems: 'center',
              // padding: wp(3),
              width: wp(15),
              height: wp(15),
              borderRadius: wp(15),
            }}>
            {songProgressing.state === State.Playing ? (
              <Pause
                stroke={color.background}
                width={wp(10)}
                height={wp(10)}
                strokeWidth={1.5}
                // fill={color.background}
              />
            ) : (
              <Play
                stroke={color.background}
                width={wp(10)}
                height={wp(10)}
                fill={color.background}
                strokeWidth={1}
                style={{
                  marginLeft: wp(1),
                }}
              />
            )}
          </Pressable>
          <Pressable onPress={() => handleeClick(3)}>
            <SkipForward
              stroke={
                songDetails.length - 1 === currentIndex
                  ? color.textMuted
                  : color.textWhite
              }
              width={wp(7)}
              height={wp(7)}
              strokeWidth={1.5}
            />
          </Pressable>
          <Repeat
            stroke={color.textWhite}
            width={wp(7)}
            height={wp(7)}
            strokeWidth={1.5}
          />
        </View>
        {state === 'MusicPlayer' && (
          <TouchableOpacity style={styles.bottm_container} onPress={onPress}>
            <Text style={styles.bottm_text}>RECENT SONGS</Text>
          </TouchableOpacity>
        )}
        <View style={styles.container}>
          <BottomSheet ref={ref} currentPosition={handleSlideToHeader}>
            <LinearGradient
              colors={
                activeTrack?.colors ?? [color.bluecolor, color.bagroundcolor]
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
                    marginBottom: wp(2),
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
                  onSelect={async () => {
                    await TrackPlayer.skip(index);
                    isScrollingRef.current = true;
                  }}
                  onPlay={() => handleeClick(2)}
                />
              ))}
            </LinearGradient>
          </BottomSheet>
        </View>
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
    fontSize: wp(4.5),
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
