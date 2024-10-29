import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {FadeInRight} from 'react-native-reanimated';
import {color} from '../styles/style';
import {wp} from '../styles/responsive';
import {useNavigation} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import TextTicker from 'react-native-text-ticker';

export const HomeHoriZontalCard = ({item, index, loading}) => {
  const navigation = useNavigation();
  return (
    <Animated.View
      entering={FadeInRight.delay(100 * index)}
      style={styles.recentlyplayd_card_parent}>
      <Pressable
        style={{height: wp(30)}}
        onPress={() => {
          navigation.navigate('MusicPlayer', {
            slectedSong: item,
            selectedIndex: index,
          });
        }}>
        {loading ? (
          <SkeletonPlaceholder borderRadius={4} direction="left">
            <View style={styles.recentlyplayd_card_image} />
          </SkeletonPlaceholder>
        ) : (
          <Image
            resizeMode="cover"
            style={styles.recentlyplayd_card_image}
            source={
              item?.artwork
                ? {uri: item?.artwork}
                : require('../img/unknown_track.png')
            }
          />
        )}
        {loading ? (
          <SkeletonPlaceholder borderRadius={4} direction="left">
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View
                style={{
                  width: wp(20),
                  height: wp(3),
                  marginTop: wp(2),
                  borderRadius: wp(1),
                }}
              />
            </View>
          </SkeletonPlaceholder>
        ) : (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.recentlyplayd_card_text}>
            {item?.title}
          </Text>
          // <TextTicker
          //   style={styles.recentlyplayd_card_text}
          //   duration={10000}
          //   loop
          //   bounce
          //   repeatSpacer={50}
          //   marqueeDelay={1000}>
          //   {item?.title}
          // </TextTicker>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  recentlyplayd_card_parent: {
    width: wp(30),
    height: wp(30),
    marginRight: wp(4),
  },
  recentlyplayd_card_image: {
    width: '100%',
    height: '100%',
    borderRadius: wp(2),
    elevation: 100,
  },
  recentlyplayd_card_text: {
    fontSize: wp(4),
    textAlign: 'center',
    color: color.textWhite,
    marginTop: wp(2),
    fontFamily: 'Nunito-SemiBold',
  },
});
