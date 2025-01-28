import {
  FlatList,
  StyleSheet,
  Text,
  Animated,
  View,
  Pressable,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {color} from '../styles/style';
import {hp, responsiveui, wp} from '../styles/responsive';
import {HomeCard} from '../components/HomeCard';
import {HomeHoriZontalCard} from '../components/HomeHoriZontalCard';
import {useApiCalls} from '../hooks/useApiCalls';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {MinimisedContainer} from '../components/MinimisedContainer';
import TrackPlayer, {
  useActiveTrack,
  usePlaybackState,
} from 'react-native-track-player';
import {useAddSongs} from '../hooks/useAudio';
import {Hedder} from '../components/homeComponent/HomeHeadder';
import {SearchContainer} from '../components/homeComponent/HomeSearchContainer';
import {EmptyList} from '../components/homeComponent/ListEmptyComponent';
import {useSelectTrack} from '../hooks/useSelectTrack';

const Home = () => {
  const {loading, getAllsongs, recentsongs} = useApiCalls();
  const {setAddNewSongs} = useAddSongs();
  const selectTrack = useSelectTrack();
  const scrollY = new Animated.Value(0);
  const [songsDetails, setSongDetails] = useState(null);
  const [searchSongsDetails, setSearchSongDetails] = useState(null);
  const [activeInput, setActiveInput] = useState(false);
  const [rececntSongs, setRececntSongs] = useState([]);
  const [currentPaginationStatus, setCurrentPaginationStatus] = useState(null);

  useEffect(() => {
    (async () => {
      const {songs, pagination} = await getAllsongs({
        count: 1,
        pageSize: 10,
      });

      setSongDetails(songs);
      setCurrentPaginationStatus(pagination);
      const recent = await recentsongs();
      setRececntSongs(recent);

      const previuseQuee = await TrackPlayer.getQueue();

      // console.log(previuseQuee);

      if (previuseQuee.length > 0) return;
      setAddNewSongs(songs?.slice(0, 8));
    })();

    BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress');
    };
  }, []);

  const handleeClickSearchIcon = () => {
    setActiveInput(true);
  };

  const MinimisedSheet = useMemo(() => {
    return <MinimisedContainer />;
  }, []);

  const handleEndReached = async () => {
    if (currentPaginationStatus?.page === currentPaginationStatus?.totalPages)
      return;

    const {songs, pagination} = await getAllsongs({
      count: currentPaginationStatus?.page + 1, // {"page": 1, "pageSize": 10, "totalCount": 50, "totalPages": 5}
      pageSize: 10,
    });
    setSongDetails(prevstate => [...prevstate, ...songs]);
    setCurrentPaginationStatus(pagination);
  };

  if (!songsDetails)
    return (
      <View style={styles.loadingcontainer}>
        <ActivityIndicator size={'large'} color={color.textWhite} />
      </View>
    );

  return (
    <View style={styles.safeArea}>
      <Hedder scrollY={scrollY} activeInput={activeInput} />
      {activeInput && (
        <SearchContainer
          active={event => {
            if (!event) {
              setSearchSongDetails(null);
            }
            setActiveInput(event);
          }}
          activeInput={activeInput}
          searchResponse={result => {
            setSearchSongDetails(result);
          }}
          songsDetails={songsDetails}
        />
      )}

      <FlatList
        showsVerticalScrollIndicator={false}
        onScroll={({
          nativeEvent: {
            contentOffset: {y},
          },
        }) => scrollY.setValue(y)}
        ListHeaderComponent={() => (
          <>
            <View
              style={[
                styles.search_container,
                activeInput && {marginTop: hp(5)},
              ]}>
              {!activeInput && (
                <View style={{flexDirection: 'row', gap: wp(10)}}>
                  <Text style={styles.search_hedding}>
                    {'Listen The\nLatest Musics'}
                  </Text>
                  <Pressable
                    style={styles.search_box_container}
                    onPress={handleeClickSearchIcon}>
                    <AntDesign size={wp(7)} name="search1" color={'#808080'} />
                  </Pressable>
                </View>
              )}
            </View>
            {rececntSongs.length >= 3 && !activeInput && (
              <>
                <Text style={styles.hedding_2}>Recently Played</Text>
                <View style={{height: responsiveui(0.4)}}>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingLeft: responsiveui(0.05)}}
                    data={rececntSongs}
                    keyExtractor={(_, index) => index?.toString()}
                    renderItem={({item, index}) => (
                      <HomeHoriZontalCard
                        loading={loading}
                        item={item}
                        index={index}
                      />
                    )}
                  />
                </View>
                <Text style={styles.hedding_3}>Recommended for you</Text>
              </>
            )}
          </>
        )}
        data={searchSongsDetails ? searchSongsDetails : songsDetails}
        keyExtractor={(_, index) => index?.toString()}
        style={{
          flex: 1,
        }}
        ListFooterComponentStyle={{
          height:
            (loading && searchSongsDetails && searchSongsDetails?.length > 0) ||
            (songsDetails && songsDetails?.length > 0)
              ? hp(10)
              : hp(2),
        }}
        ListFooterComponent={() =>
          loading &&
          songsDetails &&
          songsDetails?.length > 0 &&
          (!searchSongsDetails || searchSongsDetails?.length === 0) ? (
            <ActivityIndicator size={'large'} color={color.textWhite} />
          ) : null
        }
        ListEmptyComponent={() =>
          !loading || searchSongsDetails ? <EmptyList /> : null
        }
        renderItem={({index, item}) => (
          <HomeCard onPress={selectTrack} index={index} item={item} />
        )}
        onEndReached={handleEndReached}
      />
      {MinimisedSheet}
    </View>
  );
};

export default Home;

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
    position: 'relative',
    paddingBottom: hp(4.5) + wp(4),
  },
  hedder: {
    position: 'absolute',
    elevation: 4,
    height: hp(15),
    top: 0,
    left: 0,
    zIndex: 10,
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
