import Reanimated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withClamp,
  withTiming,
  Easing,
  withSpring,
  SlideOutUp,
  SlideInUp,
  SlideInDown,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {hp, wp} from '../styles/responsive';
import {useEffect} from 'react';

export const MinimasabeScreen = ({isOpen, setIsOpen}) => {
  const mainYAxis = useSharedValue(0);

  console.log(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    mainYAxis.value = 0;
  }, [isOpen]);

  const mainGuster = Gesture.Pan()
    .onStart(() => {})
    .onUpdate(event => {
      if (event.absoluteY > 0) {
        mainYAxis.value = withSpring(event.absoluteY, {
          damping: 10,
          stiffness: 300,
        });
      }
    })
    .onEnd(() => {
      if (mainYAxis.value > 200) {
        mainYAxis.value = withTiming(1000, {
          duration: 500,
          easing: Easing.out(Easing.ease), // No need to run it in JS
        });
        runOnJS(setIsOpen)(false); // Ensure this is wrapped in runOnJS
      } else {
        mainYAxis.value = withTiming(0, {
          duration: 300,
          easing: Easing.in(Easing.ease),
        });
      }
    });

  const minimisedHandler = useAnimatedStyle(() => {
    const borderRadius = mainYAxis.value / 20;

    console.log(borderRadius);

    return {
      borderRadius,
      transform: [
        {
          translateY: withTiming(mainYAxis.value, {
            duration: 500,
            easing: Easing.out(Easing.ease),
          }),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={mainGuster}>
      <Reanimated.View
        entering={SlideInDown.duration(200).easing(Easing.ease)}
        style={[
          {
            top: 0,
            backgroundColor: 'red',
            position: 'absolute',
            zIndex: 10,
            width: wp(100),
            height: hp(100),
          },
          minimisedHandler,
        ]}></Reanimated.View>
    </GestureDetector>
  );
};
