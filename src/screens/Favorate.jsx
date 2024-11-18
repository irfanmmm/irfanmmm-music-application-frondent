import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {useSafeArea} from 'react-native-safe-area-context';
import {color} from '../styles/style';
import {hp, responsiveui, wp} from '../styles/responsive';
import Animated, {
  FadeInDown,
  FadeInLeft,
  SlideInLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useApiCalls} from '../hooks/useApiCalls';
import {MinimisedContainer} from '../components/MinimisedContainer';
import TrackPlayer from 'react-native-track-player';
import {ArrowLeft} from 'react-native-feather';
import FastImage from 'react-native-fast-image';
import {useIsFocused} from '@react-navigation/native';

const Favorate = ({navigation}) => {
  const insets = useSafeArea();
  const isFocused = useIsFocused();

  const {loading, getAllsongs, likedSongs} = useApiCalls();
  const {profileDetails} = useSelector(
    state => ({
      profileDetails: state.store.profiledetails,
    }),
    shallowEqual,
  );
  const [imageLoading, setImageLoading] = useState(true);

  const [favorateList, setFavorateList] = useState([]);
  const [allsongs, setAllsongs] = useState([]);

  useEffect(() => {
    (async () => {
      const liked = await likedSongs();
      setFavorateList(liked);
      const response = await getAllsongs({
        count: 1,
        pageSize: 10,
      });
      setAllsongs(response.songs);
    })();
  }, [isFocused]);

  const handleNavigate = async (_, index) => {
    try {
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
    } catch (error) {
      console.log(error);
    }
  };

  
  const MinimisedSheet = useMemo(() => {
    return <MinimisedContainer />;
  }, []);
  
  if (loading)
    return (
      <View style={styles.loadingcontainer}>
        <ActivityIndicator size={'large'} color={color.textWhite} />
        {MinimisedSheet}
      </View>
    );

  


  return (
    <View
      style={{
        position: 'relative',
        flex: 1,
      }}>
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
            <ArrowLeft
              stroke={color.textWhite}
              width={wp(7)}
              height={wp(7)}
              strokeWidth={1.5}
            />
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
            {favorateList?.length > 0 ? 'Favorate Album' : 'Your Album'}
          </Text>
          <FlatList
            scrollEnabled={false}
            keyExtractor={item => item.toString()}
            contentContainerStyle={{
              paddingLeft: responsiveui(0.05),
              paddingRight: responsiveui(0.05) - responsiveui(0.02),
            }}
            numColumns={3}
            data={favorateList?.length > 0 ? favorateList : allsongs}
            renderItem={({item, index}) => (
              <Pressable
                style={[
                  {
                    marginRight: wp(2.5),
                    marginTop: wp(2.5),
                    marginBottom:
                      favorateList?.length > 0 &&
                      favorateList.length - 1 === index &&
                      favorateList?.length < !10
                        ? hp(20)
                        : allsongs.length - 1 === index &&
                          favorateList?.length < !10
                        ? hp(20)
                        : 0,
                  },
                ]}
                onPress={() => handleNavigate(item, index)}>
                <Animated.Image
                  entering={FadeInDown.delay(200 * index)}
                  resizeMode="cover"
                  style={[styles.favorate_song_thumbnail]}
                  onLoadEnd={() => {
                    setImageLoading(false);
                  }}
                  source={
                    item?.artwork
                      ? {uri: item?.artwork}
                      : require('../img/unknown_track.png')
                  }
                />

                {imageLoading && (
                  <FastImage
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: wp(1),
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                    source={require('../img/unknown_track.png')}
                  />
                )}
              </Pressable>
            )}
          />

          {favorateList?.length < 10 && (
            <>
              <Text style={styles.sub_hedding}>Recommended for you</Text>
              <FlatList
                scrollEnabled={false}
                keyExtractor={item => item.toString()}
                contentContainerStyle={{
                  paddingLeft: responsiveui(0.05),
                  paddingRight: responsiveui(0.05) - responsiveui(0.02),
                }}
                numColumns={3}
                data={allsongs}
                renderItem={({item, index}) => (
                  <Pressable
                    style={[
                      {
                        marginRight: wp(2.5),
                        marginTop: wp(2.5),
                        marginBottom:
                          allsongs?.length - 1 === index ? hp(20) : 0,
                      },
                    ]}
                    onPress={() => handleNavigate(item, index)}>
                    <Animated.Image
                      entering={FadeInDown.delay(200 * index)}
                      resizeMode="cover"
                      style={[styles.favorate_song_thumbnail]}
                      source={
                        item?.artwork
                          ? {uri: item?.artwork}
                          : require('../img/unknown_track.png')
                      }
                    />
                  </Pressable>
                )}
              />
            </>
          )}
        </Animated.View>
      </ScrollView>
      {MinimisedSheet}
    </View>
  );
};

export default Favorate;

const styles = StyleSheet.create({
  loadingcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.bottomsheet_color,
  },
  safeArea: {
    flex: 1,
    backgroundColor: color.bagroundcolor,
    // paddingBottom:
    paddingBottom: hp(4.5) + wp(4),
  },
  hedder: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: responsiveui(0.05),
    marginTop: hp(2),
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
