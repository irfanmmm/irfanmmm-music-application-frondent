import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {hp, responsiveui, wp} from '../../styles/responsive';
import {useSafeArea} from 'react-native-safe-area-context';
import {PlayButton} from '../playButtons/PlayButtons';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeft, Heart} from 'react-native-feather';
import {color} from '../../styles/style';
import {useQueue} from '../../trackplayer/useQueur';
import {forwardRef, useImperativeHandle, useState} from 'react';
import TrackPlayer, {
  Event,
  useIsPlaying,
  useTrackPlayerEvents,
} from 'react-native-track-player';

export const PlayerHeadder = forwardRef(({value}, ref) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailScale = useSharedValue(0);
  const navigation = useNavigation();
  const insets = useSafeArea();
  const {queelists} = useQueue();
  const playbackstate = useIsPlaying();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - thumbnailScale.value,
      display: Math.round(1 - thumbnailScale.value) === 0 ? 'none' : 'flex',
    };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      opacity: thumbnailScale.value * thumbnailScale.value,
      display: Math.round(1 - thumbnailScale.value) === 1 ? 'none' : 'flex',
    };
  });

  useImperativeHandle(ref, () => ({
    setScale: newScale => {
      thumbnailScale.value = newScale;
    },
  }));

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async () => {
    const newTrackIndex = await TrackPlayer.getCurrentTrack();
    if (newTrackIndex !== null && newTrackIndex !== activeIndex) {
      setActiveIndex(newTrackIndex);
    }
  });

  const togglePlay = async () => {
    if (playbackstate.playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const handleNavigateToBack = () => {
    navigation.goBack();
  };

  const onLikActive = () => {};

  if (!queelists) return null;
  return (
    <View
      style={{
        flex: 1,
      }}>
      <Animated.View
        style={[
          styles.animatedContainer,
          animatedStyle,
          {
            marginTop: insets.top === 0 ? hp(5) : insets.top + hp(2),
          },
        ]}>
        <View style={styles.headderParent}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.headderTextTitle}>
            {queelists[activeIndex]?.title}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.headderText}>
            {queelists[activeIndex]?.artist}
          </Text>
        </View>
        <Pressable onPress={togglePlay}>
          <PlayButton />
        </Pressable>
      </Animated.View>

      <Animated.View
        style={[
          styles.animatedContainer2,
          animatedStyle2,
          {
            marginTop: insets.top === 0 ? hp(5) : insets.top + hp(2),
          },
        ]}>
        <Pressable onPress={handleNavigateToBack}>
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
          {queelists[activeIndex]?.title || 'Unknown'}
        </Text>
        <Pressable onPress={onLikActive}>
          <Heart
            stroke={'#ff0000'}
            fill={'#ff2d00'}
            width={wp(7)}
            height={wp(7)}
            strokeWidth={1.5}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {},
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
  headderParent: {
    maxWidth: wp(70),
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
});
