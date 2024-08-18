import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Animated,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { hp, responsiveui, wp } from '../config/width_hight_config';
import { color } from '../config/style';
import { HomeCard } from '../components/HomeCard';
import { HomeHoriZontalCard } from '../components/HomeHoriZontalCard';
import { useApiCalls } from '../config/useApiCalls';
import { setProfile } from '../config/redux/reducer';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

const Home = () => {
  const dispatch = useDispatch()
  const insets = useSafeArea();
  const { getProfileDetails, loading, getAllsongs, recentsongs } = useApiCalls()

  const state = useSelector(state => ({
    profileDetails: state.store.profiledetails
  }), shallowEqual)

  const scrollY = new Animated.Value(0)
  const diffClamp = Animated.diffClamp(scrollY, 0, hp(15))
  const translateY = diffClamp.interpolate({
    inputRange: [0, hp(15)],
    outputRange: [0, -hp(15)]
  })

  const [songsDetails, setSongDetails] = useState([])
  const [rececntSongs, setRececntSongs] = useState([])



  useEffect(() => {
    (async () => {
      const response = await getProfileDetails();
      dispatch(setProfile(response));

      const reponse = await getAllsongs();
      setSongDetails(reponse.data);

      const recent = await recentsongs();
      if (recent.status) {
        console.log(recent?.data, 'sahjhjashs');

        setRececntSongs(recent?.data);
      }
    })()
  }, [])

  return (
    <View style={styles.safeArea}>
      <Animated.View style={[styles.hedder,
      {
        paddingTop: insets.top === 0 ? hp(5) :
          insets.top + hp(2), transform: [{ translateY: translateY }]
      }]}>
        <Image
          resizeMode={'cover'}
          source={state.profileDetails?.profile ? { uri: state.profileDetails?.profile } : require('../img/person.jpg')}
          style={styles.profid}
        />
        <View style={styles.hedder_center}>
          <Text style={styles.name_person}>{state.profileDetails?.username ? state.profileDetails.username : 'Sarwar Jahan'}</Text>
          <Text style={styles.hedder_discription}>Gold Member</Text>
        </View>
        <Image source={require('../img/bell.png')} />
      </Animated.View>
      <ScrollView

        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent: { contentOffset: { y } } }) => scrollY.setValue(y)}>
        <View style={styles.search_container}>
          <Text style={styles.search_hedding}>
            {'Listen The\nLatest Musics'}
          </Text>
          <View style={styles.search_box_container}>
            <Image style={styles.search_icon} source={require('../img/search-icon-grey.png')} />
          </View>
        </View>
        {rececntSongs.length > 0 && <>
          <Text style={styles.hedding_2}>Recently Played</Text>
          <View style={{ height: responsiveui(0.4) }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: responsiveui(0.05) }} // Optional, for some padding on the sides
              data={rececntSongs}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <HomeHoriZontalCard item={item} index={index} />
              )}
            />
          </View>
          <Text style={styles.hedding_3}>Recommended for you</Text>
        </>}
        {songsDetails.map((item, i) => {
          return <HomeCard key={i} item={item} index={i} />
        })}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.bagroundcolor,
    overflowy: 'scroll',
    position: 'relative',
    paddingBottom: hp(4.5) + wp(4)
  },
  hedder: {
    position: 'absolute',
    elevation: 4,
    height: hp(15),
    top: 0,
    left: 0,
    zIndex: 50,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveui(0.05),
    backgroundColor: color.bagroundcolor,
  },
  recomonded_card_parent: {
    paddingLeft: responsiveui(0.05),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(4),
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveui(0.05),
    marginTop: hp(15),
    marginBottom: wp(7.5),
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
  search_icon: {
    width: wp(8),
    height: wp(8),
  },
  search_box: {
    marginLeft: responsiveui(0.055),
    fontSize: wp(6),
  },
  hedding_2: {
    color: color.textWhite,

    marginBottom: wp(4),
    paddingLeft: responsiveui(0.05),
    color: color.textWhite,
    fontSize: wp(6),
    fontFamily: 'Nunito-SemiBold',
  },
  hedding_3: {
    marginTop: wp(2.5),
    marginBottom: wp(4),
    paddingLeft: responsiveui(0.05),
    color: color.textWhite,
    fontSize: wp(6),
    fontFamily: 'Nunito-SemiBold',
  },
});
