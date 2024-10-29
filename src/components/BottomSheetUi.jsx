import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import {color} from '../styles/style';
import {responsiveui, wp} from '../styles/responsive';
import FastImage from 'react-native-fast-image';
import {BASE_URL} from '../config/urls';
import {Pause, Play} from 'react-native-feather';

const BottomSheetUi = ({
  title,
  img,
  artist,
  Playing,
  index,
  activeIndex,
  onSelect,
  onPlay,
}) => {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.parent_item,
        // index === activeIndex && {backgroundColor: color.modal_baground},
      ]}>
      <View style={{flexDirection: 'row', overflow: 'hidden'}}>
        <View style={styles.image}>
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            source={
              img
                ? {
                    uri: img?.includes('http')
                      ? img
                      : img?.includes('https')
                      ? img
                      : BASE_URL + img,
                    priority: FastImage.priority.high,
                  }
                : require('../img/unknown_track.png')
            }
            style={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              borderRadius: wp(2),
            }}
          />
        </View>
        <View style={styles.text_container}>
          <Text
            style={[
              styles.song_name,
              index === activeIndex && {color: color.selectSongtitle},
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {title || 'Unknown'}
          </Text>
          <Text
            style={[
              styles.singer,
              index === activeIndex && {color: color.selectSongartist},
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {artist || 'Unknown'}
          </Text>
        </View>
      </View>
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
    fontFamily: 'Nunito-Bold',
    fontSize: responsiveui(0.04),
    overflow: 'hidden',
    // marginTop: responsiveui(0.015),
  },
});
