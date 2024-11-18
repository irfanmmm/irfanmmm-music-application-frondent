import {useEffect, useState} from 'react';
import TrackPlayer from 'react-native-track-player';

export const useAddSongs = () => {
  const [addNewSongs, setAddNewSongs] = useState([]);

  console.log(addNewSongs, 'qwertyuiopqwertyuio');
  
  useEffect(() => {
    if (addNewSongs.length > 0) {
      TrackPlayer.reset().then(() => {
        TrackPlayer.add(addNewSongs);
      });
    }
  }, [addNewSongs]);

  return {setAddNewSongs};
};
