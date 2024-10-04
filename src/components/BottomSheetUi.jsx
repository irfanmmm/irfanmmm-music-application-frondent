import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from 'react-native';
import React from 'react';
import {color} from '../config/style';
import {responsiveui, wp} from '../config/width_hight_config';
import Icon from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import TextTicker from 'react-native-text-ticker';
import FastImage from 'react-native-fast-image';
import {BASE_URL} from '../config/apicridentiols';
import {Pause, Play} from 'react-native-feather';

const BottomSheetUi = ({
  title,
  img,
  artist,
  Playing,
  index,
  activeTrack,
  onSelect,
  onPlay,
}) => {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.parent_item,
        // index === activeTrack && {backgroundColor: color.modal_baground},
      ]}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.image}>
          <FastImage
            style={[
              {width: '100%', height: '100%'},
              index === activeTrack && Playing && {opacity: 0.5},
            ]}
            source={
              img
                ? {uri: BASE_URL + img, priority: FastImage.priority.normal}
                : require('../img/unknown_track.png')
            }
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View style={styles.text_container}>
          <Text
            style={[
              styles.song_name,
              index === activeTrack && {color: '#E7B10A'},
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {title || 'Unknown'} amet consectetur adipisicing elit.
          </Text>
          <Text
            style={[styles.singer, index === activeTrack && {color: '#ddc98e'}]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {artist || 'Unknown'} Lorem ipsum dolor, sit amet consectetur
            adipisicing elit. Fugiat eaque necessitatibus optio fugit. Adipisci
            excepturi veniam eius optio qui ullam vero sed a expedita. In
            quaerat amet sunt explicabo animi!
          </Text>
        </View>
      </View>
      {/* {index === activeTrack && (
        <Pressable onPress={onPlay}>
          {Playing ? (
            <Pause
              style={{marginRight: wp(10)}}
              stroke={color.textWhite}
              width={wp(7)}
              height={wp(7)}
              strokeWidth={1.5}
            />
          ) : (
            <Play
              stroke={color.textWhite}
              width={wp(7)}
              height={wp(7)}
              fill={color.textWhite}
              strokeWidth={1}
            />
          )}
        </Pressable>
      )} */}
    </Pressable>
  );
};

export default BottomSheetUi;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.modal_baground,
    // opacity:0.01
  },
  parent_item: {
    width: '100%',
    // paddingHorizontal: wp(1),
    paddingHorizontal: wp(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp(1),
    borderRadius: wp(2),
    // backgroundColor: color.modal_baground,
    paddingVertical: wp(2),
  },
  image: {
    width: responsiveui(0.15),
    height: responsiveui(0.15),
    borderRadius: responsiveui(0.05),
  },
  text_container: {
    width: wp(72),
    marginLeft: wp(4),
    paddingRight: wp(2.5),
    // maxWidth: wp(63),
  },
  song_name: {
    color: color.textWhite,
    fontFamily: 'Nunito-ExtraBold',
    fontSize: responsiveui(0.045),
  },
  singer: {
    color: color.textdarckgrey,
    fontFamily: 'Nunito-BoldItalic',
    fontSize: responsiveui(0.04),
    overflow: 'hidden',
    marginTop: responsiveui(0.015),
  },
});
