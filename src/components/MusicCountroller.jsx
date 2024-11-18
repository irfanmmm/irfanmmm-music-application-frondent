import Slider from '@react-native-community/slider';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {hp, responsiveui, wp} from '../styles/responsive';
import TrackPlayer, {
  RepeatMode,
  useIsPlaying,
  useProgress,
} from 'react-native-track-player';
import {Repeat, Shuffle, SkipBack, SkipForward} from 'react-native-feather';
import {color} from '../styles/style';
import {PlayButton} from './playButtons/PlayButtons';
import {useQueue} from '../trackplayer/useQueur';
import React, {useState} from 'react';

export const MusicCountroller = React.memo(() => {
  const progress = useProgress();
  const playbackstate = useIsPlaying();
  const [repeateMode, setRepeatMode] = useState(false);
  const {suffleQueelist} = useQueue();

  async function TogglePlay() {
    if (playbackstate.playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  }

  async function SkipPreviuse() {
    await TrackPlayer.skipToPrevious();
  }

  async function SkipNext() {
    await TrackPlayer.skipToNext();
  }

  async function RepeateMode() {
    const currentRepeateMode = await TrackPlayer.getRepeatMode();
    await TrackPlayer.setRepeatMode(
      currentRepeateMode === 1 ? RepeatMode.Off : RepeatMode.Track,
    );
    setRepeatMode(currentRepeateMode === 1);
  }

  function SuffleQuee() {
    // setSuffleQueelist(!suffleQueelist);
  }

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

      <View style={styles.song_length_container}>
        <Text style={styles.song_corrent}>
          {new Date(progress.position * 1000).toISOString().substr(14, 5)}
        </Text>
        <Text style={styles.song_corrent}>
          {new Date(progress.duration * 1000).toISOString().substr(14, 5)}
        </Text>
      </View>

      <View style={styles.controls}>
        <Pressable onPress={SuffleQuee}>
          <Shuffle
            stroke={suffleQueelist ? color.textWhite : color.textMuted}
            width={wp(7)}
            height={wp(7)}
            strokeWidth={1.5}
          />
        </Pressable>
        <Pressable onPress={SkipPreviuse}>
          <SkipBack
            stroke={color.textWhite}
            width={wp(7)}
            height={wp(7)}
            strokeWidth={1.5}
          />
        </Pressable>
        <Pressable onPress={TogglePlay} style={styles.playPauseContainer}>
          <PlayButton size={wp(10)} bg={color.background} />
        </Pressable>
        <Pressable onPress={SkipNext}>
          <SkipForward
            stroke={color.textWhite}
            width={wp(7)}
            height={wp(7)}
            strokeWidth={1.5}
          />
        </Pressable>
        <Pressable onPress={RepeateMode}>
          <Repeat
            stroke={repeateMode == 1 ? color.textMuted : color.textWhite}
            width={wp(7)}
            height={wp(7)}
            strokeWidth={1.5}
          />
        </Pressable>
      </View>
    </View>
  );
});
const styles = StyleSheet.create({
  progressbar: {
    marginLeft: wp(1.5),
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
  playPauseContainer: {
    backgroundColor: color.textWhite,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(15),
    height: wp(15),
    borderRadius: wp(15 / 2),
    elevation: 100,
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
