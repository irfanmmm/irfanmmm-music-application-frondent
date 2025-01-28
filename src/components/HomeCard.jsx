import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {color} from '../styles/style';
import {responsiveui, wp} from '../styles/responsive';
import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export const HomeCard = ({item, index, onPress}) => {
  const [loading, setLoading] = useState(true);
  
  return (
    <View>
      <Pressable
        style={styles.recomonded_card_parent}
        onPress={() => {
          onPress(item);
        }}>
        <View style={styles.recomonded_card_image}>
          <FastImage
            style={{
              width: '100%',
              height: '100%',
              borderRadius: wp(1),
            }}
            onLoadEnd={() => {
              setLoading(false);
            }}
            resizeMode={FastImage.resizeMode.contain}
            source={
              item?.artwork
                ? {
                    uri: item?.artwork,
                    priority: FastImage.priority.high,
                  }
                : require('../img/unknown_track.png')
            }
          />
          {loading && (
            <FastImage
              style={{
                width: '100%',
                height: '100%',
                borderRadius: wp(1),
              }}
              onLoadEnd={() => {
                setLoading(false);
              }}
              resizeMode={FastImage.resizeMode.contain}
              source={require('../img/unknown_track.png')}
            />
          )}
        </View>
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
            {item?.like ?? 0}/likes
          </Text>
        </View>
      </Pressable>
    </View>
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
    position: 'relative',

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
