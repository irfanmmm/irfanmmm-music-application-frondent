import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {color} from '../styles/style';
import {hp, responsiveui, wp} from '../styles/responsive';
import {useCallback, useRef, useState} from 'react';
import {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import Reanimated from 'react-native-reanimated';
import {ChevronUp} from 'react-native-feather';
import {useQueue} from '../trackplayer/useQueur';
import {TapGestureHandler} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import {capitalizeFirstLetter} from '../config/capitalizeString';
import LottieView from 'lottie-react-native';
import {MusicCountroller} from '../components/MusicCountroller';
import BottomSheet, {MAX_TRANSLATE_Y} from '../components/CustomBottomSheet';
import BottomSheetUi from '../components/BottomSheetUi';
import TrackPlayer, {
  Event,
  RepeatMode,
  useIsPlaying,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {PlayerHeadder} from '../components/playerScreenComponent/PlayerScreenHedder';

const PlayerScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [repeateMode, setRepeatMode] = useState(false);
  const playbackstate = useIsPlaying();
  const ref = useRef(null);
  const animateLike = useRef(null);
  const flatListRef = useRef(null);
  const isButtonPress = useRef(false);
  const {queelists, suffleQueelist, setSuffleQueelist} = useQueue();
  const thumbnailScale = useSharedValue(1);
  const playerHeaderRef = useRef(null);
  const startTranslateY = -wp(15);
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
  const calculateThumbnailScale = useCallback(
    currentValue => {
      const minSlideValue = MAX_TRANSLATE_Y;
      const maxSlideValue = 0;

      let normalizedValue =
        (currentValue - minSlideValue) / (maxSlideValue - minSlideValue);
      const minScale = 0.15;
      const maxScale = 1;

      return minScale + normalizedValue * (maxScale - minScale);
    },
    [MAX_TRANSLATE_Y],
  );
  const handleSlideToHeader = useCallback(currentValue => {
    thumbnailScale.value = calculateThumbnailScale(currentValue);
    if (playerHeaderRef && playerHeaderRef?.current) {
      playerHeaderRef.current?.setScale(thumbnailScale.value);
    }
  }, []);

  const onOpenBottomSheet = useCallback(() => {
    const isActive = ref?.current?.isActive();
    if (isActive) {
      ref?.current?.scrollTo(0);
    } else {
      ref?.current?.scrollTo(hp(-97));
    }
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async () => {
    const newTrackIndex = await TrackPlayer.getCurrentTrack();
    if (newTrackIndex !== null && newTrackIndex !== activeIndex) {
      setActiveIndex(newTrackIndex);
      isButtonPress.current = true;
      flatListRef?.current?.scrollToIndex({
        index: newTrackIndex,
        animated: true,
      });
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

  const shuffleQueue = async () => {
    setSuffleQueelist(!suffleQueelist);
  };
  const handlePreviousPress = async () => {
    await TrackPlayer.skipToPrevious();
  };
  const togglePlayBack = async () => {
    if (playbackstate.playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };
  const handleNextPress = async () => {
    await TrackPlayer.skipToNext();
  };
  const handleRepleate = async () => {
    const currentRepeateMode = await TrackPlayer.getRepeatMode();
    await TrackPlayer.setRepeatMode(
      currentRepeateMode === 1 ? RepeatMode.Off : RepeatMode.Track,
    );
    setRepeatMode(currentRepeateMode === 1);
  };

  const handleeClick = index => {
    switch (index) {
      case 0:
        shuffleQueue();
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
        handleRepleate();
        break;
      default:
        break;
    }
  };

  const onLikActive = () => {
    animateLike.current?.play();
  };

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
        <PlayerHeadder ref={playerHeaderRef} value={1} />
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
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              data={queelists}
              getItemLayout={(data, index) => ({
                length: responsiveui(1),
                offset: responsiveui(1) * index,
                index,
              })}
              renderItem={({item, index}) => (
                <View style={[styles.thumbnail_container]} key={index}>
                  <TapGestureHandler numberOfTaps={2} onActivated={onLikActive}>
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
                  </TapGestureHandler>

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
              )}
            />
          )}
        </View>

        <LottieView
          ref={animateLike}
          loop={false}
          style={styles.lotieViewStyle}
          source={require('./../img/animatedlike.json')}
        />

        <MusicCountroller
          currentIndex={activeIndex}
          handleeClick={handleeClick}
          songDetails={queelists}
          repeateMode={repeateMode}
          shuffleMode={suffleQueelist}
        />

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
          <BottomSheet
            ref={ref}
            activeTrack={queelists[activeIndex]}
            currentPosition={handleSlideToHeader}>
            <FlatList
              nestedScrollEnabled={true}
              contentContainerStyle={{paddingBottom: 20}}
              data={queelists}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <BottomSheetUi
                  key={index}
                  title={item?.title}
                  img={item?.artwork}
                  artist={item?.artist}
                  index={index}
                  activeIndex={activeIndex}
                  onSelect={async () => {
                    await TrackPlayer.skip(index);
                  }}
                />
              )}
            />
          </BottomSheet>
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
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },

  headderParent: {
    maxWidth: wp(70),
  },
  headderTextTitle: {
    color: color.textWhite,
    fontFamily: 'Nunito-ExtraBold',
    fontSize: responsiveui(0.045),
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
    zIndex: 1000,
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
    overflow: 'hidden',
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
    zIndex: 10000,
    left: wp(25),
    top: hp(25),
    height: wp(50),
    width: wp(50),
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
});

export default PlayerScreen;
