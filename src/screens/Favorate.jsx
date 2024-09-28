import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeArea} from 'react-native-safe-area-context';
import {color} from '../config/style';
import {hp, responsiveui, wp} from '../config/width_hight_config';
import Animated, {
  FadeInDown,
  FadeInLeft,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import {setCurrentTab} from '../config/redux/reducer';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import AroowBack from 'react-native-vector-icons/Ionicons';
import {useApiCalls} from '../config/useApiCalls';
import json from '../config/dummydata';
import {BASE_URL} from '../config/apicridentiols';

const Favorate = ({navigation}) => {
  const insets = useSafeArea();
  const dispatch = useDispatch();

  const {loading, getAllsongs, likedSongs} = useApiCalls();
  const {profileDetails} = useSelector(
    state => ({
      profileDetails: state.store.profiledetails,
    }),
    shallowEqual,
  );

  const [favorateList, setFavorateList] = useState([]);
  const [allsongs, setAllsongs] = useState([]);

  console.log(allsongs);

  useEffect(() => {
    (async () => {
      const response = await likedSongs();
      if (!response.status) {
        const response = await getAllsongs()
        setAllsongs(response.data);
      } else {
        setFavorateList(response.data);
      }
    })();
  }, []);

  const data = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  ];

  const handleNavigate = (song, index) => {
    dispatch(setCurrentTab('MusicPlayer'));
    navigation.navigate('MusicPlayer', {
      slectedSong: song,
      selectedIndex: index,
    });
  };

  return (
    <ScrollView
      style={[
        styles.safeArea,
        {paddingTop: insets.top === 0 ? hp(5) : insets.top + hp(2)},
      ]}
      showsVerticalScrollIndicator={false}>
      <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={styles.hedder}>
          <AroowBack name="arrow-back" color={color.textWhite} size={wp(7)} />
        </Pressable>
        <Animated.View
          entering={FadeInLeft.delay(200)}
          style={styles.personal_container}>
          <Image
            resizeMode="stretch"
            style={styles.dp_image}
            source={{uri: profileDetails?.profile}}
          />
          <View style={styles.personal_right_contaienr}>
            <Text style={styles.usernaem}>{profileDetails?.username}</Text>
            <Text style={styles.email}>{profileDetails?.email}</Text>
            <Text style={styles.membership}>Gold Member</Text>
            <Text style={styles.discription}>
              Love Music and I am not an Musician.
            </Text>
          </View>
        </Animated.View>
        <Text style={styles.sub_hedding}>
          {favorateList.length > 0 ? 'Favorate Album' : 'Your Album'}
        </Text>
        <FlatList
          scrollEnabled={false}
          keyExtractor={item => item.toString()}
          contentContainerStyle={{
            paddingLeft: responsiveui(0.05),
            paddingRight: responsiveui(0.05) - responsiveui(0.02),
          }}
          numColumns={3}
          data={favorateList.length > 0 ? favorateList : allsongs}
          renderItem={({item, index}) => (
            <Pressable
              style={[
                {
                  marginRight: wp(2.5),
                  marginTop: wp(2.5),
                },
                data.length - 1 === index && {marginBottom: hp(15) + wp(2.5)},
              ]}
              onPress={() => handleNavigate(item, index)}>
              <Animated.Image
                entering={FadeInDown.delay(200 * index)}
                resizeMode="cover"
                style={[styles.favorate_song_thumbnail]}
                source={
                  item?.artwork
                    ? {uri: BASE_URL + item?.artwork}
                    : require('../img/unknown_track.png')
                }
              />
            </Pressable>
          )}
        />
      </Animated.View>
    </ScrollView>
  );
};

export default Favorate;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.bagroundcolor,
    // paddingBottom:
  },
  hedder: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
    borderRadius: wp(1),
  },
  personal_right_contaienr: {
    flex: 2,
    marginLeft: responsiveui(0.05),
  },
  usernaem: {
    color: color.textWhite,
    fontSize: wp(6),
    fontFamily: 'Nunito-SemiBold',
    marginBottom: responsiveui(0.02),
  },
  email: {
    color: color.textdarckgrey,
    marginBottom: responsiveui(0.03),
    fontSize: wp(4),
    fontFamily: 'Nunito-Regular',
  },
  membership: {
    color: color.textdarckgrey,
    fontSize: wp(4),
    fontFamily: 'Nunito-Regular',
    marginBottom: responsiveui(0.03),
  },
  discription: {
    color: color.textdarckgrey,
    fontSize: wp(4),
    fontFamily: 'Nunito-Regular',
  },
  sub_hedding: {
    color: color.textWhite,
    fontSize: wp(6),
    fontFamily: 'Nunito-SemiBold',
    paddingLeft: responsiveui(0.05),
    marginTop: wp(2.5),
    marginBottom: wp(2),
  },
  favorate_song_thumbnail: {
    width: wp(28.25),
    height: wp(28.25),
    borderRadius: wp(1),
  },
});
