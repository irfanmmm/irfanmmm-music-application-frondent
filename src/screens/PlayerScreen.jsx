import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {color} from '../styles/style';
import {hp, responsiveui, wp} from '../styles/responsive';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Reanimated from 'react-native-reanimated';
import {ArrowLeft, ChevronUp, Heart} from 'react-native-feather';
import {useQueue} from '../trackplayer/useQueur';
import {
  Gesture,
  GestureDetector,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import {capitalizeFirstLetter} from '../config/capitalizeString';
import LottieView from 'lottie-react-native';
import {MusicCountroller} from '../components/MusicCountroller';
import {MAX_TRANSLATE_Y} from '../components/CustomBottomSheet';
import TrackPlayer, {
  Event,
  useIsPlaying,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {BottomSheetList} from '../components/BottomSheetList/BottomSheetList';
import {PlayButton} from '../components/playButtons/PlayButtons';
import {useSafeArea} from 'react-native-safe-area-context';
import {useApiCalls} from '../hooks/useApiCalls';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const PlayerScreen = () => {
  const {likesong, likedSongs} = useApiCalls();
  const [activeIndex, setActiveIndex] = useState(0);
  const [like, setLike] = useState(false);
  const insets = useSafeArea();
  const navigation = useNavigation();
  const animateLike = useRef(null);
  const flatListRef = useRef(null);
  const isButtonPress = useRef(false);
  const {queelists, setQueelist} = useQueue();
  const startTranslateY = -wp(15);
  const endTranslateY = wp(15);
  const isFocused = useIsFocused();
  const playbackstate = useIsPlaying();

  useEffect(() => {
    (async () => {
      const likedMusics = await likedSongs();
      const currentTrack = await TrackPlayer.getActiveTrack();
      setLike(likedMusics.some(song => song?._id === currentTrack?._id));
    })().catch(err => console.error('Error in useEffect:', err));
  }, [activeIndex]);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async () => {
    if (!isFocused) {
      const currentQuee = await TrackPlayer.getQueue();
      setQueelist(currentQuee);
    }

    const newTrackIndex = await TrackPlayer.getCurrentTrack();
    if (newTrackIndex !== null && newTrackIndex !== activeIndex) {
      isButtonPress.current = true;

      let diffrence = newTrackIndex - activeIndex;

      if (diffrence === 1 || diffrence === -1) {
        flatListRef?.current?.scrollToIndex({
          index: newTrackIndex,
          animated: true,
        });
        setActiveIndex(newTrackIndex);
      } else {
        await TrackPlayer.move(newTrackIndex, 0);
        const newQueelist = await TrackPlayer.getQueue();
        setQueelist(newQueelist);
        if (activeIndex !== 0) {
          flatListRef?.current?.scrollToIndex({
            index: 0,
            animated: true,
          });
        }
        setActiveIndex(0);
      }
      await TrackPlayer.play();
    }
  });

  const handleViewableItemsChanged = useCallback(({viewableItems}) => {
    if (isButtonPress.current) {
      isButtonPress.current = false;
      return;
    }
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
        TrackPlayer.skip(newIndex);
      }
    }
  }, []);

  const onLikActive = async () => {
    setLike(!like);
    if (!like) {
      animateLike.current?.play();
    }
    const newTrackIndex = await TrackPlayer.getActiveTrack();
    await likesong(newTrackIndex?._id, !like);
  };
  const context = useSharedValue({y: 0});
  const translateY = useSharedValue(0);

  const maxtY = hp(-97);
  const onOpenBottomSheet = useCallback(() => {
    translateY.value = withSpring(maxtY, {
      damping: 20,
    });
  }, []);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {y: translateY.value};
    })
    .onUpdate(event => {
      const newTranslateY = event.translationY + context.value.y;
      const currentValue = Math.min(
        Math.max(newTranslateY, MAX_TRANSLATE_Y),
        0,
      );
      translateY.value = currentValue;
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 3) {
        translateY.value = withSpring(0, {
          damping: 20,
        });
      } else {
        translateY.value = withSpring(MAX_TRANSLATE_Y, {
          damping: 20,
        });
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolation.CLAMP,
    );

    return {
      borderRadius,
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateY.value,
      [0, MAX_TRANSLATE_Y],
      [1, 0.15],
      Extrapolation.IDENTITY,
    );

    const adjustedTranslateY = interpolate(
      translateY.value,
      [0, MAX_TRANSLATE_Y],
      [endTranslateY, startTranslateY],
      Extrapolation.IDENTITY,
    );

    return {
      transform: [
        {
          scale: scale,
        },
        {
          translateY: adjustedTranslateY,
        },
      ],
    };
  });

  const togglePlay = async () => {
    if (playbackstate.playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const headderanimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, MAX_TRANSLATE_Y],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity: opacity,
      display: Math.round(opacity) === 0 ? 'none' : 'flex',
    };
  });

  const headderanimatedStyle2 = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, MAX_TRANSLATE_Y],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return {
      opacity: opacity,
      display: Math.round(opacity) === 0 ? 'none' : 'flex',
    };
  });

  if (!queelists)
    return (
      <View style={styles.loadingcontainer}>
        <ActivityIndicator size={'large'} color={color.textWhite} />
      </View>
    );

  return (
    <LinearGradient
      colors={
        queelists[activeIndex]?.colors?.length > 0
          ? queelists[activeIndex]?.colors
          : [color.bagroundcolor, color.bottomsheet_color]
      }
      style={styles.container}>
      <View>
        {/* Headder Component */}

        <View
          style={{
            flex: 1,
          }}>
          <Reanimated.View
            style={[
              styles.animatedContainer,
              headderanimatedStyle,
              {
                marginTop: insets.top === 0 ? hp(5) : insets.top + hp(2),
              },
            ]}>
            <View style={styles.headderParent}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.headderTextTitle}>
                {capitalizeFirstLetter(queelists[activeIndex]?.title)}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.headderText}>
                {queelists[activeIndex]?.artist || 'Unknown'}
              </Text>
            </View>
            <Pressable onPress={togglePlay}>
              <PlayButton />
            </Pressable>
          </Reanimated.View>

          <Reanimated.View
            style={[
              styles.animatedContainer2,
              headderanimatedStyle2,
              {
                marginTop: insets.top === 0 ? hp(5) : insets.top + hp(2),
              },
            ]}>
            <Pressable onPress={() => navigation.goBack()}>
              <ArrowLeft
                stroke={color.textWhite}
                width={wp(7)}
                height={wp(7)}
                strokeWidth={1.5}
              />
            </Pressable>
            <Text
              style={styles.headderTextTitle}
              numberOfLines={1}
              ellipsizeMode="tail">
              {queelists[activeIndex]?.artist || 'Unknown'}
            </Text>
            <Pressable style={{position: 'relative'}} onPress={onLikActive}>
              <Heart
                stroke={like ? '#ff0000' : color.textWhite}
                fill={like ? '#ff2d00' : 'transparent'}
                width={wp(7)}
                height={wp(7)}
                strokeWidth={1.5}
              />
              <LottieView
                ref={animateLike}
                loop={false}
                style={styles.lotieViewStyle}
                source={require('./../img/animatedlike.json')}
              />
            </Pressable>
          </Reanimated.View>
        </View>

        <View style={styles.flatlistParentContainer}>
          {queelists && (
            <FlatList
              ref={flatListRef}
              horizontal
              pagingEnabled
              onViewableItemsChanged={handleViewableItemsChanged}
              viewabilityConfig={{
                viewAreaCoveragePercentThreshold: 50,
              }}
              scrollEventThrottle={16}
              keyExtractor={(_, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              data={queelists}
              getItemLayout={(_, index) => ({
                length: responsiveui(1),
                offset: responsiveui(1) * index,
                index,
              })}
              renderItem={({item, index}) => (
                <TapGestureHandler numberOfTaps={2} onActivated={onLikActive}>
                  <View style={[styles.thumbnail_container]} key={index}>
                    <Reanimated.View
                      style={[animatedStyle, styles.thumbnailParent]}>
                      <FastImage
                        resizeMode={FastImage.resizeMode.cover}
                        source={
                          item?.artwork
                            ? {
                                uri: item?.artwork,
                                priority: FastImage.priority.high,
                              }
                            : require('../img/unknown_track.png')
                        }
                        style={styles.thumnailimage}
                      />
                    </Reanimated.View>
                    {/* 
                    <LottieView
                      ref={animateLike}
                      loop={false}
                      style={styles.lotieViewStyle}
                      source={require('./../img/animatedlike.json')}
                    /> */}

                    <View style={styles.titlecontainer}>
                      <Text
                        style={styles.song_hedding}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {capitalizeFirstLetter(item?.title)}
                      </Text>
                      <Text
                        style={styles.singer}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {item?.artist || 'Unknown'}
                      </Text>
                    </View>
                  </View>
                </TapGestureHandler>
              )}
            />
          )}
        </View>

        <MusicCountroller />

        <TouchableOpacity
          style={styles.bottm_container}
          onPress={onOpenBottomSheet}>
          <ChevronUp
            stroke={color.textdarckgrey}
            width={wp(7)}
            height={wp(7)}
            strokeWidth={wp(1)}
            style={{
              marginLeft: wp(1),
            }}
          />
          <Text style={styles.bottm_text}>RECENT SONGS</Text>
        </TouchableOpacity>
        <View style={styles.sheetContainer}>
          {/* Bottom Sheet Container */}
          <GestureDetector gesture={gesture}>
            <Reanimated.View
              style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
              <BottomSheetList queelists={queelists} />
            </Reanimated.View>
          </GestureDetector>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loadingcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.bottomsheet_color,
  },
  container: {
    paddingTop: hp(2),
    flex: 1,
    backgroundColor: color.bagroundcolor,
    paddingBottom: hp(4.5) + wp(4),
  },

  animatedContainer: {
    width: wp(100) - (wp(90) * 0.15 + responsiveui(0.12)),
    position: 'absolute',
    zIndex: 10,
    top: -hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    left: wp(90) * 0.15 + responsiveui(0.08),
  },

  animatedContainer2: {
    paddingHorizontal: responsiveui(0.05),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(100),
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },

  headderParent: {
    maxWidth: wp(65),
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  headderTextTitle: {
    color: color.textWhite,
    fontFamily: 'Nunito-ExtraBold',
    fontSize: responsiveui(0.045),
    overflow: 'hidden',
    textAlign: 'center',
    flex: 0.8,
  },
  headderText: {
    color: color.textdarckgrey,
    fontFamily: 'Nunito-Medium',
    fontSize: responsiveui(0.04),
  },

  flatlistParentContainer: {
    width: '100%',
  },

  thumbnail_container: {
    width: responsiveui(1),
    paddingHorizontal: responsiveui(0.05),
    marginTop: responsiveui(0.1),
    alignItems: 'center',
    marginBottom: hp(2),
    position: 'relative',
    zIndex: 1,
  },

  thumbnailParent: {
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

  thumnailimage: {
    width: '100%',
    height: '100%',
    // overflow: 'hidden',
    borderRadius: wp(2),
  },

  titlecontainer: {marginTop: hp(7)},

  song_hedding: {
    textAlign: 'center',
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

  lotieViewStyle: {
    position: 'absolute',
    zIndex: 10,
    left: wp(-4),
    top: wp(-4.2),
    height: wp(15),
    width: wp(15),
  },

  bottm_container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: wp(5),
  },

  // bottm_text: {
  //   color: color.textdarckgrey,
  //   fontFamily: 'Nunito-Bold',
  //   fontSize: wp(4.5),
  // },

  sheetContainer: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -20,
    position: 'absolute',
    width: wp(100),
    zIndex: 10000,
  },

  // Bottom sheet style:

  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    position: 'absolute',
    top: SCREEN_HEIGHT + hp(10),
    paddingTop: wp(5),
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: color.background,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
  bottm_text: {
    color: color.textWhite,
    fontFamily: 'Nunito-Bold',
    fontSize: wp(4.5),
    textAlign: 'center',
  },
});

export default PlayerScreen;
