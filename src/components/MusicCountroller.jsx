import Slider from '@react-native-community/slider';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {hp, responsiveui, wp} from '../styles/responsive';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'react-native-feather';
import {color} from '../styles/style';

export const MusicCountroller = ({
  currentIndex,
  handleeClick,
  songDetails,
  loading,
}) => {
  const songProgressing = usePlaybackState();
  const progress = useProgress();
  return (
    <View>
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
    </View>
  );
};
const styles = StyleSheet.create({
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
});
