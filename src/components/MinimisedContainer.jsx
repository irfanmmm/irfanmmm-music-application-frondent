import {
  Image,
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
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
import FastImage from 'react-native-fast-image';

export const MinimisedContainer = () => {
  const navigation = useNavigation();
  const animatedvalue = useSharedValue(-5);
  const songProgressing = usePlaybackState();
  const activeState = useActiveTrack();
  const progress = useProgress();

  useEffect(() => {
    animatedvalue.value = -5;
  }, []);

  useEffect(() => {
    if (songProgressing.state === 'playing') {
      animatedvalue.value = -5;
    }
  }, [songProgressing]);

  const stopSong = async () => {
    await TrackPlayer.pause();
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
    navigation.navigate('MusicPlayer', {
      propsIndex: selectedIndex.toString(),
    });
  };

  return (
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
            {songProgressing.state === 'loading' ||
            songProgressing.state === 'buffering' ? (
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size={'large'} color={color.textWhite} />
              </View>
            ) : (
              <FastImage
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: wp(1),
                }}
                resizeMode={FastImage.resizeMode.contain}
                source={
                  activeState
                    ? {uri: activeState?.artwork}
                    : require('../img/unknown_track.png')
                }
              />
            )}
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
  );
};
const styles = StyleSheet.create({
  container: {
    elevation: 10,
    opacity: 1,
    width: wp(100) - responsiveui(0.05),
    left: (wp(100) - (wp(100) - responsiveui(0.05))) / 2,
    paddingHorizontal: wp(2),
    backgroundColor: '#141E46',
    height: wp(16.5),
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
    width: wp(13),
    height: wp(13),
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
