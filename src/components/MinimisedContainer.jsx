import {Image, Pressable, StyleSheet, View} from 'react-native';
import {hp, responsiveui, wp} from '../styles/responsive';
import Animated, {
  interpolate,
  runOnJS,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {color} from '../styles/style';
import {useEffect} from 'react';
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import TextTicker from 'react-native-text-ticker';
import {Pause, Play} from 'react-native-feather';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {setCurrentTab} from '../config/redux/reducer';
import {useDispatch} from 'react-redux';

export const MinimisedContainer = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const animatedvalue = useSharedValue(-5);
  const progress = useProgress();
  const songProgressing = usePlaybackState();
  const activeState = useActiveTrack();

  useEffect(() => {
    animatedvalue.value = -5;
  }, [activeState]);

  const stopSong = async () => {
    await TrackPlayer.stop();
  };

  const gesture = Gesture.Pan()
    .onStart(() => {})
    .onUpdate(event => {
      if (event.translationY > 5) {
        animatedvalue.value = event.translationY;
      }
    })
    .onEnd(() => {
      if (animatedvalue.value >= 40) {
        animatedvalue.value = 500;
        runOnJS(stopSong)();
      } else {
        animatedvalue.value = -5;
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedvalue.value,
      [0, 100], // input range: from 0 to 500 translationY
      [1, 0], // output range: from 1 (fully visible) to 0 (invisible)
    );
    return {
      transform: [
        {
          translateY: animatedvalue.value,
        },
      ],
      opacity: opacity,
    };
  });

  const handleTogglePlay = async () => {
    if (songProgressing.state === 'playing') {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const handleNavigateToSongPlayer = async () => {
    const selectedIndex = await TrackPlayer.getActiveTrackIndex();
    dispatch(setCurrentTab('MusicPlayer'));
    navigation.navigate('MusicPlayer', {
      selectedIndex,
    });
  };

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Animated.View
          entering={SlideInDown.duration(1500)}
          exiting={SlideInDown.duration(1500)}
          style={[styles.container, animatedStyle]}
          on>
          <Pressable
            onPress={() => handleNavigateToSongPlayer(true)}
            style={styles.maincontainer}>
            <View style={styles.imageContainer}>
              <Image
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: wp(1.5),
                }}
                source={
                  activeState
                    ? {uri: activeState?.artwork}
                    : require('../img/unknown_track.png')
                }
              />
            </View>
            <View style={styles.textContainer}>
              <TextTicker
                style={styles.title}
                duration={10000}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}>
                {activeState?.title}
              </TextTicker>
              <TextTicker
                style={styles.descriptions}
                duration={10000}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}>
                {activeState?.artist}
              </TextTicker>
            </View>
            <Pressable style={styles.playContainer} onPress={handleTogglePlay}>
              {songProgressing.state !== State.Playing ? (
                <Play fill={color.textWhite} />
              ) : (
                <Pause stroke={color.textWhite} strokeWidth={1.5} />
              )}
            </Pressable>
          </Pressable>
          <View
            style={{
              marginTop: wp(1),
              height: wp(0.7),
              borderRadius: wp(2),
              width: '100%',
              backgroundColor: color.textWhite,
            }}>
            <View
              style={{
                height: '100%',
                borderRadius: wp(2),
                width: isNaN(
                  (progress.position / progress?.duration) *
                    (wp(100) - responsiveui(0.05) - wp(2)),
                )
                  ? wp(0)
                  : (progress.position / progress?.duration) *
                    (wp(100) - responsiveui(0.05) - wp(2)),
                backgroundColor: color.primary,
              }}
            />
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    elevation: 10,
    opacity: 1,
    width: wp(100) - responsiveui(0.05),
    left: (wp(100) - (wp(100) - responsiveui(0.05))) / 2,
    paddingHorizontal: wp(2),
    backgroundColor: '#1E3E62',
    height: wp(18),
    borderRadius: wp(1.5),
    position: 'absolute',
    justifyContent: 'flex-end',
    bottom: hp(10),
  },
  maincontainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContainer: {
    width: wp(15),
    height: wp(15),
  },
  textContainer: {
    flex: 1,
    paddingLeft: wp(2),
  },
  title: {
    fontSize: wp(5),
    fontFamily: 'Nunito-ExtraBold',
    color: color.textWhite,
  },
  descriptions: {
    fontSize: wp(3.5),

    color: color.textMuted,
  },
  playContainer: {
    paddingLeft: wp(2),
    paddingRight: wp(2),
  },
});
