import {FlatList, Pressable, StyleSheet, View, Text} from 'react-native';
import {useQueue} from '../../trackplayer/useQueur';
import {color} from '../../styles/style';
import {responsiveui, wp} from '../../styles/responsive';
import FastImage from 'react-native-fast-image';
import TrackPlayer, {
  useActiveTrack,
  usePlaybackState,
} from 'react-native-track-player';

export const BottomSheetList = ({queelists}) => {
  const activeID = useActiveTrack();
  const songProgressing = usePlaybackState();

  const onSelectSong = async index => {
    if (
      songProgressing.state === 'loading' ||
      songProgressing.state === 'buffering'
    )
      return;
    await TrackPlayer.skip(index);
    await TrackPlayer.play(); 
  };
  return (
    <FlatList
      data={queelists}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item, index}) => (
        <Pressable
          style={styles.parent_item}
          onPress={() => onSelectSong(index)}>
          <View style={{flexDirection: 'row', overflow: 'hidden'}}>
            <View style={styles.image}>
              <FastImage
                resizeMode={FastImage.resizeMode.cover}
                source={
                  item?.artwork
                    ? {
                        uri: item?.artwork?.includes('http')
                          ? item?.artwork
                          : item?.artwork?.includes('https')
                          ? item?.artwork
                          : item?.artwork,
                        priority: FastImage.priority.high,
                      }
                    : require('../../img/unknown_track.png')
                }
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  borderRadius: wp(1),
                }}
              />
            </View>
            <View style={styles.text_container}>
              <Text
                style={[
                  styles.song_name,
                  item?._id === activeID?._id && {color: color.selectSongtitle},
                ]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item?.title || 'Unknown'}
              </Text>
              <Text
                style={[
                  styles.singer,
                  item?._id === activeID?._id && {
                    color: color.selectSongartist,
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item?.artist || 'Unknown'}
              </Text>
            </View>
          </View>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.modal_baground,
    // opacity:0.01
  },
  parent_item: {
    width: '100%',
    // paddingHorizontal: wp(1),
    paddingHorizontal: wp(5),
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
    borderRadius: responsiveui(0.01),
  },
  text_container: {
    width: wp(72),
    marginLeft: wp(4),
    paddingRight: wp(2.5),
    // maxWidth: wp(63),
  },
  song_name: {
    color: color.textWhite,
    fontFamily: 'Nunito-ExtraBold',
    fontSize: responsiveui(0.045),
  },
  singer: {
    color: color.textdarckgrey,
    fontFamily: 'Nunito-Bold',
    fontSize: responsiveui(0.04),
    overflow: 'hidden',
    // marginTop: responsiveui(0.015),
  },
});
