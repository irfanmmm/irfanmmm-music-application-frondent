import {Animated, Image, StyleSheet, View, Text} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Bell} from 'react-native-feather';
import {shallowEqual, useSelector} from 'react-redux';
import {hp, responsiveui, wp} from '../../styles/responsive';
import {color} from './../../styles/style';

export const Hedder = ({activeInput, scrollY, loading}) => {
  const insets = useSafeArea();

  const diffClamp = Animated.diffClamp(scrollY, 0, hp(15));
  const animatedStyle = diffClamp.interpolate({
    inputRange: [0, hp(15)],
    outputRange: [0, -hp(15)],
  });
  const state = useSelector(
    state => ({
      profileDetails: state.store.profiledetails,
    }),
    shallowEqual,
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: insets.top === 0 ? hp(5) : insets.top + hp(2),
          transform: [{translateY: animatedStyle}],
          opacity: activeInput ? 0 : 1,
        },
      ]}>
      {loading ? (
        <SkeletonPlaceholder borderRadius={4} direction="left">
          <View style={{flexDirection: 'row'}}>
            <View style={styles.profid} />
            <View style={{justifyContent: 'center', marginLeft: wp(5)}}>
              <View
                style={{width: wp(50), height: wp(3), marginBottom: wp(2)}}
              />
              <View style={{width: wp(30), height: wp(3)}} />
            </View>
          </View>
        </SkeletonPlaceholder>
      ) : (
        <>
          <Image
            resizeMode={'cover'}
            source={{uri: state?.profileDetails?.profile}}
            style={styles.profid}
          />
          <View style={styles.hedder_center}>
            <Text style={styles.name_person}>
              {state.profileDetails?.username
                ? state.profileDetails.username
                : 'Sarwar Jahan'}
            </Text>
            <Text style={styles.hedder_discription}>Gold Member</Text>
          </View>
        </>
      )}
      <Bell
        stroke={color.textWhite}
        width={wp(7)}
        height={wp(7)}
        strokeWidth={1.5}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    elevation: 4,
    height: hp(15),
    top: 0,
    left: 0,
    zIndex: 10,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveui(0.05),
    backgroundColor: color.bagroundcolor,
  },
  profid: {
    width: responsiveui(0.12),
    height: responsiveui(0.12),
    borderRadius: responsiveui(0.12) / 2,
  },
  hedder_center: {
    flex: 3,
    alignItems: 'flex-start',
    paddingLeft: responsiveui(0.025),
  },
  name_person: {
    color: color.textWhite,
    fontSize: responsiveui(0.055),
    fontFamily: 'Nunito-SemiBold',
  },
  hedder_discription: {
    fontSize: responsiveui(0.038),
    color: '#DEDEDE',
    fontFamily: 'Nunito-Regular',
  },
});
