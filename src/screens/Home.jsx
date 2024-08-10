import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import React from 'react';
import {useSafeArea} from 'react-native-safe-area-context';
import {hp, responsiveui} from '../config/width_hight_config';
import {color} from '../config/style';

const Home = props => {
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
          <Image
            resizeMode={'cover'}
            source={require('../img/person.jpg')}
            style={styles.profid}
          />
          <View style={styles.hedder_center}>
            <Text style={styles.name_person}>Sarwar Jahan</Text>
            <Text style={styles.hedder_discription}>Gold Member</Text>
          </View>
          <Image source={require('../img/bell.png')} />
        </View>
        <View style={styles.search_container}>
          <Text style={styles.search_hedding}>
            {'Listen The\nLatest Musics'}
          </Text>
          <View style={styles.search_box_container}>
            <Icon name={'search'} size={responsiveui(0.055)} color={'grey'} />
            {/* <TextInput
          keyboardType='email-address'
            style={styles.search_box}
            placeholderTextColor={'grey'}
            placeholder="Search Music"
          /> */}
          </View>
        </View>
        <Text style={styles.hedding_2}>Recently Played</Text>
        <View style={{height: responsiveui(0.4)}}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingLeft: responsiveui(0.05)}} // Optional, for some padding on the sides
            // style={{flex:1}}
            data={[1, 2, 3, 4]}
            keyExtractor={item => item.toString()}
            renderItem={() => (
              <View style={styles.recentlyplayd_card_parent}>
                <Image
                  resizeMode="cover"
                  style={styles.recentlyplayd_card_image}
                  source={require('../img/Rectangle.png')}
                />
                <Text style={styles.recentlyplayd_card_text}>The traingle</Text>
              </View>
            )}
          />
        </View>
        <Text style={styles.hedding_3}>Recommended for you</Text>
        {Array.from({length: 6}).map((_, i) => (
          <View style={styles.recomonded_card_parent} key={i}>
            <Image
              resizeMode="cover"
              style={styles.recomonded_card_image}
              source={require('../img/Rectangle.png')}
            />
            <View style={styles.recomonded_card_right}>
              <Text style={styles.recomonded_card_text}>Take care of you</Text>
              <Text style={styles.recomonded_card_text2}>Admin Thembi</Text>
              <Text style={styles.recomonded_card_text2}>114k/steams</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.bagroundcolor,
    overflowy: 'scroll',
  },
  hedder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: responsiveui(0.05),
  },
  profid: {
    width: responsiveui(0.12),
    height: responsiveui(0.12),
    borderRadius: responsiveui(0.12) / 2,
  },
  hedder_center: {
    flex: 3,
    alignItems: 'flex-start',
    paddingLeft: responsiveui(0.025),
  },
  name_person: {
    color: color.textWhite,
    fontSize: responsiveui(0.055),
    fontFamily: 'Nunito-SemiBold',
  },
  hedder_discription: {
    fontSize: responsiveui(0.038),
    color: '#DEDEDE',
    fontFamily: 'Nunito-Regular',
  },
  search_container: {
    marginTop: responsiveui(0.055),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveui(0.05),
  },
  search_hedding: {
    color: color.textWhite,
    fontSize: responsiveui(0.068),
    fontFamily: 'Nunito-SemiBold',
  },
  search_box_container: {
    width: responsiveui(0.385),
    flexDirection: 'row',
    alignItems: 'center',
  },
  search_box: {
    marginLeft: responsiveui(0.055),
    fontSize: responsiveui(0.045),
  },
  hedding_2: {
    color: color.textWhite,
    marginTop: responsiveui(0.1),
    marginBottom: responsiveui(0.05),
    paddingLeft: responsiveui(0.05),
    color: color.textWhite,
    fontSize: responsiveui(0.065),
    fontFamily: 'Nunito-SemiBold',
  },
  recentlyplayd_card_parent: {
    width: responsiveui(0.33),
    height: responsiveui(0.3),
    marginRight: responsiveui(0.05),
  },
  recentlyplayd_card_image: {
    width: '100%',
    height: '100%',
    borderRadius: responsiveui(0.05),
  },
  recentlyplayd_card_text: {
    fontSize: responsiveui(0.05),
    color: color.textWhite,
    textAlign: 'center',
    marginTop: responsiveui(0.02),
    fontFamily: 'Nunito-Regular',
  },
  hedding_3: {
    marginTop: responsiveui(0.04),
    marginBottom: responsiveui(0.05),
    paddingLeft: responsiveui(0.05),
    color: color.textWhite,
    fontSize: responsiveui(0.065),
    fontFamily: 'Nunito-SemiBold',
  },
  recomonded_card_parent: {
    paddingLeft: responsiveui(0.05),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveui(0.04),
  },
  recomonded_card_image: {
    width: responsiveui(0.28),
    height: responsiveui(0.28),
    marginRight: responsiveui(0.04),
    borderRadius: responsiveui(0.025),
  },
  recomonded_card_right: {},
  recomonded_card_text: {
    color: color.textWhite,
    fontSize: responsiveui(0.05),
    fontFamily: 'Nunito-Regular',
  },
  recomonded_card_text2: {
    color: color.textgrey,
    fontFamily: 'Nunito-Regular',
    fontSize: responsiveui(0.04),
    marginTop: responsiveui(0.01),
  },
});
