import {useEffect, useState} from 'react';
import TrackPlayer from 'react-native-track-player';

export const useAddSongs = () => {
  const [addNewSongs, setAddNewSongs] = useState([]);

  useEffect(() => {
    TrackPlayer.reset().then(() => {
      TrackPlayer.add(addNewSongs);
    });
  }, [addNewSongs]);

  return {setAddNewSongs};
};
