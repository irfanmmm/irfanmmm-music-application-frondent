import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useImperativeHandle} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {hp} from '../config/width_hight_config';
import {color} from '../config/style';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

export const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 20;

const BottomSheet = React.forwardRef(({children, currentPosition}, ref) => {
  const translateY = useSharedValue(0);
  const active = useSharedValue(false);

  const scrollTo = useCallback(destination => {
    'worklet';
    active.value = destination !== 0;

    translateY.value = withSpring(destination, {damping: 20});
  }, []);

  const isActive = useCallback(() => {
    return active.value;
  }, []);

  useImperativeHandle(ref, () => ({scrollTo, isActive}), [scrollTo, isActive]);

  const context = useSharedValue({y: 0});
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {y: translateY.value};
    })
    .onUpdate(event => {
      const newTranslateY = event.translationY + context.value.y;
      translateY.value = Math.min(Math.max(newTranslateY, MAX_TRANSLATE_Y), 0);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 3) {
        scrollTo(0); // Snap to closed
      } else {
        scrollTo(MAX_TRANSLATE_Y); // Snap to expanded
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolate.CLAMP,
    );

    // Call the currentPosition function with the translated value
    if (currentPosition && typeof currentPosition === 'function') {
      runOnJS(currentPosition)(translateY.value);
    }

    return {
      borderRadius,
      transform: [{translateY: translateY.value}],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        {/* <View style={styles.line} /> */}
        {children}
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    // backgroundColor: color.background,
    position: 'absolute',
    top: SCREEN_HEIGHT + hp(10),
    borderRadius: 25,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
});

export default BottomSheet;
