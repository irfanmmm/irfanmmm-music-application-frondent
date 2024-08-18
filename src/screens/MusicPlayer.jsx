import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { hp, responsiveui, wp } from '../config/width_hight_config';
import { color } from '../config/style';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '../components/CustomBottomSheet';
import BottomSheetUi from '../components/BottomSheetUi';
import { Controls } from '../components/Controls';
import { CONTROLS } from '../config/control';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { setCurrentTab } from '../config/redux/reducer';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Slider from '@react-native-community/slider';
import { useApiCalls } from '../config/useApiCalls';

const calculateInterpolatedValues = steps => {
  return steps / 10;
};

const calculateInterpolatedOpacity = steps => {
  const parts = steps.toString()?.split('-');
  const opacityValue = parseFloat(parts[1]) / 100;
  if (Number.isNaN(opacityValue)) {
    return 0;
  }
  return opacityValue;
};

const setupPlayer = async (song) => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
    });

    const modifiedSongs = song.map((item, index) => ({
      url: encodeURI(item?.song),
      title: item?.title,
      artwork: item?.thumbnail,
      rating: item?.like === undefined ? '' : item?.like,
      index: item?._id,
    }))

    await TrackPlayer.add(modifiedSongs);
  } catch (error) {
    console.error("Error setting up player:", error);
  }
}



const togglePlayBack = async (playBackState) => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  if (currentTrack !== null) {
    if (playBackState.state == State.Paused || playBackState.state == 'ready' || playBackState.state == undefined || playBackState.state == false) {
      await TrackPlayer.play()
    } else {
      await TrackPlayer.pause()
    }
  }
}





const MusicPlayer = ({ navigation }) => {

  const { loading, getAllsongs, getSong } = useApiCalls()
  const scrollX = useRef(new Animated.Value(0)).current
  const progress = useProgress()
  const playBackState = usePlaybackState()
  const dispatch = useDispatch()
  const state = useSelector(state => state.store.currentTab, shallowEqual)


  const insets = useSafeArea();
  const tabBarHeight = useRef(new Animated.Value(-insets.top - hp(2))).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const playBarOpacity = useRef(new Animated.Value(0)).current;
  const ref = useRef(null);

  const [songDetails, setSongDetails] = useState([])

  const onPress = useCallback(() => {
    const isActive = ref?.current?.isActive();
    if (isActive) {
      ref?.current?.scrollTo(0);
    } else {
      ref?.current?.scrollTo(hp(-97));
    }
  }, []);



  const handleSlideToHedder = e => {
    const interpolatedOpacity = calculateInterpolatedOpacity(e);
    const interpolatedHeight = calculateInterpolatedValues(e);

    // Ensure that the opacity and height values are valid numbers
    const validOpacity = isNaN(interpolatedOpacity) ? 0 : interpolatedOpacity;
    const validHeight = isNaN(interpolatedHeight) ? 0 : interpolatedHeight;

    Animated.timing(tabBarHeight, {
      toValue: validHeight,
      duration: 0,
      useNativeDriver: false,
    }).start();

    Animated.timing(playBarOpacity, {
      toValue: validOpacity,
      duration: 0,
      useNativeDriver: false,
    }).start();

    Animated.timing(screenOpacity, {
      toValue: -validOpacity / 10 + 1,
      duration: 0,
      useNativeDriver: false,
    }).start();

  };

  const handleNavigateToBack = () => {
    navigation.navigate('Home')
    dispatch(setCurrentTab(''))
  }

  const skipTo = async (trackId) => {
    await TrackPlayer.skip(trackId)
  }



  useEffect(() => {
    (async () => {
      dispatch(setCurrentTab('MusicPlayer'))
      const songs = await getAllsongs()
      await setupPlayer(songs.data)
      setSongDetails(songs.data);
      console.log(songs.data);


    }
    )();
    scrollX.addListener(async ({ value }) => {
      const index = Math.round(value / wp(100))
      console.log(index);
      skipTo(index)
    })

    const updateCurrentTrack = async () => {
      const trackId = await TrackPlayer.getCurrentTrack();
      if (trackId !== null) {
        const track = await TrackPlayer.getTrack(trackId);
        const response = await getSong(track?.index)
        console.log(response);
        // setCurrentTrack(track);
      }
    };

    // Fetch the current track on mount
    updateCurrentTrack();

    // Listen to track change events
    const trackChangeListener = TrackPlayer.addEventListener(Event.PlaybackTrackChanged, updateCurrentTrack);


    return () => {
      scrollX.removeAllListeners();
      trackChangeListener.remove();
    }
  }, []);




  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextPress = async () => {
    if (currentIndex < songDetails.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      flatListRef.current.scrollToIndex({ index: newIndex, animated: true });
      skipTo(newIndex)
    }
  };

  const handlePreviousPress = async () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      flatListRef.current.scrollToIndex({ index: newIndex, animated: true });
      skipTo(newIndex)
    }
  };



  const handleeClick = (type, index) => {
    switch (index) {
      case 0:
        break;
      case 1:
        handlePreviousPress()

        break;
      case 2:
        togglePlayBack(playBackState)
        break;
      case 3:
        handleNextPress()
        break;
      case 4:
        break;
      default:
        break;
    }

  }



  console.log(songDetails);



  return (
    <GestureHandlerRootView
      style={{
        position: 'relative',
        flex: 1,
        width: wp(100),
        backgroundColor: color.bagroundcolor,
      }}>
      <View

        style={[
          styles.safeArea,
        ]}>
        <Animated.View
          style={{
            marginTop: hp(4),
            position: 'absolute',
            top: tabBarHeight,
            height: hp(20),
            justifyContent: 'space-around',
            paddingHorizontal: responsiveui(0.05),
            width: '100%',
            zIndex: -50,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Pressable onPress={handleNavigateToBack} >

              <Image source={require('../img/arrow-left.png')} />
            </Pressable>
            <Text style={styles.main_hedding}>Ophelia by Steven</Text>
            <Image
              style={{ width: responsiveui(0.06), height: responsiveui(0.06) }}
              source={require('../img/heart.png')}
            />
          </View>
          <Animated.View
            style={[
              styles.active_bottomsheet_hedder,
              {
                opacity: playBarOpacity,
              },
            ]}>
            <View style={styles.left_thumbnail}>
              <Image
                style={styles.left_thumbnail_image}
                source={require('../img/Rectangle.png')}
              />
              <View style={styles.left_content}>
                <Text style={styles.left_hedding}>Gundellona</Text>
                <Text style={styles.left_discriptions}>
                  Leo Jam and Anirudh Ravichandren
                </Text>
              </View>
            </View>
            <Image
              style={styles.playicon}
              source={require('../img/play.png')}
            />
          </Animated.View>
        </Animated.View>
        <Animated.View style={{ width: '100%', marginTop: hp(7), opacity: screenOpacity }}>
          <Animated.FlatList
            horizontal
            pagingEnabled
            ref={flatListRef}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}

            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            data={songDetails}
            renderItem={({ item, index }) => (
              <View
                style={styles.thumbnail_container}>
                <Image
                  resizeMode="cover"
                  source={{ uri: item?.thumbnail }}
                  style={styles.thumbnail}
                />
                <Text style={styles.song_hedding}>{item?.title}</Text>
                <Text style={styles.singer}>Steven Price</Text>
              </View>
            )}
          />
        </Animated.View>
        <Slider
          style={styles.progressbar}
          value={progress.position}
          minimumValue={0}
          maximumValue={progress.duration}
          thumbTintColor='#fff'
          minimumTrackTintColor={'#fff'}
          // maximumTrackTintColor='#000'
          onSlidingComplete={async (value) => {
            await TrackPlayer.seekTo(value);
          }}
        />
        <View style={styles.song_length_container}>
          <Text style={styles.song_corrent}>{new Date(progress.position * 1000).toISOString().substr(14, 5)}</Text>
          <Text style={styles.song_corrent}>{new Date((progress.duration - progress.position) * 1000).toISOString().substr(14, 5)}</Text>
        </View>
        <View
          style={styles.controls}
        >
          {
            CONTROLS.map((control, index) => (
              <Controls playingState={playBackState.state === State.Playing} key={index}
                item={control} onPress={handleeClick} index={index} />
            ))
          }
        </View>
        {state === 'MusicPlayer' && <TouchableOpacity style={styles.bottm_container} onPress={onPress}>
          <Text style={styles.bottm_text}>RELATED SONGS</Text>
        </TouchableOpacity>}
        <View style={styles.container}>
          <BottomSheet ref={ref} currentPosition={handleSlideToHedder}>
            <View style={{ flex: 1, backgroundColor: color.bagroundcolor }}>
              <BottomSheetUi />
            </View>
          </BottomSheet>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default MusicPlayer;

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: hp(2),
    flex: 1,
    backgroundColor: color.bagroundcolor,
    paddingBottom: hp(4.5) + wp(4)
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
  },
  thumbnail: {
    width: wp(90),
    height: hp(45),
    borderRadius: wp(2),
  },
  song_hedding: {
    color: color.textWhite,
    marginTop: wp(3),
    fontSize: wp(8),
    fontFamily: 'Nunito-Bold',
  },
  singer: {
    color: color.textdarckgrey,
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
    position: "absolute",
    width: wp(100)
  },
  button: {
    height: 10,
    borderRadius: 25,
    aspectRatio: 1,
    backgroundColor: 'white',
    opacity: 0.6,
  },
});
