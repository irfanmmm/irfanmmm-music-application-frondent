import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {color} from '../styles/style';
import {responsiveui, wp} from '../styles/responsive';

export const HomeCard = ({item, index, onPress}) => {
  return (
    <Animated.View entering={FadeInDown.delay(100 * index)}>
      <Pressable
        style={styles.recomonded_card_parent}
        onPress={() => {
          onPress(item, index);
        }}>
        <Animated.Image
          resizeMode="cover"
          style={styles.recomonded_card_image}
          source={
            item?.artwork
              ? {uri: item?.artwork}
              : require('../img/unknown_track.png')
          }
        />
        <View style={styles.recomonded_card_right}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.recomonded_card_text}>
            {item?.title}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.recomonded_card_text2}>
            {item.artist ?? 'unknown'}
          </Text>
          <Text style={styles.recomonded_card_text2}>
            {item?.rating ?? 0}/likes
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  recomonded_card_parent: {
    paddingLeft: responsiveui(0.05),
    paddingRight: responsiveui(0.05),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(4),
  },
  recomonded_card_image: {
    width: responsiveui(0.28),
    height: responsiveui(0.28),
    marginRight: responsiveui(0.04),
    borderRadius: wp(1),
    elevation: 100,
  },
  recomonded_card_right: {
    flex: 2,
  },
  recomonded_card_text: {
    color: color.textWhite,
    fontSize: wp(5),
    fontFamily: 'Nunito-SemiBold',
  },
  recomonded_card_text2: {
    color: color.textgrey,
    fontFamily: 'Nunito-SemiBold',
    fontSize: wp(4),
    marginTop: responsiveui(0.01),
  },
});
