import {useEffect, useState} from 'react';
import TrackPlayer, {Event} from 'react-native-track-player';

export const useQueue = () => {
  const [suffleQueelist, setSuffleQueelist] = useState(false);
  const [queelists, setQueelist] = useState(null);

  useEffect(() => {
    const fetchQueue = async () => {
      const songs = await TrackPlayer.getQueue();
      setQueelist(songs);
    };

    const shuffleQueue = async () => {
      const songs = await TrackPlayer.getQueue();
      const shuffledSongs = songs.slice().sort(() => Math.random() - 0.5);
      await TrackPlayer.reset();
      await TrackPlayer.add(shuffledSongs);
      setQueelist(shuffledSongs);
      TrackPlayer.play();
    };

    const handleQueueEnded = async () => {
      if (suffleQueelist) {
        await shuffleQueue();
      }
    };

    fetchQueue();

    if (suffleQueelist) {
      TrackPlayer.addEventListener(Event.PlaybackQueueEnded, handleQueueEnded);
    }

    return () => {
      TrackPlayer.remove();
    };
  }, [suffleQueelist]);

  return {queelists, suffleQueelist, setSuffleQueelist};
};
