import {ScrollView, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {color} from '../config/style';
import {responsiveui} from '../config/width_hight_config';

const BottomSheetUi = () => {
  return (
    <View style={styles.parent_item}>
      <View style={styles.image}>
        <Image
          resizeMode="cover"
          style={{width: '100%', height: '100%'}}
          source={require('../img/Rectangle.png')}
        />
      </View>
      <View style={styles.text_container}>
        <Text style={styles.song_name}>Gundellonaa</Text>
        <Text style={styles.singer}>Leaon James and Anirudh Ravichandre</Text>
      </View>
    </View>
  );
};

export default BottomSheetUi;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.modal_baground,
  },
  parent_item: {
    width: '100%',
    paddingHorizontal: responsiveui(0.05),
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: responsiveui(0.05),
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
