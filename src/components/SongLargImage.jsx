import React from 'react';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import TextTicker from 'react-native-text-ticker';
import {color} from '../styles/style';
import {hp, responsiveui} from '../styles/responsive';
import Reanimated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {View, Text} from 'react-native';
import {BASE_URL} from '../config/urls';

export const renderItem = ({item, index}) => {
  const scrollXx = useSharedValue(0);

  // Scroll event handler using Reanimated
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollXx.value = event.contentOffset.x;
    },
  });

  const animatedStyles = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * responsiveui(1),
      index * responsiveui(1),
      (index + 1) * responsiveui(1),
    ];

    const scale = interpolate(
      scrollXx.value,
      inputRange,
      [0.8, 1, 0.8], // Scale the image between 0.8 to 1 when scrolling
      Extrapolate.CLAMP,
    );

    const translateX = interpolate(
      scrollXx.value,
      inputRange,
      [30, 0, -30],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{scale}, {translateX}],
    };
  });
  // Animate thumbnail styles

  return (
    <View style={styles.thumbnail_container}>
      <Reanimated.Image
        resizeMode="cover"
        source={
          item?.artwork
            ? {uri: BASE_URL + item?.artwork}
            : require('../img/unknown_track.png')
        }
        style={[
          styles.thumbnail,
          animatedStyles, // Apply the animated styles
        ]}
      />
      <View style={{marginTop: hp(7)}}>
        <TextTicker style={styles.song_hedding} duration={10000} loop bounce>
          {item?.title}
        </TextTicker>
        <Text style={styles.singer}>{item?.artist || 'Unknown'}</Text>
      </View>
    </View>
  );
};
