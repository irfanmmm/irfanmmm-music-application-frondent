import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {responsiveui, wp} from '../../styles/responsive';

export const CardSkelton = () => {
  return Array.from({length: 5}).map((_, index) => (
    <SkeletonPlaceholder borderRadius={4} direction="left" key={index}>
      <View
        style={{
          paddingLeft: responsiveui(0.05),
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: wp(4),
        }}>
        <View
          style={{
            width: responsiveui(0.28),
            height: responsiveui(0.28),
            marginRight: responsiveui(0.04),
            borderRadius: wp(1),
          }}
        />
        <View>
          <View
            style={{
              width: wp(30),
              height: wp(5),
              marginBottom: wp(2),
            }}></View>
          <View
            style={{
              width: wp(50),
              height: wp(5),
              marginBottom: wp(2),
            }}></View>
          <View style={{width: wp(20), height: wp(5)}}></View>
        </View>
      </View>
    </SkeletonPlaceholder>
  ));
};
