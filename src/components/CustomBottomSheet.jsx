import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useCallback, useImperativeHandle} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {hp, wp} from '../styles/responsive';
import LinearGradient from 'react-native-linear-gradient';
import {Text} from 'react-native-svg';
import {color} from '../styles/style';
import {useProgress} from 'react-native-track-player';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

export const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 20;

const BottomSheet = React.forwardRef(
  ({children, activeTrack, currentPosition}, ref) => {
    const progress = useProgress();
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

    useImperativeHandle(ref, () => ({scrollTo, isActive}), [
      scrollTo,
      isActive,
    ]);

    const context = useSharedValue({y: 0});
    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = {y: translateY.value};
      })
      .onUpdate(event => {
        const newTranslateY = event.translationY + context.value.y;
        translateY.value = Math.min(
          Math.max(newTranslateY, MAX_TRANSLATE_Y),
          0,
        );
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
          <LinearGradient
            colors={activeTrack ?? [color.bluecolor, color.bagroundcolor]}
            style={{flex: 1, backgroundColor: color.bagroundcolor}}>
            <View
              style={{
                borderTopColor: color.textWhite,
                borderTopWidth: 1,
                width: isNaN((progress.position / progress?.duration) * wp(100))
                  ? wp(0)
                  : (progress.position / progress?.duration) * wp(100),

                marginBottom: wp(3),
              }}
            />
            <Text
              style={[
                styles.bottm_text,
                {
                  color: color.textWhite,
                  textAlign: 'center',
                  marginBottom: wp(2),
                },
              ]}>
              RECENT SONGS
            </Text>
            {children}
          </LinearGradient>
        </Animated.View>
      </GestureDetector>
    );
  },
);

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
  bottm_text: {
    color: color.textdarckgrey,
    fontFamily: 'Nunito-Bold',
    fontSize: wp(4.5),
  },
});

export default BottomSheet;
