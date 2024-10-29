import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {color} from '../../styles/style';
import {wp} from '../../styles/responsive';
import {Pressable, StyleSheet, TextInput} from 'react-native';
import {Search} from 'react-native-feather';
import {useEffect} from 'react';

export const SearchContainer = ({
  songsDetails,
  searchResponse,
  active,
  activeInput,
}) => {
  const inputY = useSharedValue(wp(0));
  const inputWidth = useSharedValue(wp(60));

  useEffect(() => {
    if (activeInput) {
      inputWidth.value = wp(90);
      inputY.value = wp(10);
    }
  }, [activeInput]);

  const handleBlur = () => {
    active(false);
    inputWidth.value = wp(60);
    inputY.value = wp(10);
  };

  const animatedInputStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(inputY.value, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
      width: withTiming(inputWidth.value, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }),
    };
  });

  const handleSearchInput = text => {
    const searchTerm = text.toLowerCase();
    const searchItems = songsDetails?.filter(item => {
      return item?.title?.toLowerCase()?.includes(searchTerm);
    });
    searchResponse(searchItems);
  };

  return (
    <Animated.View style={[animatedInputStyle, styles.container]}>
      <TextInput
        style={{
          width: wp(60),
          color: color.textWhite,
          fontSize: wp(5),
          fontFamily: 'Nunito-Bold',
        }}
        maxLength={150}
        placeholder="Search Latest Songs"
        placeholderTextColor={color.textMuted}
        onBlur={handleBlur}
        autoFocus={true}
        onChangeText={handleSearchInput}
      />
      <Pressable onPress={handleBlur}>
        <Search
          stroke={color.textMuted}
          width={wp(7)}
          height={wp(7)}
          strokeWidth={1}
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bagroundcolor,
    zIndex: 50,
    left: wp(5),
    elevation: 10,
    position: 'relative',
    color: color.textWhite,
    borderWidth: 1,
    paddingHorizontal: wp(5),
    borderColor: color.textdarckgrey,
    borderRadius: wp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
