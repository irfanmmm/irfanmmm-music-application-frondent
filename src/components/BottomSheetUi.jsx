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
            style={{width: '100%', height: '100%'}}
            source={
              img
                ? {uri: BASE_URL + img, priority: FastImage.priority.normal}
                : require('../img/unknown_track.png')
            }
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View style={styles.text_container}>
          <TextTicker style={styles.song_name} duration={10000} loop bounce>
            {title || 'Unknown'}
          </TextTicker>
          <TextTicker style={styles.singer} duration={10000} loop bounce>
            {artist || 'Unknown'}
          </TextTicker>
        </View>
      </View>
      {index === activeTrack && (
        <Pressable onPress={onPlay}>
          {Playing ? (
            <Icon name="pause" size={wp(7)} />
          ) : (
            <Entypo name="controller-play" size={wp(7)} />
          )}
        </Pressable>
      )}
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
    // width: '100%',
    paddingHorizontal: responsiveui(0.025),
    marginHorizontal: responsiveui(0.05),
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
    marginLeft: responsiveui(0.04),
  },
  song_name: {
    color: color.textWhite,
    fontFamily: 'Nunito-SemiBold',
    fontSize: responsiveui(0.045),
  },
  singer: {
    color: color.textdarckgrey,
    fontFamily: 'Nunito-Regular',
    fontSize: responsiveui(0.04),
    overflow: 'hidden',
    marginTop: responsiveui(0.015),
  },
});
