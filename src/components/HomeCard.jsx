import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {color} from '../config/style';
import {responsiveui, wp} from '../config/width_hight_config';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setCurrentTab} from '../config/redux/reducer';
import TextTicker from 'react-native-text-ticker';
import {BASE_URL} from '../config/apicridentiols';

export const HomeCard = ({item, index, onPress}) => {
  const dispatch = useDispatch();

  return (
    <Animated.View key={index} entering={FadeInDown.delay(200 * index)}>
      <Pressable
        style={styles.recomonded_card_parent}
        key={index}
        onPress={() => {
          dispatch(setCurrentTab('MusicPlayer'));
          onPress(item, index);
        }}>
        <Animated.Image
          resizeMode="cover"
          style={styles.recomonded_card_image}
          source={
            item?.artwork
              ? {uri: BASE_URL + item?.artwork}
              : require('../img/unknown_track.png')
          }
        />
        <View style={styles.recomonded_card_right}>
          <TextTicker
            style={styles.recomonded_card_text}
            duration={10000}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={1000}>
            {item?.title}
          </TextTicker>
          <TextTicker
            style={styles.recomonded_card_text2}
            duration={10000}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={1000}>
            {item.artist ?? 'unknown'}
          </TextTicker>
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
  },
  recomonded_card_right: {
    flex: 2,
  },
  recomonded_card_text: {
    color: color.textWhite,
    fontSize: wp(5),
    fontFamily: 'Nunito-Regular',
  },
  recomonded_card_text2: {
    color: color.textgrey,
    fontFamily: 'Nunito-Regular',
    fontSize: wp(4),
    marginTop: responsiveui(0.01),
  },
});
