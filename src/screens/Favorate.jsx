import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {useSafeArea} from 'react-native-safe-area-context';
import {color} from '../config/style';
import {hp, responsiveui} from '../config/width_hight_config';

const Favorate = props => {
  const insets = useSafeArea();

  return (
    <ScrollView
      style={[styles.safeArea, {paddingTop: insets.top + hp(2)}]}
      showsVerticalScrollIndicator={false}>
      <View
        onStartShouldSetResponder={e => {
          props?.route?.params.showTabBar
            ? props?.route?.params?.handleTabPress(true)
            : props?.route?.params?.handleTabPress(false);
        }}>
        <View style={styles.hedder}>
          <Image source={require('../img/arrow-left.png')} />
        </View>
        <View style={styles.personal_container}>
          <Image
            resizeMode="cover"
            style={styles.dp_image}
            source={require('../img/Rectangle.png')}
          />
          <View style={styles.personal_right_contaienr}>
            <Text style={styles.usernaem}>Sarwar Jahan</Text>
            <Text style={styles.email}>sarwarmusic@gmail.com</Text>
            <Text style={styles.membership}>Gold Member</Text>
            <Text style={styles.discription}>
              Love Music and I am not an Musician.
            </Text>
          </View>
        </View>
        <Text style={styles.sub_hedding}>Favorate Album</Text>

        <FlatList
          scrollEnabled={false}
          keyExtractor={item => item.toString()}
          contentContainerStyle={{
            paddingLeft: responsiveui(0.05),
            paddingRight: responsiveui(0.05) - responsiveui(0.02),
          }}
          numColumns={3}
          data={[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          ]}
          renderItem={() => (
            <Image
              resizeMode="cover"
              style={styles.favorate_song_thumbnail}
              source={require('../img/Rectangle.png')}
            />
          )}
        />
      </View>
    </ScrollView>
  );
};

export default Favorate;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.bagroundcolor,
  },
  hedder: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // paddingTop: responsiveui(0.05),
    paddingLeft: responsiveui(0.05),
  },
  personal_container: {
    paddingHorizontal: responsiveui(0.1),
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: responsiveui(0.08),
  },
  dp_image: {
    flex: 1,
    height: responsiveui(0.3),
    borderRadius: responsiveui(0.03),
  },
  personal_right_contaienr: {
    flex: 2,
    marginLeft: responsiveui(0.05),
  },
  usernaem: {
    color: color.textWhite,
    fontSize: responsiveui(0.065),
    fontFamily: 'Nunito-SemiBold',
    marginBottom: responsiveui(0.02),
  },
  email: {
    color: color.textdarckgrey,
    marginBottom: responsiveui(0.03),
    fontSize: responsiveui(0.035),
  },
  membership: {
    color: color.textdarckgrey,
    fontFamily: 'Nunito-Regular',
    fontSize: responsiveui(0.04),
    marginBottom: responsiveui(0.03),
  },
  discription: {
    color: color.textdarckgrey,
    fontFamily: 'Nunito-Regular',
    fontSize: responsiveui(0.04),
  },
  sub_hedding: {
    color: color.textWhite,
    fontSize: responsiveui(0.065),
    fontFamily: 'Nunito-SemiBold',
    paddingLeft: responsiveui(0.05),
    paddingTop: responsiveui(0.1),
    paddingBottom: responsiveui(0.05),
  },
  favorate_song_thumbnail: {
    width: responsiveui(0.285),
    height: responsiveui(0.3),
    borderRadius: responsiveui(0.03),
    marginRight: responsiveui(0.02),
    marginBottom: responsiveui(0.05),
  },
});
